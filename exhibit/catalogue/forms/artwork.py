from django import forms
from django.forms import ValidationError
from tempus_dominus.widgets import DatePicker

from ..models import Artwork, Series, Location, Exhibition, WorkInExhibition, ArtworkImage
from .utils import PlaceholderMixin



class ArtworkDetailForm(PlaceholderMixin, forms.ModelForm):

    artwork_image = forms.ModelChoiceField(queryset=ArtworkImage.objects.all(), required=True)

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

    uploaded_image_url = forms.CharField(required=False)
    class Meta:
        model = ArtworkImage
        fields = ['image', 'artwork']
    
    def __init__(self, *args, **kwargs):

        super(ArtworkImageUploadForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False
    
    def clean(self):
        """validaton for form as a whole
        partly adapted from https://www.vinta.com.br/blog/2015/uploading-files-from-the-frontend-to-S3/
        """
        image = self.cleaned_data.get('image')
        uploaded_image_url = self.cleaned_data.get('uploaded_image_url')
        # if have neither field we are missing the file
        if not image and not uploaded_image_url:
            self.add_error(
                'image',
                ValidationError(self.fields['image'].error_messages['required'],
                                code='required'))
        # if uploaded_image_url is set with the path of the image it was uploaded by
        # the frontend
        elif not image and uploaded_image_url:
            self.cleaned_data['image'] = uploaded_image_url
        return super(ArtworkImageUploadForm, self).clean()