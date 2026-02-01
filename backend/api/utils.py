"""
Utility functions for CSV parsing, statistics computation, and PDF generation
"""
import pandas as pd
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from django.db.models import Avg, Count
from django.utils.timezone import localtime
from .models import Equipment
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

def parse_csv_file(file_obj):
    """
    Parse uploaded file (CSV or Excel) using Pandas
    
    Args:
        file_obj: Django UploadedFile object
        
    Returns:
        tuple: (success: bool, data: DataFrame or error_message: str)
    """
    try:
        filename = file_obj.name.lower()
        df = None
        
        if filename.endswith(('.xls', '.xlsx')):
            try:
                df = pd.read_excel(file_obj)
            except Exception as e:
                return False, f"Error reading Excel file: {str(e)}"
        else:
            # Try different encodings for CSV
            encodings = ['utf-8', 'latin-1', 'cp1252', 'ISO-8859-1']
            for encoding in encodings:
                try:
                    file_obj.seek(0)
                    df = pd.read_csv(file_obj, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    continue
            
            if df is None:
                return False, "Failed to decode CSV file. Please check file encoding."

        # Map sample data headers to model fields
        # Normalize column names to title case to match potential inputs like "equipment name" -> "Equipment Name"
        df.columns = [c.strip() for c in df.columns]
        
        # Smart column mapping
        column_mapping = {
            'Equipment Name': 'Equipment_ID',
            'Equipment Name': 'Equipment_ID', # Duplicate for safety
            'Name': 'Equipment_ID',
            'ID': 'Equipment_ID',
            'Type': 'Equipment_Type',
            'Category': 'Equipment_Type',
            'Flow': 'Flowrate',
            'Flow Rate': 'Flowrate',
            'Temp': 'Temperature',
            'Temp.': 'Temperature',
            'Press': 'Pressure',
            'Press.': 'Pressure'
        }
        
        df = df.rename(columns=column_mapping)
        
        required_columns = ['Equipment_ID', 'Equipment_Type', 'Flowrate', 'Pressure', 'Temperature']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return False, f"Missing required columns: {', '.join(missing_columns)}"
        
        # Check for empty dataframe
        if df.empty:
            return False, "File is empty"
        
        # Clean data - remove rows with NaN values
        df = df.dropna(subset=required_columns)
        
        if df.empty:
            return False, "No valid data rows found after removing incomplete entries"
        
        # Validate numeric columns
        try:
            df['Flowrate'] = pd.to_numeric(df['Flowrate'])
            df['Pressure'] = pd.to_numeric(df['Pressure'])
            df['Temperature'] = pd.to_numeric(df['Temperature'])
        except ValueError as e:
            return False, f"Invalid numeric values: {str(e)}"
        
        return True, df
        
    except pd.errors.EmptyDataError:
        return False, "File is empty"
    except Exception as e:
        return False, f"Error reading file: {str(e)}"


def compute_statistics(dataset_id):
    """
    Compute summary statistics for a dataset
    
    Args:
        dataset_id: ID of the Dataset object
        
    Returns:
        dict: Summary statistics
    """
    equipment_queryset = Equipment.objects.filter(dataset_id=dataset_id)
    
    # Compute averages
    stats = equipment_queryset.aggregate(
        avg_flowrate=Avg('flowrate'),
        avg_pressure=Avg('pressure'),
        avg_temperature=Avg('temperature'),
        total_equipment=Count('id')
    )
    
    # Compute equipment type distribution
    type_distribution = {}
    type_counts = equipment_queryset.values('equipment_type').annotate(count=Count('id'))
    for item in type_counts:
        type_distribution[item['equipment_type']] = item['count']
    
    return {
        'total_equipment': stats['total_equipment'],
        'avg_flowrate': round(stats['avg_flowrate'], 2) if stats['avg_flowrate'] else 0,
        'avg_pressure': round(stats['avg_pressure'], 2) if stats['avg_pressure'] else 0,
        'avg_temperature': round(stats['avg_temperature'], 2) if stats['avg_temperature'] else 0,
        'equipment_type_distribution': type_distribution
    }


def generate_chart_image(dataset_id, chart_type='distribution'):
    """Generate chart and return as BytesIO"""
    plt.figure(figsize=(7, 4))
    
    # Fetch data
    equipment = Equipment.objects.filter(dataset_id=dataset_id)
    df = pd.DataFrame(list(equipment.values()))
    
    buf = BytesIO()
    
    if chart_type == 'distribution':
        sns.set_style("darkgrid")
        ax = sns.countplot(data=df, x='equipment_type', palette='viridis')
        plt.title('Equipment Distribution', fontsize=14, pad=10)
        plt.xlabel('Equipment Type')
        plt.ylabel('Count')
        plt.xticks(rotation=45)
        plt.tight_layout()
        
    elif chart_type == 'parameters':
        fig, axes = plt.subplots(1, 3, figsize=(8, 4))
        sns.set_style("whitegrid")
        
        sns.boxplot(y=df['flowrate'], ax=axes[0], color='#4F8CFF')
        axes[0].set_title('Flowrate (m³/h)')
        axes[0].set_ylabel('')
        
        sns.boxplot(y=df['pressure'], ax=axes[1], color='#2ED573')
        axes[1].set_title('Pressure (Bar)')
        axes[1].set_ylabel('')
        
        sns.boxplot(y=df['temperature'], ax=axes[2], color='#FF4757')
        axes[2].set_title('Temp (°C)')
        axes[2].set_ylabel('')
        
        plt.tight_layout()

    plt.savefig(buf, format='png', dpi=150)
    plt.close()
    buf.seek(0)
    return buf

def generate_pdf_report(dataset, statistics):
    """
    Generate PDF report using ReportLab with Charts
    
    Args:
        dataset: Dataset model instance
        statistics: Dictionary of computed statistics
        
    Returns:
        BytesIO: PDF file buffer
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2c5282'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Title
    title = Paragraph("Chemical Equipment Parameter Report", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.3*inch))
    
    # Dataset Information
    dataset_info = [
        ['Dataset Information', ''],
        ['Filename:', dataset.filename],
        ['Upload Date:', localtime(dataset.upload_timestamp).strftime('%Y-%m-%d %H:%M:%S')],
        ['Total Equipment:', str(statistics['total_equipment'])],
    ]
    
    dataset_table = Table(dataset_info, colWidths=[2.5*inch, 4*inch])
    dataset_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5282')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
    ]))
    elements.append(dataset_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Summary Statistics
    elements.append(Paragraph("Summary Statistics", heading_style))
    
    summary_data = [
        ['Metric', 'Value'],
        ['Average Flowrate', f"{statistics['avg_flowrate']:.2f}"],
        ['Average Pressure', f"{statistics['avg_pressure']:.2f}"],
        ['Average Temperature', f"{statistics['avg_temperature']:.2f}"],
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 3.5*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4299e1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.aliceblue),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Equipment Type Distribution Table
    elements.append(Paragraph("Equipment Type Distribution", heading_style))
    
    distribution_data = [['Equipment Type', 'Count']]
    for eq_type, count in statistics['equipment_type_distribution'].items():
        distribution_data.append([eq_type, str(count)])
    
    distribution_table = Table(distribution_data, colWidths=[3*inch, 3.5*inch])
    distribution_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#48bb78')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.lightgreen, colors.HexColor('#c6f6d5')]),
    ]))
    elements.append(distribution_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # -- CHARTS SECTION --
    elements.append(PageBreak())
    elements.append(Paragraph("Visual Analytics", title_style))
    
    # 1. Distribution Chart
    elements.append(Paragraph("Equipment Distribution", heading_style))
    dist_chart_buf = generate_chart_image(dataset.id, 'distribution')
    elements.append(Image(dist_chart_buf, width=6*inch, height=3.5*inch))
    elements.append(Spacer(1, 0.5*inch))
    
    # 2. Parameter Distribution Boxplots
    elements.append(Paragraph("Parameter Variability (Box Plots)", heading_style))
    param_chart_buf = generate_chart_image(dataset.id, 'parameters')
    elements.append(Image(param_chart_buf, width=7*inch, height=3.5*inch))
    
    # Footer
    elements.append(Spacer(1, 0.5*inch))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    footer = Paragraph(
        "Generated by Chemical Equipment Parameter Visualizer | Hybrid Application",
        footer_style
    )
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
