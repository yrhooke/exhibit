from django import forms
from .models import Artwork, Location, Exhibition, WorkInExhibition


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'


class ArtworkSearchForm(forms.ModelForm):

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


class ExhibitionSearchForm(forms.ModelForm):

    class Meta():
        model = Exhibition
        fields = [
            'name',
            'description',
            'location',
            'start_date',
            'end_date',
        ]
