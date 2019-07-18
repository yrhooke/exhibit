from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic import ListView
from django.urls import reverse_lazy
import json
from catalogue.models import Artwork, Series, Exhibition, Location

# unused but let's keep the import as memo
from django.shortcuts import render
from django.http import HttpResponse


def search(request):

    context = {
        'resultTypes': ['Artwork', 'Series', 'Exhibition', 'Location'],
        'postParams': request.POST,
        'getParams': request.GET,
    }
    return render(request, 'search.html', context=context)


def searchSelector(request):
    model = request.POST.get('resultType')
    model_map = {
        "Artwork": Artwork,
        "Series": Series,
        "Exhibition": Exhibition,
        "Location": Location
    }
    if model:
        data = json.dumps({
            "fields": [field.verbose_name for field in model_map[model]._meta.fields]
        })
    else:
        data = json.dumps(["Invalid model"])
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


def autocompleteView(request):
    if request.is_ajax():
        q = request.GET.get('term', '').capitalize()
        search_qs = Artwork.objects.all()  # filter(title__startswith=q)
        results = []
        print(q)
        for r in search_qs:
            results.append(r.FIELD)
        data = json.dumps(results)
    else:
        data = 'fail'
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


def ajaxEasyView(request):
    if request.is_ajax():
        data = "\"success\""
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)


create_action_button_text = 'Create'
edit_action_button_text = 'Save Changes'


class genericCreateView(CreateView):
    template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = create_action_button_text
        return context


# class genericUpdateView(UpdateView):
#     template_name = 'detail.html'

#     def get_context_data(self, **kwargs):
#         # Call the base implementation first to get a context
#         context = super().get_context_data(**kwargs)
#         # Add in a QuerySet of all the books
#         context['action_name'] = edit_action_button_text
#         context['pk'] = self.object.pk
#         context['model_name'] = self.model.__name__
#         context['not_artwork'] = not (self.model == Artwork)
#         if self.model != Artwork:
#             context['members'] = self.object.artwork_set.all()
#         return context


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


class ArtworkUpdate(UpdateView):
    model = Artwork
    fields = artwork_fields
    template_name = 'catalogue/artwork_detail.html'
    # template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        exhibitions = [
            s.exhibition for s in self.object.workinexhibition_set.all()]
        context['members'] = exhibitions
        return context


class ArtworkDelete(DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')


class SeriesList(ListView):
    model = Series


class SeriesCreate(genericCreateView):
    model = Series
    fields = ['name']


class SeriesUpdate(UpdateView):
    model = Series
    fields = ['name']
    template_name = 'catalogue/series_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        context['members'] = self.object.artwork_set.all()
        return context


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


class ExhibitionUpdate(UpdateView):
    model = Exhibition
    fields = exhibition_fields
    template_name = 'catalogue/exhibition_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        artworks = [s.artwork for s in self.object.workinexhibition_set.all()]
        context['members'] = artworks
        return context


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


class LocationUpdate(UpdateView):
    model = Location
    fields = location_fields
    template_name = 'catalogue/location_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        context['members'] = self.object.artwork_set.all()
        return context


class LocationDelete(DeleteView):
    model = Location
    success_url = reverse_lazy('index')
