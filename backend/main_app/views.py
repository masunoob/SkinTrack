from rest_framework import generics
from .models import SkinRecord
from .serializers import SkinRecordSerializer


# Create your views here.
class RecordListCreate(generics.ListCreateAPIView):
    """
    GET: 記録一覧を取得
    POST: 記録を作成
    """
    queryset = SkinRecord.objects.all()
    serializer_class = SkinRecordSerializer

    def get_queryset(self):
        return SkinRecord.objects.order_by('-date')

class RecordDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: 記録詳細を取得
    PUT: 記録を更新
    DELETE: 記録を削除
    """
    queryset = SkinRecord.objects.all()
    serializer_class = SkinRecordSerializer
