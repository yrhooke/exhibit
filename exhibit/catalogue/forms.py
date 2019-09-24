from django import forms
from .models import Artwork, Series, Location, Exhibition, WorkInExhibition


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'


class ArtworkSearchForm(forms.ModelForm):
    """Search for Artworks"""

    series = forms.ModelChoiceField(queryset=Series.objects.all(), required=False, empty_label="Series")
    title = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': "Title"}))
    location = forms.ModelChoiceField(queryset=Location.objects.all(), required=False, empty_label="Location")
    status = forms.TypedChoiceField(choices=Artwork.OVERALL_STATUS_CHOICES, required=False, empty_value="Status")
    size = forms.TypedChoiceField(choices=Artwork.OVERALL_STATUS_CHOICES, required=False, empty_value="Size Category")
    year = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Year'}), required=False)
    owner = forms.CharField(required=False)

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
