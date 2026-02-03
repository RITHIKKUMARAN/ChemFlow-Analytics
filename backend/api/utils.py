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
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from django.db.models import Avg, Count
from django.utils.timezone import localtime
from .models import Equipment
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from mpl_toolkits.mplot3d import Axes3D

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

def detect_anomalies(df):
    """
    Simple outlier detection using Z-score method (Mean + 2*STD)
    """
    # Calculate statistics
    stats = {
        'flow': {'mean': df['Flowrate'].mean(), 'std': df['Flowrate'].std()},
        'press': {'mean': df['Pressure'].mean(), 'std': df['Pressure'].std()},
        'temp': {'mean': df['Temperature'].mean(), 'std': df['Temperature'].std()}
    }
    
    statuses = []
    
    for _, row in df.iterrows():
        status = 'Normal'
        
        # Check Critical ( > 2 STD)
        if (abs(row['Flowrate'] - stats['flow']['mean']) > 2 * stats['flow']['std'] or
            abs(row['Pressure'] - stats['press']['mean']) > 2 * stats['press']['std'] or
            abs(row['Temperature'] - stats['temp']['mean']) > 2 * stats['temp']['std']):
            status = 'Critical'
            
        # Check Warning ( > 1.5 STD) if not critical
        elif (abs(row['Flowrate'] - stats['flow']['mean']) > 1.5 * stats['flow']['std'] or
              abs(row['Pressure'] - stats['press']['mean']) > 1.5 * stats['press']['std'] or
              abs(row['Temperature'] - stats['temp']['mean']) > 1.5 * stats['temp']['std']):
            status = 'Warning'
            
        statuses.append(status)
        
    return statuses


def compute_statistics(dataset_id):
    """
    Compute summary statistics for a dataset
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
    # Fetch data
    equipment = Equipment.objects.filter(dataset_id=dataset_id)
    df = pd.DataFrame(list(equipment.values()))
    
    buf = BytesIO()
    
    if chart_type == 'distribution':
        plt.figure(figsize=(7, 4))
        sns.set_style("darkgrid")
        ax = sns.countplot(data=df, x='equipment_type', palette='viridis')
        plt.title('Equipment Distribution', fontsize=12, pad=10)
        plt.xlabel('Type')
        plt.ylabel('Count')
        plt.xticks(rotation=30)
        plt.tight_layout()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()
        
    elif chart_type == 'parameters':
        fig, axes = plt.subplots(1, 3, figsize=(8, 4))
        sns.set_style("whitegrid")
        
        sns.boxplot(y=df['flowrate'], ax=axes[0], color='#4F8CFF')
        axes[0].set_title('Flowrate (m³/h)', fontsize=10)
        axes[0].set_ylabel('')
        
        sns.boxplot(y=df['pressure'], ax=axes[1], color='#2ED573')
        axes[1].set_title('Pressure (Bar)', fontsize=10)
        axes[1].set_ylabel('')
        
        sns.boxplot(y=df['temperature'], ax=axes[2], color='#FF4757')
        axes[2].set_title('Temp (°C)', fontsize=10)
        axes[2].set_ylabel('')
        
        plt.tight_layout()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()

    elif chart_type == 'digital_twin':
        # Generate a 3D Scatter plot to simulate Digital Twin view
        fig = plt.figure(figsize=(8, 6))
        ax = fig.add_subplot(111, projection='3d')
        
        # Map Equipment Type to Colors
        types = df['equipment_type'].unique()
        colors_map = plt.cm.viridis(range(len(types)))
        
        for i, eq_type in enumerate(types):
            subset = df[df['equipment_type'] == eq_type]
            # Use columns as pseudo-coordinates if real coords aren't available
            # Normalized for visualization
            xs = subset['flowrate']
            ys = subset['temperature']
            zs = subset['pressure']
            ax.scatter(xs, ys, zs, label=eq_type, s=100, alpha=0.8)

        ax.set_xlabel('Flow')
        ax.set_ylabel('Temp')
        ax.set_zlabel('Pressure')
        ax.set_title('3D Parameter Spatial Analysis', fontsize=12)
        ax.view_init(elev=20., azim=-35)
        
        plt.tight_layout()
        plt.savefig(buf, format='png', dpi=150)
        plt.close()
        
    buf.seek(0)
    return buf

def draw_page_template(canvas, doc):
    """Draws background and watermark on every page"""
    canvas.saveState()
    
    # 1. Background Color (Very light violet/green tint)
    # Using #fdfcfe (very light indigo tint) ensuring readability of text
    canvas.setFillColor(colors.HexColor('#f5f3ff')) 
    canvas.rect(0, 0, letter[0], letter[1], fill=True, stroke=False)
    
    # 2. Watermark Top-Right
    canvas.setFont('Helvetica-Bold', 12)
    canvas.setFillColor(colors.HexColor('#6366f1')) # Indigo brand color
    
    # Draw Logo and Text "ChemFlow"
    # Starting from top right corner
    w, h = letter
    canvas.drawRightString(w - 0.5*inch, h - 0.5*inch, "ChemFlow Analytics")
    
    # Optional: Draw a small colored line/accent
    canvas.setStrokeColor(colors.HexColor('#6366f1'))
    canvas.setLineWidth(2)
    canvas.line(w - 2*inch, h - 0.6*inch, w - 0.5*inch, h - 0.6*inch)
    
    canvas.restoreState()

def generate_pdf_report(dataset, statistics):
    """
    Generate Premium High-Density PDF Report
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                            topMargin=0.8*inch, bottomMargin=0.5*inch, 
                            leftMargin=0.5*inch, rightMargin=0.5*inch)
    
    # --- DATA FETCHING ---
    anomalies = Equipment.objects.filter(dataset=dataset).exclude(status='Normal').order_by('status')
    top_equipment = Equipment.objects.filter(dataset=dataset).order_by('-flowrate')[:50]
    
    elements = []
    
    # --- COLORS & STYLES ---
    # Brand Palette
    c_dark = colors.HexColor('#0f172a')
    c_indigo = colors.HexColor('#4f46e5')
    c_cyan = colors.HexColor('#06b6d4')
    c_rose = colors.HexColor('#e11d48')
    c_emerald = colors.HexColor('#10b981')
    c_slate = colors.HexColor('#64748b')
    c_light_card = colors.white
    
    styles = getSampleStyleSheet()
    
    # Custom Heading
    h1_style = ParagraphStyle(
        'H1', parent=styles['Heading1'], fontSize=22, textColor=c_dark, spaceAfter=20, fontName='Helvetica-Bold'
    )
    h2_style = ParagraphStyle(
        'H2', parent=styles['Heading2'], fontSize=16, textColor=c_indigo, spaceBefore=25, spaceAfter=15, 
        borderPadding=(0,0,5,0), borderWidth=1, borderColor=colors.HexColor('#f5f3ff'), borderBottomColor=c_indigo
    )
    
    # Card Styles (Split Label and Value to avoid collision)
    card_label_style = ParagraphStyle('CL', parent=styles['Normal'], fontSize=9, textColor=c_slate, alignment=TA_CENTER)
    card_value_style = ParagraphStyle('CV', parent=styles['Normal'], fontSize=16, textColor=c_dark, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=20)
    
    # --- HEADER ---
    gen_time = localtime().strftime('%B %d, %Y • %I:%M %p')
    user_display = dataset.user.username if dataset.user else "System User"
    
    # Title Block
    elements.append(Paragraph(f"Dataset: {dataset.filename}", h1_style))
    elements.append(Paragraph(f"<b>Generated For:</b> {user_display} &nbsp;|&nbsp; <b>Date:</b> {gen_time}", 
                              ParagraphStyle('Meta', fontSize=10, textColor=c_slate, spaceAfter=25)))
    
    # --- EXECUTIVE SUMMARY CARDS ---
    def create_card_cell(label, value, value_color):
        v_style = ParagraphStyle('V', parent=card_value_style, textColor=value_color)
        return [
            Paragraph(label, card_label_style),
            Spacer(1, 6),
            Paragraph(value, v_style)
        ]

    card_data = [[
        create_card_cell("TOTAL UNITS", str(statistics['total_equipment']), c_dark),
        create_card_cell("AVG FLOW", f"{statistics['avg_flowrate']:.1f} m³/h", c_cyan),
        create_card_cell("AVG PRESS", f"{statistics['avg_pressure']:.1f} bar", c_indigo),
        create_card_cell("AVG TEMP", f"{statistics['avg_temperature']:.1f} °C", c_rose),
    ]]
    
    card_table = Table(card_data, colWidths=[1.8*inch]*4)
    card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_card),
        ('GRID', (0,0), (-1,-1), 8, colors.HexColor('#f5f3ff')), # Thick gap to simulate separate cards
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.5, colors.lightgrey), # subtle border
    ]))
    elements.append(card_table)
    
    # --- ANOMALY REPORT (Moved to Page 1) ---
    elements.append(Spacer(1, 0.4*inch))
    if anomalies.exists():
        elements.append(Paragraph(f"Critical Anomalies Detected ({anomalies.count()})", h2_style))
        elements.append(Paragraph("The following equipment units are operating outside nominal safety thresholds.", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        anomaly_data = [['ID', 'Type', 'Status', 'Flow', 'Press', 'Temp']]
        for eq in anomalies[:50]:
            status_color = c_rose if eq.status == 'Critical' else colors.orange
            row = [
                Paragraph(f"<b>{eq.equipment_id}</b>", styles['Normal']),
                eq.equipment_type,
                Paragraph(f"<font color='{status_color}'><b>{eq.status.upper()}</b></font>", styles['Normal']),
                f"{eq.flowrate:.1f}",
                f"{eq.pressure:.1f}",
                f"{eq.temperature:.1f}"
            ]
            anomaly_data.append(row)
            
        anom_table = Table(anomaly_data, colWidths=[1.5*inch, 1.5*inch, 1.2*inch, 1*inch, 1*inch, 1*inch])
        anom_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), c_rose),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 10),
            ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#fff1f2')]),
        ]))
        elements.append(anom_table)
    else:
        elements.append(Spacer(1, 0.4*inch))
        elements.append(Paragraph("System Health Check: <b>Normal</b>", styles['Normal']))
        elements.append(Paragraph("All equipment units are operating within nominal parameters. No critical anomalies detected.", styles['Normal']))
    
    # --- PAGE 2: VISUAL ANALYTICS ---
    elements.append(PageBreak())
    elements.append(Paragraph("Visual Analytics Dashboard", h1_style))
    
    # 3D Digital Twin Snapshot
    elements.append(Paragraph("Thermal & Spatial Profile (Digital Twin)", h2_style))
    dt_image = generate_chart_image(dataset.id, 'digital_twin')
    elements.append(Image(dt_image, width=6.5*inch, height=4*inch))
    
    # Statistical Charts
    elements.append(Paragraph("Inventory Distribution & Parameter Dynamics", h2_style))
    chart1 = generate_chart_image(dataset.id, 'distribution')
    chart2 = generate_chart_image(dataset.id, 'parameters')
    
    chart_data = [[Image(chart1, width=3.2*inch, height=2.2*inch), Image(chart2, width=4.0*inch, height=2.2*inch)]]
    chart_table = Table(chart_data, colWidths=[3.3*inch, 4.1*inch])
    chart_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(chart_table)
    
    # --- PAGE 3: DETAILED MANIFEST ---
    elements.append(PageBreak())
    elements.append(Paragraph("Equipment Data Manifest", h2_style))
    
    data_header = [['Equipment ID', 'Type', 'Flow (m³/h)', 'Press (bar)', 'Temp (°C)', 'Status']]
    data_rows = []
    
    for eq in top_equipment:
        s_color = c_emerald
        if eq.status == 'Critical': s_color = c_rose
        elif eq.status == 'Warning': s_color = colors.orange
        
        row = [
            eq.equipment_id,
            eq.equipment_type,
            f"{eq.flowrate:.2f}",
            f"{eq.pressure:.2f}",
            f"{eq.temperature:.1f}",
            Paragraph(f"<font color='{s_color}'>● {eq.status}</font>", styles['Normal'])
        ]
        data_rows.append(row)
        
    full_table_data = data_header + data_rows
    
    main_table = Table(full_table_data, colWidths=[1.8*inch, 1.5*inch, 1*inch, 1*inch, 1*inch, 1.2*inch], repeatRows=1)
    main_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.25, colors.lightgrey),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.white]),
        ('ALIGN', (2,0), (4,-1), 'RIGHT'),
    ]))
    elements.append(main_table)
    
    # --- FOOTER ---
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("© 2026 ChemFlow Analytics. Confidential Document.", 
                              ParagraphStyle('Footer', textColor=c_slate, fontSize=8, alignment=TA_CENTER)))
    
    # Build with Page Template callback
    doc.build(elements, onFirstPage=draw_page_template, onLaterPages=draw_page_template)
    buffer.seek(0)
    return buffer
