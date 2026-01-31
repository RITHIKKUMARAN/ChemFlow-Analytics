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
        self.setWindowTitle('Chemical Equipment Visualizer - Dashboard')
        self.setGeometry(100, 100, 1400, 900)
        
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #0a0e1a;
                color: #f9fafb;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #667eea, stop:1 #764ba2
                );
                border: none;
                border-radius: 8px;
                padding: 10px 20px;
                color: white;
                font-size: 13px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #7c8ef0, stop:1 #8a5fb8
                );
            }
            QPushButton#successBtn {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #43e97b, stop:1 #38f9d7
                );
            }
            QPushButton#secondaryBtn {
                background-color: #1a202c;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            QFrame#card {
                background-color: rgba(17, 24, 39, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 15px;
            }
            QTableWidget {
                background-color: rgba(17, 24, 39, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #d1d5db;
            }
            QTableWidget::item {
                padding: 8px;
            }
            QTableWidget::item:selected {
                background-color: rgba(59, 130, 246, 0.2);
            }
            QHeaderView::section {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #667eea, stop:1 #764ba2
                );
                color: white;
                padding: 10px;
                border: none;
                font-weight: bold;
            }
            QTabWidget::pane {
                border: 1px solid rgba(255, 255, 255, 0.1);
                background-color: rgba(17, 24, 39, 0.8);
                border-radius: 8px;
            }
            QTabBar::tab {
                background-color: #1a202c;
                color: #9ca3af;
                padding: 10px 20px;
                margin-right: 5px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            QTabBar::tab:selected {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #667eea, stop:1 #764ba2
                );
                color: white;
            }
        """)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main layout
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(20)
        
        # Header
        header = self.create_header()
        main_layout.addWidget(header)
        
        # Statistics cards
        self.stats_container = QFrame()
        self.stats_layout = QHBoxLayout()
        self.stats_layout.setSpacing(15)
        self.stats_container.setLayout(self.stats_layout)
        main_layout.addWidget(self.stats_container)
        
        # Upload button
        upload_btn = QPushButton('📤 Upload CSV File')
        upload_btn.setObjectName("successBtn")
        upload_btn.clicked.connect(self.upload_csv)
        upload_btn.setFixedHeight(50)
        upload_btn.setCursor(Qt.PointingHandCursor)
        main_layout.addWidget(upload_btn)
        
        # Content area with scroll
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; }")
        
        scroll_content = QWidget()
        scroll_layout = QVBoxLayout()
        scroll_layout.setSpacing(20)
        
        # Charts tab widget
        self.charts_tabs = QTabWidget()
        self.pie_chart = PieChartWidget()
        self.bar_chart = BarChartWidget()
        self.line_chart = LineChartWidget()
        
        self.charts_tabs.addTab(self.pie_chart, "Equipment Distribution")
        self.charts_tabs.addTab(self.bar_chart, "Flowrate & Pressure")
        self.charts_tabs.addTab(self.line_chart, "Temperature Trend")
        
        scroll_layout.addWidget(self.charts_tabs)
        
        # Data table
        table_label = QLabel('📋 Equipment Data')
        table_label.setStyleSheet("font-size: 18px; font-weight: bold; margin-top: 10px;")
        scroll_layout.addWidget(table_label)
        
        self.data_table = QTableWidget()
        self.data_table.setColumnCount(5)
        self.data_table.setHorizontalHeaderLabels([
            'Equipment ID', 'Type', 'Flowrate', 'Pressure', 'Temperature'
        ])
        self.data_table.horizontalHeader().setStretchLastSection(True)
        self.data_table.setMinimumHeight(300)
        scroll_layout.addWidget(self.data_table)
        
        scroll_content.setLayout(scroll_layout)
        scroll.setWidget(scroll_content)
        main_layout.addWidget(scroll)
        
        central_widget.setLayout(main_layout)
        
        # Menu bar
        menubar = self.menuBar()
        menubar.setStyleSheet("""
            QMenuBar {
                background-color: #111827;
                color: #f9fafb;
                padding: 5px;
            }
            QMenuBar::item:selected {
                background-color: #1f2937;
            }
            QMenu {
                background-color: #111827;
                color: #f9fafb;
            }
            QMenu::item:selected {
                background-color: #1f2937;
            }
        """)
        
        file_menu = menubar.addMenu('&File')
        file_menu.addAction('Upload CSV', self.upload_csv)
        file_menu.addAction('Download PDF', self.download_pdf)
        file_menu.addSeparator()
        file_menu.addAction('Exit', self.close)
        
        help_menu = menubar.addMenu('&Help')
        help_menu.addAction('About', self.show_about)
    
    def create_header(self):
        """Create header with title and actions"""
        header = QFrame()
        header.setObjectName("card")
        header_layout = QHBoxLayout()
        
        # Logo and title
        logo_layout = QHBoxLayout()
        logo = QLabel('⚗️')
        logo_font = QFont()
        logo_font.setPointSize(24)
        logo.setFont(logo_font)
        
        title = QLabel('Chemical Equipment Visualizer')
        title_font = QFont()
        title_font.setPointSize(18)
        title_font.setBold(True)
        title.setFont(title_font)
        
        logo_layout.addWidget(logo)
        logo_layout.addWidget(title)
        logo_layout.addStretch()
        
        # Action buttons
        actions_layout = QHBoxLayout()
        actions_layout.setSpacing(10)
        
        pdf_btn = QPushButton('📄 Download PDF')
        pdf_btn.setObjectName("successBtn")
        pdf_btn.clicked.connect(self.download_pdf)
        pdf_btn.setCursor(Qt.PointingHandCursor)
        
        refresh_btn = QPushButton('🔄 Refresh')
        refresh_btn.setObjectName("secondaryBtn")
        refresh_btn.clicked.connect(self.load_data)
        refresh_btn.setCursor(Qt.PointingHandCursor)
        
        logout_btn = QPushButton('Logout')
        logout_btn.setObjectName("secondaryBtn")
        logout_btn.clicked.connect(self.handle_logout)
        logout_btn.setCursor(Qt.PointingHandCursor)
        
        actions_layout.addWidget(pdf_btn)
        actions_layout.addWidget(refresh_btn)
        actions_layout.addWidget(logout_btn)
        
        header_layout.addLayout(logo_layout)
        header_layout.addLayout(actions_layout)
        header.setLayout(header_layout)
        
        return header
    
    def create_stat_card(self, icon, label, value):
        """Create a statistics card"""
        card = QFrame()
        card.setObjectName("card")
        card.setMinimumWidth(200)
        
        layout = QHBoxLayout()
        layout.setSpacing(15)
        
        icon_label = QLabel(icon)
        icon_label.setStyleSheet("font-size: 48px;")
        
        content_layout = QVBoxLayout()
        content_layout.setSpacing(5)
        
        label_widget = QLabel(label)
        label_widget.setStyleSheet("font-size: 11px; color: #9ca3af; font-weight: bold; letter-spacing: 1px;")
        
        value_widget = QLabel(str(value))
        value_font = QFont()
        value_font.setPointSize(24)
        value_font.setBold(True)
        value_widget.setFont(value_font)
        
        content_layout.addWidget(label_widget)
        content_layout.addWidget(value_widget)
        
        layout.addWidget(icon_label)
        layout.addLayout(content_layout)
        layout.addStretch()
        
        card.setLayout(layout)
        return card
    
    def update_statistics(self):
        """Update statistics cards"""
        # Clear existing cards
        while self.stats_layout.count():
            item = self.stats_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        
        if self.statistics:
            cards = [
                ('🔢', 'TOTAL EQUIPMENT', self.statistics['total_equipment']),
                ('💨', 'AVG FLOWRATE', f"{self.statistics['avg_flowrate']:.2f}"),
                ('⚡', 'AVG PRESSURE', f"{self.statistics['avg_pressure']:.2f}"),
                ('🌡️', 'AVG TEMPERATURE', f"{self.statistics['avg_temperature']:.2f}"),
            ]
            
            for icon, label, value in cards:
                card = self.create_stat_card(icon, label, value)
                self.stats_layout.addWidget(card)
    
    def update_table(self):
        """Update data table"""
        self.data_table.setRowCount(len(self.equipment_data))
        
        for row, item in enumerate(self.equipment_data):
            self.data_table.setItem(row, 0, QTableWidgetItem(item['equipment_id']))
            self.data_table.setItem(row, 1, QTableWidgetItem(item['equipment_type']))
            self.data_table.setItem(row, 2, QTableWidgetItem(f"{item['flowrate']:.2f}"))
            self.data_table.setItem(row, 3, QTableWidgetItem(f"{item['pressure']:.2f}"))
            self.data_table.setItem(row, 4, QTableWidgetItem(f"{item['temperature']:.2f}"))
    
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
    
    def upload_csv(self):
        """Upload CSV file"""
        file_path, _ = QFileDialog.getOpenFileName(
            self, 'Select CSV File', '', 'CSV Files (*.csv)'
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
        from windows.login_window import LoginWindow
        self.login_window = LoginWindow(self.api_client)
        self.login_window.login_successful.connect(self.on_login_success)
        self.login_window.show()
    
    def on_login_success(self, user_data):
        """Handle successful login"""
        self.__init__(self.api_client, user_data)
        self.show()
    
    def show_about(self):
        """Show about dialog"""
        QMessageBox.about(self, 'About',
            '<h2>Chemical Equipment Visualizer</h2>'
            '<p>Version 1.0.0</p>'
            '<p>A hybrid application for analyzing chemical equipment parameters.</p>'
            '<p><b>Features:</b></p>'
            '<ul>'
            '<li>CSV data upload and parsing</li>'
            '<li>Interactive charts and visualizations</li>'
            '<li>Statistical analysis</li>'
            '<li>PDF report generation</li>'
            '</ul>'
            '<p>© 2026 Chemical Equipment Visualizer</p>'
        )
