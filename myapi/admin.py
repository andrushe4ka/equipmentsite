from django.contrib import admin

# Register your models here.

from .models import EquipmentType, Equipment
admin.site.register(EquipmentType)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('type', 'serial_number', 'note',)
admin.site.register(Equipment, EquipmentAdmin)
