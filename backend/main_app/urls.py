from django.urls import path
from . import views

app_name = 'main_app'

urlpatterns = [
    path('records/', views.RecordListCreate.as_view(), name='record-list-create'),
    path('records/<int:pk>/', views.RecordDetail.as_view(), name='record-detail'),
]
