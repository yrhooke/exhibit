# Generated by Django 2.2.4 on 2020-04-06 23:07

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0045_auto_20200404_2252'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField(blank=True, default=datetime.date.today, null=True, verbose_name='From')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='To')),
                ('type', models.CharField(choices=[('M', 'Moved'), ('S', 'Sold')], default='M', max_length=1, verbose_name='Activity type')),
                ('artwork', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='catalogue.Artwork')),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='catalogue.Location')),
            ],
        ),
    ]