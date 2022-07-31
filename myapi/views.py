from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import generics

from . import serializers
from .models import EquipmentType, Equipment
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.pagination import PageNumberPagination
class EquipmentListPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10000

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
from rest_framework import filters
from rest_framework.exceptions import ValidationError
from rest_framework import status

class EquipmentCreateView(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['serial_number', 'note']
    pagination_class = EquipmentListPagination
    authentication_classes = [BasicAuthentication]
    permission_classes = (AllowAny, )

    def post(self, request):

        serializer_set = [serializers.EquipmentSerializer(
            data = {
                'type': request.data['type'],
                'serial_number' : serial_number,
                'note' : request.data['note'],
            }
        ) for serial_number in request.data['serial_number']]

        errors = [serializer.errors for serializer in serializer_set if not serializer.is_valid()]
        if errors:
            raise ValidationError(errors)

        for serializer in serializer_set:
            serializer.save()

        return Response([serializer.data for serializer in serializer_set], status=status.HTTP_201_CREATED)

class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = (AllowAny, )

def index(request):
    return render(
        request,
        'index.html',
    )
