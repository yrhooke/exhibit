from django import forms
from tempus_dominus.widgets import DatePicker

from ..models import Artwork, Series, Location, Exhibition, WorkInExhibition, ArtworkImage


class ArtworkSearchForm(forms.ModelForm):
    """Search for Artworks"""

    series = forms.ModelChoiceField(queryset=Series.objects.all(), required=False, empty_label="Series")
    title = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': "Title"}))
    location = forms.ModelChoiceField(queryset=Location.objects.all(), required=False, empty_label="Location")
    year = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Year'}), required=False)
    medium = forms.CharField(required=False)
    owner = forms.CharField(required=False)

    status_choices = (('', 'Status'), *Artwork.OVERALL_STATUS_CHOICES)
    status = forms.TypedChoiceField(choices=status_choices, required=False)

    size_choices = (('', 'Size Category'), *Artwork.SIZE_OPTIONS)
    size = forms.TypedChoiceField(choices=size_choices, required=False)

    class Meta():
        model = Artwork
        fields = [
            'series',
            'title',
            'location',
            'status',
            'year',
            'size',
            'medium',
            'rolled',
            'owner',
        ]


class LocationSearchForm(forms.ModelForm):
    """Search for locations"""

    name = forms.CharField(required=False)
    address_1 = forms.CharField(required=False)
    city = forms.CharField(required=False)
    country = forms.CharField(required=False)

    class Meta():
        model = Location
        fields = [
            'name',
            'description',
            'address_1',
            'city',
            'state',
            'country',
            'zip_code',
        ]


class ExhibitionSearchForm(forms.Form):
    """search for exhibitions"""
    exhibition = forms.ModelChoiceField(queryset=Exhibition.objects.all(), required=False,
                                        label="Was in Exhibition", empty_label="")
