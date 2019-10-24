from django import forms
from .models import Artwork, Series, Location, Exhibition, WorkInExhibition


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'


class ArtworkDetailForm(forms.ModelForm):

    class Meta():
        model = Artwork
        fields = [
            'image',
            'title',
            'year',
            'series',
            'location',
            'status',
            'size',
            'width_cm',
            'height_cm',
            'depth_cm',
            'width_in',
            'height_in',
            'depth_in',
            'rolled',
            'medium',
            'additional',
            'owner',
            'sold_by',
            'price_nis',
            'price_usd',
            'sale_currency',
            'sale_price',
            'discount',
            'sale_date',
        ]
        widgets = {
            'image': forms.FileInput,
        }


class ArtworkSearchForm(forms.ModelForm):
    """Search for Artworks"""

    series = forms.ModelChoiceField(queryset=Series.objects.all(), required=False, empty_label="Series")
    title = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': "Title"}))
    location = forms.ModelChoiceField(queryset=Location.objects.all(), required=False, empty_label="Location")
    year = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Year'}), required=False)
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
