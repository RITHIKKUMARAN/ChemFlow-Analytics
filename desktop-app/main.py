"""
ChemFlow Analytics - Desktop Application
Main entry point for PyQt5 desktop app
"""
import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtGui import QIcon
from utils.api_client import APIClient
from windows.login_window import LoginWindow
from windows.main_window import MainWindow


def main():
    """Main application entry point"""
    app = QApplication(sys.argv)
    app.setApplicationName('ChemFlow Analytics')
    app.setOrganizationName('ChemFlow Analytics')
    
    # Create API client
    api_client = APIClient()
    
    # Keep reference to windows to prevent garbage collection
    windows = {}
    
    # Show login window
    windows['login'] = LoginWindow(api_client)
    
    def on_login_success(user_data):
        """Open main window on successful login"""
        # Close login window if still open (though it closes itself usually)
        if 'login' in windows:
            windows['login'].close()
            
        windows['main'] = MainWindow(api_client, user_data)
        windows['main'].show()
    
    windows['login'].login_successful.connect(on_login_success)
    windows['login'].show()
    
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
