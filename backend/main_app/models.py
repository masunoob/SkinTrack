from django.db import models

# Create your models here.
class SkinRecord(models.Model):
    image = models.ImageField(upload_to='skin_records/', blank=True, null=True)
    memo = models.TextField(blank=True, default='')
    date = models.DateField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'skin_records'
        ordering = ['-date']
        verbose_name = '肌記録'
        verbose_name_plural = '肌記録'