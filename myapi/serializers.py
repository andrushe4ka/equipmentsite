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

class EquipmentCreateSerializer(serializers.Serializer):
    serial_number = serializers.ListField(
        child=serializers.CharField(help_text='Enter serial number', max_length=200)
    )
    note = serializers.CharField(help_text='Enter a note', max_length=200)
    type = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=models.EquipmentType.objects.all(), required=False)

    def validate(self, data):
        """
        Check that serial number corresponds to the mask.
        """
        serial_number_mask = data['type'].serial_number_mask
        print(data['serial_number'])
        for serial_number in data['serial_number']:
            if len(serial_number) != len(serial_number_mask):
                raise serializers.ValidationError("Serial number length incorrect")

        #N - digit from 0 to 9
        #A - capital letter
        #a - lowercase letter
        #X - capital letter or digit from 0 to 9
        #Z - symbol from list: "-", "_", "@"
        mask_decode = {
            'N' : r'\d',
            'A' : r'[A-Z]',
            'a' : r'[a-z]',
            'X' : r'[A-Z\d]',
            'Z' : r'[-_@]',
        }
        regex = r'^'
        for symbol in serial_number_mask:
            regex += mask_decode[symbol]
        regex += r'$'

        for serial_number in data['serial_number']:
            ans = re.match(regex, serial_number)
            if not ans:
                raise serializers.ValidationError("Not matching the mask " + serial_number_mask + "\n" + serial_number)
        return data
