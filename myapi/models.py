from django.db import models

# Create your models here.
class EquipmentType(models.Model):
	name = models.CharField(max_length=200, help_text="Enter equipment type name")
	serial_number_mask = models.CharField(max_length=200, help_text="Enter serial number mask")
	def __str__(self):
		return self.name

class Equipment(models.Model):
	type = models.ForeignKey('EquipmentType', on_delete=models.SET_NULL, null=True)
	serial_number = models.CharField(max_length=200, help_text="Enter serial number")
	note = models.CharField(max_length=200, blank=True, help_text="Enter a note")
	def __str__(self):
		return '%s (%s)' % (self.serial_number, self.type)
