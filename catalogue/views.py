from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic import ListView
from django.urls import reverse_lazy
import json
from catalogue.models import Artwork, Series, Exhibition, Location

from django.db import models
# unused but let's keep the import as memo
from django.shortcuts import render
from django.http import HttpResponse

from itertools import chain


class SearchView(ListView):
    # template_name = "search2.html"
    template_name = "search.html"
    paginate_by = 20
    count = 0

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        # context['count'] = self.count or 0
        # context['query'] = self.request.GET.get('q')
        context['resultTypes'] = list(self.model_map.keys())
        context['postParams'] = self.request.POST
        context['getParams'] = self.request.GET
        context['model'] = self.request.GET.get("resultType", "Artwork")
        return context

    model_map = {
        "Artwork": Artwork,
        "Series": Series,
        "Exhibition": Exhibition,
        "Location": Location
    }

    def _get_search_query(self, model):
        received_query = {}
        for field_name, field_content in self.request.GET.items():
            if field_name.startswith('resultFilter_'):
                
                model_fields = [f for f in model._meta.fields
                                if f.name == field_content]
                if len(model_fields) != 1:
                    continue
                model_field = model_fields[0]

                filter_id = field_name[len('resultFilter_'):]
                filterContents = self.request.GET.get(
                    f"resultFilterValue_{filter_id}")

                if isinstance(model_field, models.CharField):
                    received_query[f'{field_content}__icontains'] = filterContents
                elif isinstance(model_field, models.ForeignKey):
                    received_query[f'{field_content}__name__icontains'] = filterContents
                else:
                    received_query[f'{field_content}'] = filterContents

        return received_query

    def get_queryset(self):
        request = self.request
        result_model = self.model_map.get(request.GET.get('resultType'))
        if result_model:
            lookup_params = self._get_search_query(result_model)
            print(f"lookup: {lookup_params}")
            results = result_model.objects.filter(**lookup_params)
            print(results)
            return results

        else:
            return Artwork.objects.all()


def search(request):
    # so value from select and input are of form: request.POST.[id of param]
    print(type(request.POST))
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
        data = json.dumps(
            {
                "fields": {field.name: field.verbose_name
                           for field in model_map[model]._meta.fields
                           if field.name != "id"}
            }

        )
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
