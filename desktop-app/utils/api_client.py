"""
REST API Client for Desktop Application
Handles communication with Django backend
"""
import requests
import json
from typing import Optional, Dict, Any


class APIClient:
    """HTTP client for Django REST API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.access_token = None
        self.refresh_token = None
    
    def set_tokens(self, access: str, refresh: str):
        """Store authentication tokens"""
        self.access_token = access
        self.refresh_token = refresh
    
    def clear_tokens(self):
        """Clear stored tokens"""
        self.access_token = None
        self.refresh_token = None
    
    def get_headers(self) -> Dict[str, str]:
        """Get request headers with auth token"""
        headers = {
            'Content-Type': 'application/json',
        }
        if self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        return headers
    
    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Authenticate user"""
        url = f"{self.api_url}/auth/login"
        payload = {
            'username': username,
            'password': password,
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        if 'tokens' in data:
            self.set_tokens(data['tokens']['access'], data['tokens']['refresh'])
        
        return data
    
    def register(self, username: str, email: str, password: str) -> Dict[str, Any]:
        """Register new user"""
        url = f"{self.api_url}/auth/register"
        payload = {
            'username': username,
            'email': email,
            'password': password,
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        if 'tokens' in data:
            self.set_tokens(data['tokens']['access'], data['tokens']['refresh'])
        
        return data
    
    def upload_csv(self, file_path: str, progress_callback=None) -> Dict[str, Any]:
        """Upload CSV file"""
        url = f"{self.api_url}/upload-csv"
        
        with open(file_path, 'rb') as f:
            files = {'file': (file_path.split('\\')[-1], f, 'text/csv')}
            headers = {}
            if self.access_token:
                headers['Authorization'] = f'Bearer {self.access_token}'
            
            response = requests.post(url, files=files, headers=headers)
            response.raise_for_status()
        
        return response.json()
    
    def get_summary(self, dataset_id: Optional[int] = None) -> Dict[str, Any]:
        """Get summary statistics"""
        url = f"{self.api_url}/summary"
        if dataset_id:
            url = f"{url}?dataset_id={dataset_id}"
        
        response = requests.get(url, headers=self.get_headers())
        response.raise_for_status()
        
        return response.json()
    
    def get_history(self) -> Dict[str, Any]:
        """Get dataset history"""
        url = f"{self.api_url}/history"
        
        response = requests.get(url, headers=self.get_headers())
        response.raise_for_status()
        
        return response.json()
    
    def download_pdf(self, dataset_id: Optional[int] = None, save_path: str = None) -> str:
        """Download PDF report"""
        url = f"{self.api_url}/report/pdf"
        if dataset_id:
            url = f"{url}?dataset_id={dataset_id}"
        
        response = requests.get(url, headers=self.get_headers())
        response.raise_for_status()
        
        # Save PDF
        if save_path:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return save_path
        
        return response.content
