from django import forms
from tempus_dominus.widgets import DatePicker

from .models import Artwork, Series, Location, Exhibition, WorkInExhibition, ArtworkImage


class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'
    
    use_required_attribute = False

class PlaceholderMixin(object):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        field_names = [field_name for field_name, _ in self.fields.items()]
        for field_name in field_names:
            field = self.fields.get(field_name)
            if field.help_text:
                field.widget.attrs.update({'placeholder': field.help_text})
            else:
                field.widget.attrs.update({'placeholder': field.label})
            field.placeholder = field.widget.attrs['placeholder']


class ArtworkDetailForm(PlaceholderMixin, forms.ModelForm):

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
            'image': forms.FileInput,
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


class LocationDetailForm(PlaceholderMixin, forms.ModelForm):

    class Meta():
        model = Location
        fields = [
            'name',
            'category',
            'description',
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

class ArtworkImageUploadForm(forms.ModelForm):
    """upload an ArtworkImage"""

    class Meta:
        model = ArtworkImage
        fields = ['image']