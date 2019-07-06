from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic import ListView
from django.urls import reverse_lazy

from catalogue.models import Artwork, Series, Exhibition, Location

# unused but let's keep the import as memo
from django.shortcuts import render
from django.http import HttpResponse


class genericCreateView(CreateView):
    template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = 'Create'
        return context


class genericUpdateView(UpdateView):
    template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = 'Save Changes'
        return context


artwork_fields = [
    'title',
    'year',
    'series',
    'location',
    'status',
    'size',
    'width_cm',
    'height_cm',
    'width_in',
    'height_in',
    'rolled',
    'medium',
    'price_nis',
    'price_usd',
    'owner',
    'additional',
]


class ArtworkList(ListView):
    model = Artwork


class ArtworkCreate(genericCreateView):
    model = Artwork
    fields = artwork_fields


class ArtworkUpdate(genericUpdateView):
    model = Artwork
    fields = artwork_fields


class ArtworkDelete(DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')


class SeriesList(ListView):
    model = Series


class SeriesCreate(genericCreateView):
    model = Series
    fields = ['name']


class SeriesUpdate(genericUpdateView):
    model = Series
    fields = ['name']


class SeriesDelete(DeleteView):
    model = Series
    success_url = reverse_lazy('index')


exhibition_fields = [
    'name',
    'description',
    'location',
    'start_date',
    'end_date',
]


class ExhibitionList(ListView):
    model = Exhibition


class ExhibitionCreate(genericCreateView):
    model = Exhibition
    fields = exhibition_fields


class ExhibitionUpdate(genericUpdateView):
    model = Exhibition
    fields = exhibition_fields


class ExhibitionDelete(DeleteView):
    model = Exhibition
    success_url = reverse_lazy('index')


location_fields = [
    'name',
    'description',
    'address_1',
    'address_2',
    'city',
    'state',
    'zip_code',
    'country',
]


class LocationList(ListView):
    model = Location


class LocationCreate(genericCreateView):
    model = Location
    fields = location_fields


class LocationUpdate(genericUpdateView):
    model = Location
    fields = location_fields


class LocationDelete(DeleteView):
    model = Location
    success_url = reverse_lazy('index')
