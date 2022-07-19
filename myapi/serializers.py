from rest_framework import serializers

from . import models

class EquipmentTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.EquipmentType
        fields = ('id','name',)
        
class EquipmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Equipment
        fields = ('serial_number', 'type') 
