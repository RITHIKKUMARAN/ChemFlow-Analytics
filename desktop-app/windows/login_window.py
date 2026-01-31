"""
Login Window for Desktop Application
"""
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QMessageBox, QFrame
)
from PyQt5.QtCore import Qt, pyqtSignal
from PyQt5.QtGui import QFont, QIcon


class LoginWindow(QWidget):
    """Login/Register window"""
    
    login_successful = pyqtSignal(dict)  # Emit user data on successful login
    
    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI"""
        self.setWindowTitle('ChemFlow Analytics - Login')
        self.setFixedSize(450, 550)
        self.setStyleSheet("""
            QWidget {
                background-color: #0a0e1a;
                color: #f9fafb;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            QLabel {
                color: #f9fafb;
            }
            QLineEdit {
                background-color: #1a202c;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                color: #f9fafb;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 1px solid #3b82f6;
            }
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #667eea, stop:1 #764ba2
                );
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: white;
                font-size: 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #7c8ef0, stop:1 #8a5fb8
                );
            }
            QPushButton:pressed {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #5a6fd8, stop:1 #694394
                );
            }
            QPushButton#secondaryBtn {
                background-color: #1a202c;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            QPushButton#secondaryBtn:hover {
                background-color: #2d3748;
                border-color: #3b82f6;
            }
            QFrame#container {
                background-color: rgba(17, 24, 39, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
            }
        """)
        
        # Main layout
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(30, 30, 30, 30)
        
        # Container frame
        container = QFrame()
        container.setObjectName("container")
        container_layout = QVBoxLayout()
        container_layout.setContentsMargins(30, 30, 30, 30)
        container_layout.setSpacing(20)
        
        # Logo/Icon
        logo = QLabel('⚗️')
        logo.setAlignment(Qt.AlignCenter)
        logo_font = QFont()
        logo_font.setPointSize(48)
        logo.setFont(logo_font)
        
        # Title
        title = QLabel('Welcome')
        title.setAlignment(Qt.AlignCenter)
        title_font = QFont()
        title_font.setPointSize(24)
        title_font.setBold(True)
        title.setFont(title_font)
        
        # Subtitle
        subtitle = QLabel('Sign in to your account')
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #9ca3af; font-size: 14px;")
        
        # Username input
        username_label = QLabel('USERNAME')
        username_label.setStyleSheet("font-size: 11px; font-weight: bold; letter-spacing: 1px; color: #9ca3af;")
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText('Enter your username')
        
        # Password input
        password_label = QLabel('PASSWORD')
        password_label.setStyleSheet("font-size: 11px; font-weight: bold; letter-spacing: 1px; color: #9ca3af;")
        self.password_input = QLineEdit()
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setPlaceholderText('Enter your password')
        self.password_input.returnPressed.connect(self.handle_login)
        
        # Login button
        self.login_btn = QPushButton('Sign In')
        self.login_btn.clicked.connect(self.handle_login)
        self.login_btn.setCursor(Qt.PointingHandCursor)
        
        # Register button
        register_btn = QPushButton('Create New Account')
        register_btn.setObjectName("secondaryBtn")
        register_btn.clicked.connect(self.show_register_dialog)
        register_btn.setCursor(Qt.PointingHandCursor)
        
        # Add widgets to container
        container_layout.addWidget(logo)
        container_layout.addWidget(title)
        container_layout.addWidget(subtitle)
        container_layout.addSpacing(10)
        container_layout.addWidget(username_label)
        container_layout.addWidget(self.username_input)
        container_layout.addWidget(password_label)
        container_layout.addWidget(self.password_input)
        container_layout.addSpacing(10)
        container_layout.addWidget(self.login_btn)
        container_layout.addWidget(register_btn)
        
        container.setLayout(container_layout)
        main_layout.addWidget(container)
        self.setLayout(main_layout)
    
    def handle_login(self):
        """Handle login"""
        username = self.username_input.text().strip()
        password = self.password_input.text().strip()
        
        if not username or not password:
            QMessageBox.warning(self, 'Error', 'Please enter both username and password')
            return
        
        try:
            self.login_btn.setText('Signing in...')
            self.login_btn.setEnabled(False)
            
            result = self.api_client.login(username, password)
            
            QMessageBox.information(self, 'Success', 'Login successful!')
            self.login_successful.emit(result['user'])
            self.close()
            
        except Exception as e:
            QMessageBox.critical(self, 'Login Failed', 
                               f'Failed to login:\n{str(e)}')
            self.login_btn.setText('Sign In')
            self.login_btn.setEnabled(True)
    
    def show_register_dialog(self):
        """Show registration dialog"""
        from PyQt5.QtWidgets import QDialog, QFormLayout
        
        dialog = QDialog(self)
        dialog.setWindowTitle('Create Account')
        dialog.setFixedSize(400, 350)
        dialog.setStyleSheet(self.styleSheet())
        
        layout = QVBoxLayout()
        layout.setContentsMargins(30, 30, 30, 30)
        
        form = QFormLayout()
        form.setSpacing(15)
        
        username_input = QLineEdit()
        username_input.setPlaceholderText('Choose a username')
        
        email_input = QLineEdit()
        email_input.setPlaceholderText('your.email@example.com')
        
        password_input = QLineEdit()
        password_input.setEchoMode(QLineEdit.Password)
        password_input.setPlaceholderText('At least 6 characters')
        
        confirm_password_input = QLineEdit()
        confirm_password_input.setEchoMode(QLineEdit.Password)
        confirm_password_input.setPlaceholderText('Re-enter password')
        
        form.addRow('Username:', username_input)
        form.addRow('Email:', email_input)
        form.addRow('Password:', password_input)
        form.addRow('Confirm:', confirm_password_input)
        
        register_btn = QPushButton('Create Account')
        register_btn.setCursor(Qt.PointingHandCursor)
        
        def do_register():
            username = username_input.text().strip()
            email = email_input.text().strip()
            password = password_input.text().strip()
            confirm = confirm_password_input.text().strip()
            
            if not all([username, email, password, confirm]):
                QMessageBox.warning(dialog, 'Error', 'All fields are required')
                return
            
            if password != confirm:
                QMessageBox.warning(dialog, 'Error', 'Passwords do not match')
                return
            
            if len(password) < 6:
                QMessageBox.warning(dialog, 'Error', 'Password must be at least 6 characters')
                return
            
            try:
                result = self.api_client.register(username, email, password)
                QMessageBox.information(dialog, 'Success', 'Account created successfully!')
                dialog.accept()
                
                # Auto-login
                self.username_input.setText(username)
                self.password_input.setText(password)
                self.handle_login()
                
            except Exception as e:
                QMessageBox.critical(dialog, 'Registration Failed', 
                                   f'Failed to create account:\n{str(e)}')
        
        register_btn.clicked.connect(do_register)
        
        layout.addLayout(form)
        layout.addWidget(register_btn)
        dialog.setLayout(layout)
        dialog.exec_()
