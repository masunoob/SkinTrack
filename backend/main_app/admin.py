from django.contrib import admin
from .models import SkinRecord
# Register your models here.

@admin.register(SkinRecord)
class SkinRecordAdmin(admin.ModelAdmin):
    list_display = ['date', 'created_at', 'updated_at']
    list_filter = ['date']
    search_fields = ['date', 'memo']
    ordering = ['-date']
    list_per_page = 10