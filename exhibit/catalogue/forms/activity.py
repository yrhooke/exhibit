from django.forms import ModelForm
from django import forms
from tempus_dominus.widgets import DatePicker

from ..models import Location, Exhibition, Activity  # WorkInExhibition
from .utils import PlaceholderMixin


class UpdateActivityForm(forms.ModelForm):

    class Meta():
        model = Activity
        fields = "__all__"

    def clean(self):

        super(UpdateActivityForm, self).clean()

        activity_type = self.cleaned_data.get('activity_type')
        location = self.cleaned_data.get('location')


# define the class of a form
# from formValidationApp.models import * class PostForm(ModelForm):
#     class Meta:
#         # write the name of models for which the form is made
#         model = Post

#         # Custom fields
#         fields =["username", "gender", "text"]

#     # this function will be used for the validation
#     def clean(self):

#         # data from the form is fetched using super function
#         super(PostForm, self).clean()

#         # extract the username and text field from the data
#         username = self.cleaned_data.get('username')
#         text = self.cleaned_data.get('text')

#         # conditions to be met for the username length
#         if len(username) < 5:
#             self._errors['username'] = self.error_class([
#                 'Minimum 5 characters required'])
#         if len(text) <10:
#             self._errors['text'] = self.error_class([
#                 'Post Should Contain minimum 10 characters'])

#         # return any errors if found
#         return self.cleaned_data


# class WorkInExhibitionForm(forms.ModelForm):
#     class Meta():
#         model = WorkInExhibition
#         fields = '__all__'

#     use_required_attribute = False


class LocationDetailForm(PlaceholderMixin, forms.ModelForm):

    class Meta():
        model = Location
        fields = [
            'name',
            # 'category',
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
            # 'location',
            # 'start_date',
            # 'end_date',
        ]
        # widgets = {
        #     'start_date': DatePicker,
        #     'end_date': DatePicker,
        # }
