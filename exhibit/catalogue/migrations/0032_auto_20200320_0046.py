# Generated by Django 2.2.4 on 2020-03-20 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0031_auto_20191202_2124'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artwork',
            name='status',
            field=models.CharField(blank=True, choices=[('D', 'Draft'), ('A', 'Avaliable'), ('B', 'Dibs'), ('O', 'On Loan'), ('S', 'Sold')], default='A', help_text='Current status', max_length=1, verbose_name='Status'),
        ),
    ]
