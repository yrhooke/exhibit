from django.db import models
from django.utils.translation import ugettext as _
from django.urls import reverse
# from django.db.models import Q

from datetime import date


class Artwork(models.Model):
    """A model representing an individual work of art"""

    # optional_field = {'blank' : True, 'null' : true}

    # Mandatory Fields ##
    image = models.ImageField('Image', upload_to='images/', null=True)
    title = models.CharField('Title', max_length=200)
    series = models.ForeignKey('Series', on_delete=models.SET_NULL, null=True)
    year = models.IntegerField('Year', help_text='Year of creation')

    # Optional Fields ##
    width_cm = models.FloatField(default=0.0,
                                 help_text='width in centimeters',
                                 blank=True
                                 )
    height_cm = models.FloatField(default=0.0,
                                  help_text='height in centimeters',
                                  blank=True
                                  )
    width_in = models.FloatField(default=0.0,
                                 help_text='width in inches',
                                 blank=True
                                 )
    height_in = models.FloatField(default=0.0,
                                  help_text='height in inches',
                                  blank=True
                                  )

    SIZE_OPTIONS = (
        ('S', 'Small'),
        ('L', 'Large'),
    )

    size = models.CharField('Size (S/L)',
                            max_length=1,
                            choices=SIZE_OPTIONS,
                            blank=True
                            )
    medium = models.CharField('Medium', max_length=250, blank=True, default='Diluted acrylic on canvas')

    # Mutable Fields - are expected to change over time ##


    location = models.ForeignKey('Location',
                                 on_delete=models.SET_NULL,
                                 null=True
                                 )

    ROLL_STATUS_CHOICES = (
        ('R', 'Rolled'),
        ('S', 'Stretched'),
    )


    rolled = models.CharField('Rolled/Streched', max_length=1, choices=ROLL_STATUS_CHOICES,
                              blank=True)
    
    OVERALL_STATUS_CHOICES = (
        ('D', 'Draft'),
        ('A', 'Avaliable'),
        ('O', 'On Loan'),
        ('S', 'Sold'),
    )
    status = models.CharField('Status', max_length=1, choices=OVERALL_STATUS_CHOICES,
                              default='D')
    additional = models.TextField('Additional info', blank=True)

    # Sale fields
    owner = models.CharField('Owner', max_length=200, default='Rotem Reshef')
    price_nis = models.DecimalField("Price in NIS",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True
                                    )
    price_usd = models.DecimalField("Price in US Dollars",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True
                                    )
    sale_price = models.DecimalField("Sale Price",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True
                                    )
    sale_currency = models.CharField("Sale currency", max_length=10, blank=True)
    discount = models.DecimalField("Discount",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True
                                    )
    sale_date = models.DateField("Sale Date", default=date.today)

    # @TODO convert owner to foreignkey


    def __str__(self):
        """string representation of model"""
        return self.title

    def get_absolute_url(self):
        return reverse('catalogue:artwork_detail', kwargs={'pk': self.pk})

    searchable_fields = [
        series,
        title,
        location,
        status,
        year,
        size,
        medium,
        rolled,
        owner,
    ]



class Series(models.Model):
    """A model representing a series of artworks"""

    name = models.CharField("Name", max_length=200)

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('catalogue:series_detail', kwargs={'pk': self.pk})

    searchable_fields = [
        name,
    ]

    def count(self):
        return Artwork.objects.filter(series__pk=self.pk).count()

    @property
    def time_range(self):
        artworks_in_series = Artwork.objects.filter(series__pk=self.pk).order_by('year')
        return {'first': artworks_in_series.first().year, 'last' : artworks_in_series.last().year}



class Exhibition(models.Model):
    """A model representing an exhibition"""

    name = models.CharField("Name", max_length=200)
    description = models.TextField("Description", blank=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL,
                                 null=True)
    start_date = models.DateField("Start Date", default=date.today)
    end_date = models.DateField("End Date", default=date.today)

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('catalogue:exhibition_detail', kwargs={'pk': self.pk})

    searchable_fields = [
        name,
        description,
        location,
        start_date,
        end_date,
    ]
    
    def count(self):
        return WorkInExhibition.objects.filter(exhibition__pk=self.pk).count()


class Location(models.Model):
    """A model representing a location"""

    name = models.CharField("Name", max_length=250)
    description = models.TextField("Description", blank=True)

    # What's this naming scheme about? @TODO figure this out
    address_1 = models.CharField(_("address"), max_length=128)
    address_2 = models.CharField(_("address cont'd"), max_length=128,
                                 blank=True)

    city = models.CharField(_("city"), max_length=64)
    state = models.CharField(_("state"), blank=True, max_length=2,
                             help_text='US state, optional field')
    zip_code = models.CharField(_("zip code"), max_length=5, blank=True)
    country = models.CharField(max_length=100)  # change later

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('catalogue:location_detail', kwargs={'pk': self.pk})

    searchable_fields = [
        name,
        description,
        address_1,
        city,
        state,
        country,
        zip_code,
    ]


class WorkInExhibition(models.Model):
    """Class describing an artwork belonging to an exhibition"""

    artwork = models.ForeignKey('Artwork', on_delete=models.SET_NULL,
                                null=True)
    exhibition = models.ForeignKey('Exhibition', on_delete=models.SET_NULL,
                                   null=True)
