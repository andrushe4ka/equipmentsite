import re
from rest_framework import serializers

from . import models

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EquipmentType
        fields = ('id','name',)
        
class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Equipment
        fields = ('serial_number', 'note', 'type')
    def validate_serial_number(self, value):
        """
        Check that serial number corresponds to the mask.
        """
        if len(value) < 3:
            raise serializers.ValidationError("Length is less than 3 symbols")
        regex = r'^\d{2}[A-Z]{1}$'
        ans = re.match(regex, value)
        if not ans:
            raise serializers.ValidationError("Doesn't match the mask")
        return value
