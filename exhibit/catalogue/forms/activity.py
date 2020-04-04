from django import forms
from tempus_dominus.widgets import DatePicker

from ..models import Artwork, Series, Location, Exhibition, WorkInExhibition, ArtworkImage, SaleData
from .utils import PlaceholderMixin


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'

    use_required_attribute = False


class LocationDetailForm(PlaceholderMixin, forms.ModelForm):

    class Meta():
        model = Location
        fields = [
            'name',
            'category',
            'description',
            'phone_number',
            'email',
            'address_1',
            'address_2',
            'city',
            'state',
            'zip_code',
            'country',
        ]


class ExhibitionDetailForm(PlaceholderMixin, forms.ModelForm):

    class Meta():
        model = Exhibition
        fields = [
            'name',
            'description',
            'location',
            'start_date',
            'end_date',
        ]
        widgets = {
            'start_date': DatePicker,
            'end_date': DatePicker,
        }


class SaleDataUpdateForm(forms.ModelForm):

    sale_date = forms.DateField(required=False)

    class Meta():
        model = SaleData
        fields = '__all__'
