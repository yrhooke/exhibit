# Generated by Django 2.2.4 on 2019-10-24 16:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0015_auto_20191024_1554'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artwork',
            name='additional',
            field=models.TextField(blank=True, help_text='Anything else of interest', verbose_name='Additional info'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='discount',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Discount if any', max_digits=10, null=True, verbose_name='Discount'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='framed',
            field=models.NullBooleanField(help_text='Is the work framed?', verbose_name='Framed'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='image',
            field=models.ImageField(help_text='Sample image of the artwork', null=True, upload_to='images/', verbose_name='Image'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='location',
            field=models.ForeignKey(help_text="Artwork's current location", null=True, on_delete=django.db.models.deletion.SET_NULL, to='catalogue.Location'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='medium',
            field=models.CharField(blank=True, default='Diluted acrylic on canvas', help_text='medium of creation', max_length=250, verbose_name='Medium'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='owner',
            field=models.CharField(default='Rotem Reshef', help_text="The artwork's current owner", max_length=200, verbose_name='Owner'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='price_nis',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Price NIS', max_digits=10, null=True, verbose_name='Price in NIS'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='price_usd',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Price USD', max_digits=10, null=True, verbose_name='Price in US Dollars'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='rolled',
            field=models.CharField(blank=True, choices=[('R', 'Rolled'), ('S', 'Stretched')], help_text='Is the work rolled or stretched?', max_length=1, verbose_name='Rolled/Streched'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='sale_price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Price of final sale', max_digits=10, null=True, verbose_name='Sale Price'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='series',
            field=models.ForeignKey(help_text='The series to which the artwork belongs', null=True, on_delete=django.db.models.deletion.SET_NULL, to='catalogue.Series'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='size',
            field=models.CharField(blank=True, choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large'), ('H', 'Scroll')], help_text='How large is this piece?', max_length=1, verbose_name='Size Category'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='sold_by',
            field=models.CharField(blank=True, help_text='The agent who facilitated the sale', max_length=200, verbose_name='Sold By'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='status',
            field=models.CharField(blank=True, choices=[('D', 'Draft'), ('A', 'Avaliable'), ('O', 'On Loan'), ('S', 'Sold')], default='D', help_text='current status', max_length=1, verbose_name='Status'),
        ),
        migrations.AlterField(
            model_name='artwork',
            name='title',
            field=models.CharField(help_text="The works's title", max_length=200, verbose_name='Title'),
        ),
    ]
