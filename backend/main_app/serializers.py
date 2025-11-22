from rest_framework import serializers
from .models import SkinRecord


class SkinRecordSerializer(serializers.ModelSerializer):
    """
    SkinRecordモデルのシリアライザー
    """
    image = serializers.ImageField(required=False, allow_null=True)
    memo = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = SkinRecord
        fields = ['id', 'image', 'memo', 'date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

