from django.contrib import admin

# Register your models here.

from .models import EquipmentType, Equipment
admin.site.register(EquipmentType)
admin.site.register(Equipment)
