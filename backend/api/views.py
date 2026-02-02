"""
API Views for Chemical Equipment Visualizer
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.http import FileResponse
from .models import Dataset, Equipment
from .serializers import (
    UserSerializer, DatasetSerializer, DatasetDetailSerializer,
    EquipmentSerializer, SummarySerializer
)
from .utils import parse_csv_file, compute_statistics, generate_pdf_report


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    POST /api/auth/register
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user and return JWT tokens
    POST /api/auth/login
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    """
    Upload and parse CSV file
    POST /api/upload-csv
    """
    if 'file' not in request.FILES:
        return Response({
            'error': 'No file provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    csv_file = request.FILES['file']
    
    # Validate file extension
    allowed_extensions = ['.csv', '.xls', '.xlsx']
    if not any(csv_file.name.lower().endswith(ext) for ext in allowed_extensions):
        return Response({
            'error': 'File must be a CSV or Excel (.xlsx) file'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Parse CSV
    success, result = parse_csv_file(csv_file)
    
    if not success:
        return Response({
            'error': result
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # result is a DataFrame
    df = result
    
    # Check dataset limit - keep only last 5
    user_datasets = Dataset.objects.filter(user=request.user).order_by('-upload_timestamp')
    if user_datasets.count() >= settings.MAX_DATASETS_PER_USER:
        # Delete oldest datasets
        datasets_to_delete = user_datasets[settings.MAX_DATASETS_PER_USER - 1:]
        for dataset in datasets_to_delete:
            dataset.delete()
    
    # Create new dataset
    dataset = Dataset.objects.create(
        user=request.user,
        filename=csv_file.name,
        total_equipment_count=len(df)
    )
    
    # Detect anomalies
    from .utils import detect_anomalies
    statuses = detect_anomalies(df)
    
    # Bulk create equipment records
    equipment_objects = []
    for index, row in df.iterrows():
        equipment_objects.append(Equipment(
            dataset=dataset,
            equipment_id=str(row['Equipment_ID']),
            equipment_type=str(row['Equipment_Type']),
            flowrate=float(row['Flowrate']),
            pressure=float(row['Pressure']),
            temperature=float(row['Temperature']),
            status=statuses[index]
        ))
    
    Equipment.objects.bulk_create(equipment_objects)
    
    # Compute statistics
    stats = compute_statistics(dataset.id)
    
    return Response({
        'message': 'CSV uploaded successfully',
        'dataset': DatasetSerializer(dataset).data,
        'statistics': stats
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_summary(request):
    """
    Get summary statistics for the latest dataset
    GET /api/summary?dataset_id=<id>
    """
    dataset_id = request.query_params.get('dataset_id')
    
    if dataset_id:
        # Get specific dataset
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=request.user)
        except Dataset.DoesNotExist:
            return Response({
                'error': 'Dataset not found'
            }, status=status.HTTP_404_NOT_FOUND)
    else:
        # Get latest dataset
        dataset = Dataset.objects.filter(user=request.user).first()
        
        if not dataset:
            return Response({
                'error': 'No datasets found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    # Compute statistics
    stats = compute_statistics(dataset.id)
    stats['dataset_info'] = DatasetSerializer(dataset).data
    
    # Get equipment data
    equipment = Equipment.objects.filter(dataset=dataset)
    stats['equipment_data'] = EquipmentSerializer(equipment, many=True).data
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    """
    Get history of last 5 datasets
    GET /api/history
    """
    datasets = Dataset.objects.filter(user=request.user)[:5]
    serializer = DatasetSerializer(datasets, many=True)
    
    return Response({
        'datasets': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_report_pdf(request):
    """
    Generate and download PDF report
    GET /api/report/pdf?dataset_id=<id>
    """
    dataset_id = request.query_params.get('dataset_id')
    
    if dataset_id:
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=request.user)
        except Dataset.DoesNotExist:
            return Response({
                'error': 'Dataset not found'
            }, status=status.HTTP_404_NOT_FOUND)
    else:
        # Get latest dataset
        dataset = Dataset.objects.filter(user=request.user).first()
        
        if not dataset:
            return Response({
                'error': 'No datasets found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    # Compute statistics
    statistics = compute_statistics(dataset.id)
    
    # Generate PDF
    pdf_buffer = generate_pdf_report(dataset, statistics)
    
    # Return as file response
    response = FileResponse(pdf_buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="equipment_report_{dataset.id}.pdf"'
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dataset_detail(request, dataset_id):
    """
    Get detailed dataset with all equipment
    GET /api/dataset/<id>
    """
    try:
        dataset = Dataset.objects.get(id=dataset_id, user=request.user)
    except Dataset.DoesNotExist:
        return Response({
            'error': 'Dataset not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DatasetDetailSerializer(dataset)
    return Response(serializer.data, status=status.HTTP_200_OK)
