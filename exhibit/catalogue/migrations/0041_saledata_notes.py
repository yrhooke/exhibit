# Generated by Django 2.2.4 on 2020-03-26 02:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0040_auto_20200326_0054'),
    ]

    operations = [
        migrations.AddField(
            model_name='saledata',
            name='notes',
            field=models.TextField(blank=True, verbose_name='Notes'),
        ),
    ]