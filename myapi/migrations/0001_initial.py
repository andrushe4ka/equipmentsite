# Generated by Django 3.2.12 on 2022-07-27 23:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EquipmentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Enter equipment type name', max_length=200)),
                ('serial_number_mask', models.CharField(help_text='Enter serial number mask', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial_number', models.CharField(help_text='Enter serial number', max_length=200)),
                ('note', models.CharField(blank=True, help_text='Enter a note', max_length=200)),
                ('type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='myapi.equipmenttype')),
            ],
        ),
    ]
