from django import forms
from tempus_dominus.widgets import DatePicker

from ..models import Artwork, Series, Location, Exhibition, WorkInExhibition, ArtworkImage, SaleData
from .utils import PlaceholderMixin



class ArtworkDetailForm(PlaceholderMixin, forms.ModelForm):

    artwork_image = forms.ModelChoiceField(queryset=ArtworkImage.objects.all(), required=True)
    sale_data = forms.ModelChoiceField(queryset=SaleData.objects.all())

    class Meta():
        model = Artwork
        fields = [
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
            'framed',
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
            'sale_date': DatePicker,
            'width_cm': forms.TextInput,
            'height_cm': forms.TextInput,
            'depth_cm': forms.TextInput,
            'width_in': forms.TextInput,
            'height_in': forms.TextInput,
            'depth_in': forms.TextInput,
        }


class SeriesDetailForm(PlaceholderMixin, forms.ModelForm):

    class Meta():
        model = Series
        fields = '__all__'



class ArtworkImageUploadForm(forms.ModelForm):
    """upload an ArtworkImage"""

    class Meta:
        model = ArtworkImage
        fields = ['image', 'artwork']