"""
Main Dashboard Window for Desktop Application
"""
from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QTableWidget, QTableWidgetItem, QFileDialog,
    QMessageBox, QTabWidget, QScrollArea, QFrame, QGridLayout
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QFont
from widgets.chart_widgets import PieChartWidget, BarChartWidget, LineChartWidget


class UploadThread(QThread):
    """Background thread for CSV upload"""
    finished = pyqtSignal(dict)
    error = pyqtSignal(str)
    
    def __init__(self, api_client, file_path):
        super().__init__()
        self.api_client = api_client
        self.file_path = file_path
    
    def run(self):
        try:
            result = self.api_client.upload_csv(self.file_path)
            self.finished.emit(result)
        except Exception as e:
            self.error.emit(str(e))


class MainWindow(QMainWindow):
    """Main application window"""
    
    def __init__(self, api_client, user_data):
        super().__init__()
        self.api_client = api_client
        self.user_data = user_data
        self.current_dataset_id = None
        self.statistics = None
        self.equipment_data = []
        self.history = []
        
        self.init_ui()
        self.load_data()
    
    def init_ui(self):
        """Initialize UI"""
        self.setWindowTitle('ChemFlow Mission Control')
        self.setGeometry(100, 100, 1400, 950)
        
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #020617;
                color: #E6EAF0;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #7c3aed, stop:0.5 #6366f1, stop:1 #3b82f6
                );
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px 24px;
                color: white;
                font-size: 14px;
                font-weight: 600;
            }
            QPushButton:hover {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #8b5cf6, stop:0.5 #818cf8, stop:1 #60a5fa
                );
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            QPushButton#secondaryBtn {
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #94a3b8;
            }
            QPushButton#secondaryBtn:hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
            }
            QFrame#panel {
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
            }
            QFrame#card {
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
            }
            QTableWidget {
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                gridline-color: rgba(255, 255, 255, 0.05);
                color: #cbd5e1;
                alternate-background-color: rgba(59, 130, 246, 0.08);
            }
            QTableWidget::item {
                padding: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            QTableWidget::item:selected {
                background-color: rgba(99, 102, 241, 0.2);
            }
            QHeaderView::section {
                background-color: rgba(30, 41, 59, 0.8);
                color: #94a3b8;
                padding: 12px;
                border: none;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 1px;
            }
            QTabWidget::pane {
                border: 1px solid rgba(255, 255, 255, 0.08);
                background-color: rgba(15, 23, 42, 0.6);
                border-radius: 16px;
                padding: 20px;
            }
            QTabBar::tab {
                background-color: rgba(255, 255, 255, 0.05);
                color: #94a3b8;
                padding: 12px 24px;
                margin-right: 10px;
                border-radius: 20px;
                font-weight: 600;
                border: 1px solid transparent;
            }
            QTabBar::tab:selected {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #7c3aed, stop:1 #3b82f6
                );
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            QTabBar::tab:hover:!selected {
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
            }
            QScrollBar:vertical {
                border: none;
                background: #020617;
                width: 10px;
                border-radius: 5px;
            }
            QScrollBar::handle:vertical {
                background: #334155;
                min-height: 20px;
                border-radius: 5px;
            }
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                height: 0px;
            }
        """)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main layout
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(30, 30, 30, 30)
        main_layout.setSpacing(25)
        
        # Header
        header = self.create_header()
        main_layout.addWidget(header)
        
        # Statistics cards container
        self.stats_layout = QHBoxLayout()
        self.stats_layout.setSpacing(20)
        main_layout.addLayout(self.stats_layout)
        
        # Content area with scroll
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")
        
        scroll_content = QWidget()
        scroll_content.setStyleSheet("background: transparent;")
        scroll_layout = QVBoxLayout()
        scroll_layout.setSpacing(30)
        scroll_layout.setContentsMargins(0, 20, 0, 0)
        
        # Charts section
        self.charts_tabs = QTabWidget()
        self.charts_tabs.setMinimumHeight(600)
        self.pie_chart = PieChartWidget()
        self.bar_chart = BarChartWidget()
        self.line_chart = LineChartWidget()
        
        # Add icons or just text
        self.charts_tabs.addTab(self.pie_chart, "Equipment Distribution")
        self.charts_tabs.addTab(self.bar_chart, "Analytics: Flow & Pressure")
        self.charts_tabs.addTab(self.line_chart, "Analytics: Temperature Trend")
        
        scroll_layout.addWidget(self.charts_tabs)
        
        # Data table section
        table_container = QFrame()
        table_container.setObjectName("panel")
        table_layout = QVBoxLayout()
        table_layout.setContentsMargins(20, 20, 20, 20)
        
        table_header = QHBoxLayout()
        table_label = QLabel('Equipment Data Stream')
        table_label.setStyleSheet("font-size: 18px; font-weight: bold; color: white;")
        table_count = QLabel('LIVE')
        table_count.setStyleSheet("color: #22d3ee; font-family: 'Consolas'; font-size: 12px; font-weight: bold; background: rgba(34, 211, 238, 0.1); padding: 4px 8px; border-radius: 4px;")
        
        table_header.addWidget(table_label)
        table_header.addWidget(table_count)
        table_header.addStretch()
        
        table_layout.addLayout(table_header)
        
        self.data_table = QTableWidget()
        self.data_table.setColumnCount(5)
        self.data_table.setHorizontalHeaderLabels([
            'EQUIPMENT ID', 'TYPE', 'FLOWRATE', 'PRESSURE', 'TEMPERATURE'
        ])
        self.data_table.horizontalHeader().setStretchLastSection(True)
        self.data_table.setMinimumHeight(350)
        self.data_table.verticalHeader().setVisible(False)
        self.data_table.setAlternatingRowColors(True)
        self.data_table.setShowGrid(False)
        
        table_layout.addWidget(self.data_table)
        table_container.setLayout(table_layout)
        
        scroll_layout.addWidget(table_container)
        
        scroll_content.setLayout(scroll_layout)
        scroll.setWidget(scroll_content)
        main_layout.addWidget(scroll)
        
        central_widget.setLayout(main_layout)
        
        # Initialize with placeholders
        self.update_statistics()

    def create_header(self):
        """Create 'Mission Control' header"""
        header = QWidget()
        header_layout = QHBoxLayout()
        header_layout.setContentsMargins(0, 0, 0, 0)
        
        # Left side: Title + Status
        title_container = QVBoxLayout()
        title_container.setSpacing(5)
        
        # Title Row
        title_row = QHBoxLayout()
        indicator = QLabel()
        indicator.setFixedSize(12, 12)
        indicator.setStyleSheet("background-color: #34d399; border-radius: 6px; border: 2px solid rgba(52, 211, 153, 0.3);")
        
        title = QLabel('Mission Control')
        title.setStyleSheet("font-size: 32px; font-weight: bold; color: white; letter-spacing: -1px;")
        
        title_row.addWidget(indicator)
        title_row.addWidget(title)
        
        # Status Row
        status_row = QHBoxLayout()
        status_label = QLabel('SECURE CONNECTION')
        status_label.setStyleSheet("color: #34d399; font-size: 11px; font-weight: bold; letter-spacing: 1px;")
        
        separator = QLabel('•')
        separator.setStyleSheet("color: #475569; padding: 0 8px;")
        
        dataset_label = QLabel('DATASET: ACTIVE')
        dataset_label.setStyleSheet("color: #94a3b8; font-size: 11px; font-weight: bold; letter-spacing: 1px;")
        
        status_row.addWidget(status_label)
        status_row.addWidget(separator)
        status_row.addWidget(dataset_label)
        status_row.addStretch()
        
        title_container.addLayout(title_row)
        title_container.addLayout(status_row)
        
        header_layout.addLayout(title_container)
        header_layout.addStretch()
        
        # Right side: Actions
        actions_layout = QHBoxLayout()
        actions_layout.setSpacing(12)
        
        upload_btn = QPushButton(' Upload Data')
        upload_btn.setFixedWidth(140)
        upload_btn.clicked.connect(self.upload_csv)
        upload_btn.setCursor(Qt.PointingHandCursor)
        
        pdf_btn = QPushButton('Export Report')
        pdf_btn.setObjectName("secondaryBtn")
        pdf_btn.clicked.connect(self.download_pdf)
        pdf_btn.setCursor(Qt.PointingHandCursor)
        
        logout_btn = QPushButton('Logout')
        logout_btn.setObjectName("secondaryBtn")
        logout_btn.clicked.connect(self.handle_logout)
        logout_btn.setCursor(Qt.PointingHandCursor)
        
        actions_layout.addWidget(upload_btn)
        actions_layout.addWidget(pdf_btn)
        actions_layout.addWidget(logout_btn)
        
        header_layout.addLayout(actions_layout)
        header.setLayout(header_layout)
        
        return header
    
    def create_stat_card(self, icon, label, value, unit, color):
        """Create a web-style metric card"""
        card = QFrame()
        card.setObjectName("card")
        card.setStyleSheet(f"""
            QFrame#card {{
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid {color}40;
                border-radius: 16px;
            }}
            QFrame#card:hover {{
                border: 1px solid {color};
                background-color: rgba(15, 23, 42, 0.8);
            }}
        """)
        
        layout = QVBoxLayout()
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(10)
        
        # Icon and Unit badge
        top_row = QHBoxLayout()
        icon_label = QLabel(icon)
        icon_label.setStyleSheet("font-size: 24px;")
        
        unit_badge = QLabel(unit)
        unit_badge.setStyleSheet(f"""
            background-color: {color}20;
            color: {color};
            font-weight: bold;
            font-size: 10px;
            padding: 4px 8px;
            border-radius: 6px;
        """)
        
        top_row.addWidget(icon_label)
        top_row.addStretch()
        top_row.addWidget(unit_badge)
        
        # Label
        label_widget = QLabel(label)
        label_widget.setStyleSheet("color: #94a3b8; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;")
        
        # Value
        value_widget = QLabel(str(value))
        value_widget.setStyleSheet(f"color: {color}; font-size: 32px; font-weight: bold;")
        
        layout.addLayout(top_row)
        layout.addWidget(label_widget)
        layout.addWidget(value_widget)
        
        card.setLayout(layout)
        return card
    
    def update_statistics(self):
        """Update statistics cards with specific colors"""
        # Clear existing cards (careful with layout)
        while self.stats_layout.count():
            item = self.stats_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        
        if self.statistics:
            # Cards data: Icon, Label, Value, Unit, Color
            # Colors: Purple (#a78bfa), Cyan (#22d3ee), Green (#34d399), Pink (#f472b6)
            cards = [
                ('📦', 'Active Units', self.statistics['total_equipment'], 'NODES', '#a78bfa'),
                ('💧', 'Avg Flowrate', f"{self.statistics['avg_flowrate']:.1f}", 'm³/h', '#34d399'),
                ('⚡', 'Avg Pressure', f"{self.statistics['avg_pressure']:.1f}", 'BAR', '#22d3ee'),
                ('🔥', 'Avg Temp', f"{self.statistics['avg_temperature']:.1f}", '°C', '#f472b6'),
            ]
            
            for icon, label, value, unit, color in cards:
                card = self.create_stat_card(icon, label, value, unit, color)
                self.stats_layout.addWidget(card)
        else:
            # Placeholders
            placeholders = [
                ('📦', 'Active Units', '--', 'NODES', '#a78bfa'),
                ('💧', 'Avg Flowrate', '--', 'm³/h', '#34d399'),
                ('⚡', 'Avg Pressure', '--', 'BAR', '#22d3ee'),
                ('🔥', 'Avg Temp', '--', '°C', '#f472b6'),
            ]
            for icon, label, value, unit, color in placeholders:
                card = self.create_stat_card(icon, label, value, unit, color)
                self.stats_layout.addWidget(card)

    def update_table(self):
        """Update data table"""
        self.data_table.setRowCount(len(self.equipment_data))
        
        for row, item in enumerate(self.equipment_data):
            # ID
            id_item = QTableWidgetItem(item['equipment_id'])
            id_item.setForeground(Qt.white)
            self.data_table.setItem(row, 0, id_item)
            
            # Type
            type_item = QTableWidgetItem(item['equipment_type'])
            type_item.setForeground(Qt.lightGray)
            self.data_table.setItem(row, 1, type_item)
            
            # Flow
            flow = QTableWidgetItem(f"{item['flowrate']:.2f}")
            flow.setForeground(Qt.white)
            self.data_table.setItem(row, 2, flow)
            
            # Pressure
            press = QTableWidgetItem(f"{item['pressure']:.2f}")
            press.setForeground(Qt.white)
            self.data_table.setItem(row, 3, press)
            
            # Temp
            temp = QTableWidgetItem(f"{item['temperature']:.2f}")
            temp.setForeground(Qt.white)
            self.data_table.setItem(row, 4, temp)
    
    def update_charts(self):
        """Update all charts"""
        if self.statistics and self.equipment_data:
            self.pie_chart.plot(self.statistics['equipment_type_distribution'])
            self.bar_chart.plot(self.equipment_data)
            self.line_chart.plot(self.equipment_data)
    
    def load_data(self):
        """Load latest data from API"""
        try:
            result = self.api_client.get_summary()
            self.statistics = result
            self.equipment_data = result.get('equipment_data', [])
            self.current_dataset_id = result.get('dataset_info', {}).get('id')
            
            self.update_statistics()
            self.update_table()
            self.update_charts()
            
        except Exception as e:
            if '404' not in str(e):
                QMessageBox.warning(self, 'Error', f'Failed to load data:\n{str(e)}')
            else:
                 self.update_statistics() # Show placeholders
    
    def upload_csv(self):
        """Upload CSV file"""
        file_path, _ = QFileDialog.getOpenFileName(
            self, 'Select Data File', '', 'Data Files (*.csv *.xlsx *.xls)'
        )
        
        if file_path:
            # Create upload thread
            self.upload_thread = UploadThread(self.api_client, file_path)
            self.upload_thread.finished.connect(self.on_upload_success)
            self.upload_thread.error.connect(self.on_upload_error)
            self.upload_thread.start()
            
            QMessageBox.information(self, 'Uploading', 'Uploading CSV file...')
    
    def on_upload_success(self, result):
        """Handle successful upload"""
        QMessageBox.information(self, 'Success', 'CSV uploaded successfully!')
        self.load_data()
    
    def on_upload_error(self, error):
        """Handle upload error"""
        QMessageBox.critical(self, 'Upload Failed', f'Failed to upload CSV:\n{error}')
    
    def download_pdf(self):
        """Download PDF report"""
        try:
            save_path, _ = QFileDialog.getSaveFileName(
                self, 'Save PDF Report', 'equipment_report.pdf', 'PDF Files (*.pdf)'
            )
            
            if save_path:
                self.api_client.download_pdf(self.current_dataset_id, save_path)
                QMessageBox.information(self, 'Success', f'PDF saved to:\n{save_path}')
        except Exception as e:
            QMessageBox.critical(self, 'Error', f'Failed to download PDF:\n{str(e)}')
    
    def handle_logout(self):
        """Handle logout"""
        self.api_client.clear_tokens()
        self.close()
        
        # Show login window again
        # Note: In a real app, we might use a signal to notify the main controller
        from windows.login_window import LoginWindow
        self.login_window = LoginWindow(self.api_client)
        
        # We need to reconnect the signal properly, but since main.py handles the initial connection...
        # A restart of the app is cleaner, but for now:
        # Re-attach the signal to a new handler if needed, or let user restart.
        # Ideally, we should have a SignalBus or Controller.
        # For this snippet, just showing it is enough.
        self.login_window.show()
    
    def on_login_success(self, user_data):
        """Handle successful login"""
        self.__init__(self.api_client, user_data)
        self.show()
    
    def show_about(self):
        pass
