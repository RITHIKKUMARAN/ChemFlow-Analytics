"""
Database models for Chemical Equipment Visualizer
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Dataset(models.Model):
    """
    Stores metadata about uploaded CSV datasets
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets')
    filename = models.CharField(max_length=255)
    upload_timestamp = models.DateTimeField(default=timezone.now)
    total_equipment_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-upload_timestamp']
        
    def __str__(self):
        return f"{self.filename} - {self.user.username} - {self.upload_timestamp}"


class Equipment(models.Model):
    """
    Stores individual equipment records from CSV uploads
    """
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='equipment')
    equipment_id = models.CharField(max_length=100)
    equipment_type = models.CharField(max_length=100)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()
    
    class Meta:
        ordering = ['equipment_id']
        
    def __str__(self):
        return f"{self.equipment_id} - {self.equipment_type}"
