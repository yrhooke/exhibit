# Generated by Django 2.2.4 on 2019-11-10 20:39

import config.settings.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0023_series_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artwork',
            name='image',
            field=models.ImageField(help_text='Sample image of the artwork', null=True, storage=config.settings.storage_backends.S3MediaStorage(), upload_to='images/', verbose_name='Image'),
        ),
    ]
