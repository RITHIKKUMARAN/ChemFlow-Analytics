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
        self.setWindowTitle('ChemFlow Mission Control')
        self.resize(500, 650)
        self.setMinimumSize(450, 600)
        self.setStyleSheet("""
            QWidget {
                background-color: #020617;
                color: #E6EAF0;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            QLabel {
                color: #E6EAF0;
            }
            QLineEdit {
                background-color: rgba(15, 23, 42, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 14px;
                color: #E6EAF0;
                font-size: 15px;
            }
            QLineEdit:focus {
                border: 1px solid rgba(124, 58, 237, 0.5);
                background-color: rgba(15, 23, 42, 0.7);
            }
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #7c3aed, stop:0.5 #6366f1, stop:1 #3b82f6
                );
                border: none;
                border-radius: 12px;
                padding: 14px 24px;
                color: white;
                font-size: 15px;
                font-weight: 600;
            }
            QPushButton:hover {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #8b5cf6, stop:0.5 #818cf8, stop:1 #60a5fa
                );
            }
            QPushButton:pressed {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:1,
                    stop:0 #6d28d9, stop:1 #2563eb
                );
            }
            QPushButton#secondaryBtn {
                background-color: transparent;
                border: none;
                color: #a78bfa;
                font-weight: normal;
            }
            QPushButton#secondaryBtn:hover {
                color: #c4b5fd;
                text-decoration: underline;
            }
            QFrame#container {
                background-color: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 20px;
                min-width: 380px;
                max-width: 450px;
            }
        """)
        
        # Main layout
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.addStretch()
        
        # Container frame
        container = QFrame()
        container.setObjectName("container")
        container_layout = QVBoxLayout()
        container_layout.setContentsMargins(40, 40, 40, 40)
        container_layout.setSpacing(20)
        
        # Logo/Icon
        logo_container = QHBoxLayout()
        logo_container.addStretch()
        logo_bg = QLabel('👋')
        logo_bg.setAlignment(Qt.AlignCenter)
        logo_bg.setFixedSize(64, 64)
        logo_bg.setStyleSheet("""
            background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 #7c3aed, stop:1 #22d3ee);
            border-radius: 16px;
            font-size: 32px;
        """)
        logo_container.addWidget(logo_bg)
        logo_container.addStretch()
        
        # Title
        title = QLabel('Welcome Back')
        title.setAlignment(Qt.AlignCenter)
        title_font = QFont()
        title_font.setPointSize(24)
        title_font.setBold(True)
        title.setFont(title_font)
        
        # Subtitle
        subtitle = QLabel('Sign in to access your analytics dashboard')
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("color: #94a3b8; font-size: 14px;")
        
        # Username input
        username_label = QLabel('Surname / Username')
        username_label.setStyleSheet("color: #cbd5e1; font-weight: 500; font-size: 14px;")
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText('johndoe')
        
        # Password input
        password_label = QLabel('Password')
        password_label.setStyleSheet("color: #cbd5e1; font-weight: 500; font-size: 14px;")
        self.password_input = QLineEdit()
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setPlaceholderText('••••••••')
        self.password_input.returnPressed.connect(self.handle_login)
        
        # Login button
        self.login_btn = QPushButton('Sign In')
        self.login_btn.clicked.connect(self.handle_login)
        self.login_btn.setCursor(Qt.PointingHandCursor)
        
        # Register button
        register_container = QHBoxLayout()
        register_label = QLabel("Don't have an account?")
        register_label.setStyleSheet("color: #94a3b8; font-size: 13px;")
        
        register_btn = QPushButton('Sign up')
        register_btn.setObjectName("secondaryBtn")
        register_btn.clicked.connect(self.show_register_dialog)
        register_btn.setCursor(Qt.PointingHandCursor)
        
        register_container.addStretch()
        register_container.addWidget(register_label)
        register_container.addWidget(register_btn)
        register_container.addStretch()
        
        # Add widgets to container
        container_layout.addLayout(logo_container)
        container_layout.addSpacing(10)
        container_layout.addWidget(title)
        container_layout.addWidget(subtitle)
        container_layout.addSpacing(20)
        
        container_layout.addWidget(username_label)
        container_layout.addWidget(self.username_input)
        
        container_layout.addWidget(password_label)
        container_layout.addWidget(self.password_input)
        
        container_layout.addSpacing(10)
        container_layout.addWidget(self.login_btn)
        container_layout.addLayout(register_container)
        
        container.setLayout(container_layout)
        
        # Center container in main layout
        h_layout = QHBoxLayout()
        h_layout.addStretch()
        h_layout.addWidget(container)
        h_layout.addStretch()
        
        main_layout.addLayout(h_layout)
        main_layout.addStretch()
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
