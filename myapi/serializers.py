import re
from rest_framework import serializers

from . import models

def validate_serial_number(serial_number, serial_number_mask):
    """
    Check that serial number corresponds to the mask.
    """

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

    return(re.match(regex, serial_number) is not None)

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EquipmentType
        fields = ('id','name',)
        
class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Equipment
        fields = ('id', 'serial_number', 'note', 'type')

    def validate(self, data):
        serial_number_mask = data['type'].serial_number_mask

        serial_number = data['serial_number']
        if not validate_serial_number(serial_number, serial_number_mask):
            raise serializers.ValidationError({'serial_number':'not matching the mask "' + serial_number_mask + '": ' + serial_number})
        return data
