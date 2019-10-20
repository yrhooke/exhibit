from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy, reverse
import json
from catalogue.models import Artwork, Series, Exhibition, Location
from catalogue.forms import WorkInExhibitionForm, ArtworkSearchForm, LocationSearchForm, ExhibitionSearchForm

from django.core.exceptions import FieldError
from django.db import models
# unused but let's keep the import as memo
# from django.shortcuts import render
from django.http import HttpResponse

model_map = {
    "Artwork": Artwork,
    "Series": Series,
    "Exhibition": Exhibition,
    "Location": Location
}


class HomeView(LoginRequiredMixin, ListView):
    template_name = 'home.html'
    model = Series


class SearchMixin(object):
    """method bundle for searching for Artworks"""

    def _parse_request_data(self):
        """Deserialize request POST data field from JSON"""

        return json.loads(self.request.GET.get('search_form_data', '{}'))

    def _prefill_forms(self, artworkargs=None, locationargs=None, exhibitionargs=None):
        """creates instance of form classes prefilled with request data and custom args"""

        request_data = self._parse_request_data()

        if artworkargs:
            if request_data.get('artwork'):
                request_data['artwork'].update(artworkargs)
            else:
                request_data['artwork'] = artworkargs
        if locationargs:
            if request_data.get('location'):
                request_data['location'].update(locationargs)
            else:
                request_data['location'] = locationargs
        if exhibitionargs:
            if request_data.get('exhibition'):
                request_data['exhibition'].update(exhibitionargs)
            else:
                request_data['exhibition'] = exhibitionargs

        artwork_form = ArtworkSearchForm(request_data.get('artwork'))
        location_form = LocationSearchForm(request_data.get('location'))
        exhibition_form = ExhibitionSearchForm(request_data.get('exhibition'))

        return artwork_form, location_form, exhibition_form

    def _create_query_filter(self, field_name, field_value, prefix=None):
        """creates a tuple of filter param and value from filter object created in the search bar"""
        if field_value == None:
            return None
        query_param = field_name
        if prefix:
            query_param = f'{prefix}__{query_param}'
        if isinstance(field_value, str):
            query_param += "__icontains"
        return (query_param, field_value)

    def _make_form_queries(self, form, prefix=None):
        """make a list of queries for each field in a form"""
        queries = []
        if form.is_bound:
            for field_name, field_value in form.cleaned_data.items():
                if field_value:
                    queries.append(self._create_query_filter(field_name, field_value, prefix))
        return queries

    def execute_search(self, artworkargs=None, locationargs=None, exhibitionargs=None):
        """returns the queryset object to be rendered as object_list by template"""

        artwork_form, location_form, exhibition_form = self._prefill_forms(artworkargs=artworkargs,
                                                                           locationargs=locationargs,
                                                                           exhibitionargs=exhibitionargs)

        validitiy = [
            artwork_form.is_valid(),
            location_form.is_valid(),
            exhibition_form.is_valid(),
        ]

        queries = (self._make_form_queries(artwork_form) +
                   self._make_form_queries(location_form, 'location') +
                   self._make_form_queries(exhibition_form, 'workinexhibition'))
        valid_queries = [query for query in queries if query]  # remove None queries
        queryset = Artwork.objects.filter(*valid_queries)

        return queryset.order_by('-pk')[:50]

    def get_context_data(self, **kwargs):
        context = super(SearchMixin, self).get_context_data(**kwargs)

        artwork_search_args, exhibition_search_args = dict(), dict()
        if kwargs.get('series'):
            artwork_search_args['series'] = kwargs['series'].pk
        if kwargs.get('location'):
            artwork_search_args['location'] = kwargs['location'].pk
        if kwargs.get('exhibition'):
            exhibition_search_args = {'exhibition': kwargs['exhibition'].pk}
        context['search_results'] = self.execute_search(artworkargs=artwork_search_args,
                                                        exhibitionargs=exhibition_search_args)
        forms = self._prefill_forms(artworkargs={
            'owner': '',
            'medium': '',
            'status': None
        })
        context['artwork_search_form'] = forms[0]
        context['location_search_form'] = forms[1]
        context['exhibition_search_form'] = forms[2]

        return context


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


create_action_button_text = 'Create'
edit_action_button_text = 'Save Changes'


class genericCreateView(CreateView):
    template_name = 'catalogue/detail/detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = create_action_button_text
        return context


artwork_fields = [
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


class ArtworkList(LoginRequiredMixin, SearchMixin, ListView):
    model = Artwork
    template_name = 'catalogue/overview/artwork.html'


class ArtworkCreate(LoginRequiredMixin, genericCreateView):
    model = Artwork
    fields = artwork_fields
    template_name = 'catalogue/detail/artwork_detail.html'

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form


class ArtworkUpdate(LoginRequiredMixin, UpdateView):
    model = Artwork
    fields = artwork_fields
    # form_class = ArtworkForm
    template_name = 'catalogue/detail/artwork_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        context['editMode'] = True
        exhibitions = [
            s.exhibition for s in self.object.workinexhibition_set.all()]
        context['exhibitionList'] = exhibitions
        context['exhibitionForm'] = WorkInExhibitionForm(
            initial={'artwork': self.get_object()}
        )
        return context

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['image'].required = False
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form


def add_work_in_exhibition(request):
    # if this is a POST request we need to process the form data
    try:
        if request.method == 'POST':
            # create a form instance and populate it with data from the request:
            form = WorkInExhibitionForm(request.POST)
            # check whether it's valid:
            if form.is_valid():
                # process the data in form.cleaned_data as required
                # ...
                # redirect to a new URL:
                form.save()
                return HttpResponse('/thanks/')
        else:
            return HttpResponse("didn't POST")
    except Exception as e:
        print(e)
        return HttpResponse('Failure')


class ArtworkDelete(LoginRequiredMixin, DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')


class SeriesList(LoginRequiredMixin, ListView):
    model = Series
    template_name = 'catalogue/overview/series.html'


class SeriesCreate(LoginRequiredMixin, genericCreateView):
    model = Series
    fields = ['name']


class SeriesUpdate(LoginRequiredMixin, SearchMixin, UpdateView):
    model = Series
    fields = ['name']
    template_name = 'catalogue/detail/series_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(SeriesUpdate, self).get_context_data(series=self.get_object(), **kwargs)
        # Add in a QuerySet of all the books
        context['hasSeries'] = True
        context['action_name'] = edit_action_button_text
        context['members'] = self.object.artwork_set.all()
        return context


class SeriesDelete(LoginRequiredMixin, DeleteView):
    model = Series
    success_url = reverse_lazy('index')


exhibition_fields = [
    'name',
    'description',
    'location',
    'start_date',
    'end_date',
]


class ExhibitionList(LoginRequiredMixin, ListView):
    model = Exhibition
    template_name = "catalogue/overview/exhibition.html"


class ExhibitionCreate(LoginRequiredMixin, genericCreateView):
    model = Exhibition
    fields = exhibition_fields


class ExhibitionUpdate(LoginRequiredMixin, SearchMixin, UpdateView):
    model = Exhibition
    fields = exhibition_fields
    template_name = 'catalogue/detail/exhibition_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(ExhibitionUpdate, self).get_context_data(exhibition=self.object, **kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        context['hasExhibition'] = True
        artworks = [s.artwork for s in self.object.workinexhibition_set.all()]
        context['members'] = artworks
        return context


class ExhibitionDelete(LoginRequiredMixin, DeleteView):
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


class LocationList(LoginRequiredMixin, ListView):
    model = Location
    template_name = "catalogue/overview/location.html"


class LocationCreate(LoginRequiredMixin, genericCreateView):
    model = Location
    fields = location_fields


class LocationUpdate(LoginRequiredMixin, SearchMixin, UpdateView):
    model = Location
    fields = location_fields
    template_name = 'catalogue/detail/location_detail.html'

    def get_context_data(self, **kwargs):

        # Call the base implementation first to get a context
        context = super(LocationUpdate, self).get_context_data(location=self.object, **kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = edit_action_button_text
        context['hasLocation'] = True
        context['members'] = self.object.artwork_set.all()
        return context


class LocationDelete(LoginRequiredMixin, DeleteView):
    model = Location
    success_url = reverse_lazy('index')
