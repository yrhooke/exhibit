from django import forms
from .models import Artwork, Series, Location, Exhibition, WorkInExhibition


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'


class ArtworkSearchForm(forms.ModelForm):
    """Search for Artworks"""
    class Meta():
        model = Artwork
        fields = [
            'series',
            'title',
            'location',
            # 'status',
            'year',
            'size',
            'medium',
            'rolled',
            'owner',
        ]
    

class LocationSearchForm(forms.ModelForm):
    """Search for locations"""
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
    label="Was in Exhibition")


