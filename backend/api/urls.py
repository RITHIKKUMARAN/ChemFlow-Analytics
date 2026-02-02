"""
API URL Configuration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register', views.register_user, name='register'),
    path('auth/login', views.login_user, name='login'),
    path('auth/me', views.get_profile, name='get-profile'),
    path('auth/profile', views.update_profile, name='update-profile'),
    
    # CSV Upload
    path('upload-csv', views.upload_csv, name='upload-csv'),
    
    # Summary and History
    path('summary', views.get_summary, name='summary'),
    path('history', views.get_history, name='history'),
    
    # Dataset Detail
    path('dataset/<int:dataset_id>', views.get_dataset_detail, name='dataset-detail'),
    path('dataset/<int:dataset_id>/delete', views.delete_dataset, name='delete-dataset'),
    
    # PDF Report
    path('report/pdf', views.generate_report_pdf, name='report-pdf'),
]
