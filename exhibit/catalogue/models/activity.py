from django.db import models
from django.utils.translation import ugettext as _
from django.urls import reverse
# from django.db.models import Q

from datetime import date
from operator import itemgetter

class Activity(models.Model):
    """an event in the artwork's lifetime"""

    artwork = models.ForeignKey('Artwork', on_delete=models.CASCADE)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)
    start_date = models.DateField("From", default=date.today, null=True, blank=True)
    end_date = models.DateField("To", null=True, blank=True)

    ACTIVITY_TYPES = (
        ('M', 'Moved'),
        ('S', 'Sold'),
    )

    activity_type = models.CharField('Activity type', max_length=1, choices=ACTIVITY_TYPES, default='M')




class Exhibition(models.Model):
    """A model representing an exhibition"""

    name = models.CharField("Name", max_length=200, help_text="Exhibition name")
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

    name = models.CharField("Name", max_length=250, help_text="Location name")
    description = models.TextField("Description", blank=True)

    # contact details
    phone_number = models.CharField("Phone number", max_length=25, blank=True)
    email = models.EmailField("Email", max_length=128, blank=True)

    # What's this naming scheme about? @TODO figure this out
    address_1 = models.CharField(_("Address"), max_length=128)
    address_2 = models.CharField(_("Address cont'd"), max_length=128,
                                 blank=True)

    city = models.CharField(_("City"), max_length=64)
    state = models.CharField(_("State"), blank=True, max_length=2,
                             help_text='US state, optional field')
    zip_code = models.CharField(_("Zip code"), max_length=10, blank=True)
    country = models.CharField("Country", max_length=100)  # change later

    LOCATION_CATEGORIES = (
        ('P', 'Permanent'),
        ('C', 'Client'),
        ('G', 'Gallery'),
    )

    category = models.CharField('Category', max_length=1, choices=LOCATION_CATEGORIES,
                                blank=True)

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

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['artwork', 'exhibition'], name='artwork in exhibition once')
        ]


class SaleData(models.Model):
    """Class representing a sale"""

    artwork = models.ForeignKey('Artwork', on_delete=models.CASCADE, null=True, blank=True)
    buyer = models.ForeignKey('Location', related_name='buyer', on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField("Notes", blank=True)

    # Sale Fields
    agent = models.ForeignKey('Location', related_name='agent', on_delete=models.SET_NULL, null=True, blank=True, help_text="The agent's name")
    sale_currency = models.CharField("Sale currency", max_length=10, blank=True)
    sale_price = models.DecimalField("Sale Price",
                                     max_digits=10,
                                     decimal_places=2,
                                     null=True,
                                     blank=True,
                                     help_text="Price of final sale"
                                     )
    discount = models.CharField("Discount", max_length=25, blank=True, help_text="In amount or percentage")
    agent_fee = models.DecimalField("Amount to Artist",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True,
                                    help_text="amount to the agent"
                                    )
    amount_to_artist = models.DecimalField("Amount to Artist",
                                           max_digits=10,
                                           decimal_places=2,
                                           null=True,
                                           blank=True,
                                           help_text="Amount to artist after fees")

    sale_date = models.DateField("Sale Date", blank=True, null=True)
