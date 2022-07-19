from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from . import serializers
from .models import EquipmentType, Equipment

class EquipmentTypeViewSet(viewsets.ModelViewSet):
    queryset = EquipmentType.objects.all()
    serializer_class = serializers.EquipmentTypeSerializer
    
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer


def index(request):
    return render(
        request,
        'index.html',
    )
