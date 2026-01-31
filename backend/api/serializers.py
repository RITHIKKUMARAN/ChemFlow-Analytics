"""
DRF Serializers for API endpoints
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Dataset, Equipment


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class EquipmentSerializer(serializers.ModelSerializer):
    """Serializer for Equipment model"""
    class Meta:
        model = Equipment
        fields = ['id', 'equipment_id', 'equipment_type', 'flowrate', 'pressure', 'temperature']


class DatasetSerializer(serializers.ModelSerializer):
    """Serializer for Dataset model with equipment count"""
    equipment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Dataset
        fields = ['id', 'filename', 'upload_timestamp', 'total_equipment_count', 'equipment_count']
        
    def get_equipment_count(self, obj):
        return obj.equipment.count()


class DatasetDetailSerializer(serializers.ModelSerializer):
    """Detailed dataset serializer with equipment data"""
    equipment = EquipmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Dataset
        fields = ['id', 'filename', 'upload_timestamp', 'total_equipment_count', 'equipment']


class SummarySerializer(serializers.Serializer):
    """Serializer for summary statistics"""
    total_equipment = serializers.IntegerField()
    avg_flowrate = serializers.FloatField()
    avg_pressure = serializers.FloatField()
    avg_temperature = serializers.FloatField()
    equipment_type_distribution = serializers.DictField()
    dataset_info = DatasetSerializer()
