from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import generics

from . import serializers
from .models import EquipmentType, Equipment
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

class EquipmentTypeView(generics.ListAPIView):
    queryset = EquipmentType.objects.all()
    serializer_class = serializers.EquipmentTypeSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = (AllowAny, )
    
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = (AllowAny, )

def index(request):
    return render(
        request,
        'index.html',
    )
