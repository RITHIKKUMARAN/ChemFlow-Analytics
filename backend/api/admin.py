from django.contrib import admin
from .models import Dataset, Equipment


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ['id', 'filename', 'user', 'upload_timestamp', 'total_equipment_count']
    list_filter = ['upload_timestamp', 'user']
    search_fields = ['filename', 'user__username']
    ordering = ['-upload_timestamp']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'equipment_id', 'equipment_type', 'flowrate', 'pressure', 'temperature', 'dataset']
    list_filter = ['equipment_type', 'dataset']
    search_fields = ['equipment_id', 'equipment_type']
    ordering = ['equipment_id']
