from django.db import models
from django.utils.translation import ugettext as _
from django.urls import reverse
# from django.db.models import Q


class Artwork(models.Model):
    """A model representing an individual work of art"""

    # optional_field = {'blank' : True, 'null' : true}

    # Mandatory Fields ##
    image = models.ImageField(upload_to='images/', null=True)
    title = models.CharField('Title', max_length=200)
    series = models.ForeignKey('Series', on_delete=models.SET_NULL, null=True)
    year = models.IntegerField('Year', help_text="Year of creation")
    # @TODO: year maybe needs validators? idk if that's best practice for forms

    # Optional Fields ##
    width_cm = models.FloatField(default=0.0,
                                 help_text="width in centimeters",
                                 blank=True
                                 )
    height_cm = models.FloatField(default=0.0,
                                  help_text="height in centimeters",
                                  blank=True
                                  )
    width_in = models.FloatField(default=0.0,
                                 help_text="width in inches",
                                 blank=True
                                 )
    height_in = models.FloatField(default=0.0,
                                  help_text="height in inches",
                                  blank=True
                                  )

    SIZE_OPTIONS = (
        ('S', 'Small'),
        ('L', 'Large'),
    )

    size = models.CharField("size category",
                            max_length=1,
                            choices=SIZE_OPTIONS,
                            blank=True
                            )
    medium = models.CharField(max_length=250, blank=True)

    # Mutable Fields ##

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

    location = models.ForeignKey('Location',
                                 on_delete=models.SET_NULL,
                                 null=True
                                 )

    ROLL_STATUS_CHOICES = (
        ('R', 'Rolled'),
        ('S', 'Stretched'),
    )

    OVERALL_STATUS_CHOICES = (
        ('D', 'Draft'),
        ('A', 'Avaliable'),
        ('O', 'On Loan'),
        ('S', 'Sold'),
    )

    rolled = models.CharField(max_length=1, choices=ROLL_STATUS_CHOICES,
                              blank=True)
    status = models.CharField(max_length=1, choices=OVERALL_STATUS_CHOICES,
                              default='D')
    owner = models.CharField(max_length=200, default='Rotem Reshef')
    # @TODO convert owner to foreignkey

    additional = models.TextField("Additional info", blank=True)

    def __str__(self):
        """string representation of model"""
        return self.title

    def get_absolute_url(self):
        return reverse('artwork_detail', kwargs={'pk': self.pk})


class Series(models.Model):
    """A model representing a series of artworks"""

    name = models.CharField(max_length=200)

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('series_detail', kwargs={'pk': self.pk})


class Exhibition(models.Model):
    """A model representing an exhibition"""

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL,
                                 null=True)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('exhibition_detail', kwargs={'pk': self.pk})


class Location(models.Model):
    """A model representing a location"""

    name = models.CharField(max_length=250)
    description = models.TextField(blank=True)

    address_1 = models.CharField(_("address"), max_length=128)
    address_2 = models.CharField(_("address cont'd"), max_length=128,
                                 blank=True)

    city = models.CharField(_("city"), max_length=64, default="Tel Aviv")
    state = models.CharField(_("state"), blank=True, max_length=2,
                             help_text='US state, optional field')
    zip_code = models.CharField(_("zip code"), max_length=5, default="43701")
    country = models.CharField(max_length=100)  # change later

    def __str__(self):
        """string representation of model"""
        return self.name

    def get_absolute_url(self):
        return reverse('location_detail', kwargs={'pk': self.pk})


class WorkInExhibition(models.Model):
    """Class describing an artwork belonging to an exhibition"""

    artwork = models.ForeignKey('Artwork', on_delete=models.SET_NULL,
                                null=True)
    exhibition = models.ForeignKey('Exhibition', on_delete=models.SET_NULL,
                                   null=True)
