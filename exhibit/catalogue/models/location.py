from django.db import models
from django.utils.translation import ugettext as _
from django.urls import reverse

from datetime import date


class Exhibition(models.Model):
    """A model representing an exhibition"""

    name = models.CharField("Name", max_length=200, help_text="Exhibition name")
    description = models.TextField("Description", blank=True)
    additional = models.TextField('Additional info', blank=True, help_text="Anything else of interest")

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

    # def count(self):
    #     return WorkInExhibition.objects.filter(exhibition__pk=self.pk).count()


class Location(models.Model):
    """A model representing a location or person"""

    ### Location information
    address_1 = models.CharField(_("Address"), max_length=128, blank=True)
    address_2 = models.CharField(_("Address cont'd"), max_length=128,
                                 blank=True)

    city = models.CharField(_("City"), max_length=64, blank=True)
    state = models.CharField(_("State"), blank=True, max_length=2,
                             help_text='US state, optional field')
    zip_code = models.CharField(_("Zip code"), max_length=10, blank=True)
    country = models.CharField(_("Country"), max_length=100, blank=True)  # change later

    ### Contact Info
    phone = models.CharField(_("Phone number"), max_length=25, blank=True)
    email = models.EmailField(_("Email address"), blank=True)
    additional = models.TextField('Additional info', blank=True, help_text="Anything else of interest")

    ### Personal info
    name = models.CharField("Name", max_length=250, help_text="Location name", blank=True)
    description = models.TextField("Description", blank=True)

    ### Location type (mandatory)
    is_temporary = models.BooleanField(_("Remember this location"), default=False)
    agent = models.BooleanField(_("Is an agent"), default=False)
    client = models.BooleanField(_("A Client"), default=False)
    gallery = models.BooleanField(_("Gallery or Museum"), default=False)
    mine = = models.BooleanField(_("My Location"), default=False, help_text="If the work is here I have it")
    
    ### Other
    permanent = models.BooleanField("Permanent location", default=False)

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

class Activity(models.Model):
    """class describing something happening to an artwork"""
    
    ### Activity specific required fields
    ACTIVITY_TYPES = (
        ('S', 'Sold'),
        ('L', 'Loaned'),
        ('M', 'Moved'),
        ('A', 'Given to Agent'),
        ('E', 'Shown'),
        ('O', 'Other'),
    )
    activity_type = models.CharField('Type', max_length=1, choices=ACTIVITY_TYPES,
                              help_text="Type of Activity")
    location = models.ForeignKey("Location" verbose_name="Location/Person", on_delete=models.CASCADE)

    ### time data
    start_date = models.DateField("Start Date", default=date.today, blank=True, null=True)
    end_date = models.DateField("End Date", default=date.today, blank=True, null=True)
    long_term = models.BooleanField("Long term activity", default=False, 
                    help_text="Without new information, should we assume this is still true?")
    current = models.BooleanField("Is it currently there?", default=False)
    # if current is true don't let them enter an end date before the present 

    ### Type specific fields
    # should only apply to sales: 
    sale_info = models.ForeignKey("SaleData", on_delete=models.SET_NULL, default=None, null=True, blank=True)
    # only for exhibition
    exhibition = models.ForeignKey("Exhibition", on_delete=models.SET_NULL, default=None, null=True, blank=True)
    # only for Other
    type_name = models.CharField("Type name", max_length="128", default=None, null=True, blank=True) 

    # Other info (idk when to show this)
    additional = models.TextField('Additional info', blank=True, help_text="Anything else of interest")

class SaleData(models.Model):
    """The financial data related to a sale"""
    
   # Sale fields
    sold_by = models.ForeignKey("Location", on_delete=models.SET_NULL, null=True, blank=True)
    discount = models.CharField("Discount", max_length=25)
    sale_price = models.DecimalField("Sale Price",
                                     max_digits=10,
                                     decimal_places=2,
                                     null=True,
                                     blank=True,
                                     help_text="Price of final sale"
                                     )
    agent_fee = models.DecimalField("Amount to Artist",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True,
                                    help_text="Amount to artist after fees"
                                    )
    amount_to_artist = models.DecimalField("Amount to Artist",
                                    max_digits=10,
                                    decimal_places=2,
                                    null=True,
                                    blank=True,
                                    help_text="Amount to artist after fees"
                                    )
    sale_currency = models.CharField("Sale currency", max_length=10, blank=True)
