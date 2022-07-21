from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import views

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

from rest_framework.response import Response
class EquipmentCreateView(views.APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = (AllowAny, )
    def post(self, request):
        serializer = serializers.EquipmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post_new = [Equipment.objects.create(
            type=EquipmentType.objects.get(id=request.data['type']),
            note=request.data['note'],
            serial_number=serial_number
        ) for serial_number in request.data['serial_number']]
        return Response([serializers.EquipmentSerializer(post).data for post in post_new], status=201)

def index(request):
    return render(
        request,
        'index.html',
    )
