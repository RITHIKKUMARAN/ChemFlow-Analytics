"""
API URL Configuration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register', views.register_user, name='register'),
    path('auth/login', views.login_user, name='login'),
    
    # CSV Upload
    path('upload-csv', views.upload_csv, name='upload-csv'),
    
    # Summary and History
    path('summary', views.get_summary, name='summary'),
    path('history', views.get_history, name='history'),
    
    # Dataset Detail
    path('dataset/<int:dataset_id>', views.get_dataset_detail, name='dataset-detail'),
    
    # PDF Report
    path('report/pdf', views.generate_report_pdf, name='report-pdf'),
]
