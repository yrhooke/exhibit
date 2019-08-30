from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy, reverse
import json
from catalogue.models import Artwork, Series, Exhibition, Location
from catalogue.forms import WorkInExhibitionForm

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


class SearchView(LoginRequiredMixin, ListView):
    template_name = 'catalogue/search.html'
    paginate_by = 20
    count = 0

    def post(self, request, *args, **kwargs):
        """Define a handler for post requests"""

        return self.get(request, *args, **kwargs)

    def _parse_request_data(self):
        """Deserialize request POST data field from JSON"""

        return json.loads(self.request.POST.get('data', '{}'))
    
    def _clean_resultType(self, resultType):
        """check that resultType received is in model_map, otherwise set to default"""

        if model_map.get(resultType):
            return resultType
        else:
            return 'Artwork'
        



    def _no_filter_queryset(self, resultType):
        """returns a queryset object with no filters of selected resultType string"""

        resultModel = model_map.get(resultType, Artwork)
        return resultModel.objects.all().order_by('-pk')[:50]

    def _create_query_filter(self, filterDict):
        """creates a tuple of filter param and value from filter object created in the search bar"""

        fieldName = filterDict.get('fieldName')
        foreignKeyField = filterDict.get('foreignKeyField')
        fieldValue = filterDict.get('fieldValue')

        if not fieldName or fieldValue is None:
            # need to deal with it
            return None

        queryString = str(fieldName)
        if foreignKeyField:
            queryString += f"__{foreignKeyField}"
        if isinstance(fieldName, str):
            fieldValue = fieldValue.strip()
            queryString += "__icontains"

        return (queryString, fieldValue)

    def get_queryset(self):
        """returns the queryset object to be rendered as object_list by template"""

        request = self.request
        if request.method == "GET":
            return self._no_filter_queryset(request.GET.get('resultType'))
        elif request.method == "POST":
            request_data = self._parse_request_data()
            try:
                resultType = request_data['resultType']
                filters = request_data['filters']
            except KeyError:
                # KeyError - requestType or filters fields not found in POST
                resultType = "Artwork"
                filters = []

            queries = [self._create_query_filter(f) for f in filters]
            valid_queries = [query for query in queries if query]  # remove None queries
            resultModel = model_map.get(resultType)
            try:
                return resultModel.objects.filter(*valid_queries).order_by('-pk')[:50]
            except FieldError:
                # FieldError - some filter Q doesn't match resultModel fields
                return self._no_filter_queryset(resultType)

        else:
            return []

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        if self.request.method == 'GET':
            request_data = self.request.GET
        elif self.request.method == "POST":
            request_data = self._parse_request_data()

        context['modelsToSearch'] = model_map.keys()
        context['foreignKeyFields'] = {
            modelName.lower(): {field.name: field.verbose_name for field
                                in model.searchable_fields}
            for modelName, model in model_map.items()
        }
        selectedModel = self._clean_resultType(request_data.get('resultType'))
        context['selectedModel'] = selectedModel
        context['fields'] = context['foreignKeyFields'][selectedModel.lower()]
        context['filters'] = request_data.get('filters', [])

        context['createLink'] = reverse(f'catalogue:{selectedModel.lower()}_add')

        # For debug:
        context['getParams'] = self.request.GET
        context['postParams'] = self.request.POST

        return context


class SearchFilterMakerView(TemplateView):
    """View for gathering data to generate a search filter"""
    template_name = "catalogue/search_bar.html"

    def getResultType(self):
        return self.request.GET.get('ResultType', 'Artwork')

    def getResultOptions(self):
        """return list of results for model"""
        resultType = self.request.GET.get('resultType')
        model = model_map.get(resultType, Artwork)
        options = {field.name: field.verbose_name for field
                   in model.searchable_fields}
        return options

    def get_context_data(self):
        context = {
            'resultType': self.getResultType(),
            'fields': self.getResultOptions(),
            'foreignKeyFields': {
                modelName.lower(): {field.name: field.verbose_name for field
                                    in model.searchable_fields}
                for modelName, model in model_map.items()
            }
        }
        return context


class SearchFilterFKView(SearchFilterMakerView):
    """View for gathering data to generate search filter foreignKey select"""

    template_name = "catalogue/foreignkeyselect.html"


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
    template_name = 'catalogue/detail.html'

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


class ArtworkList(LoginRequiredMixin, ListView):
    model = Artwork


class ArtworkCreate(LoginRequiredMixin, genericCreateView):
    model = Artwork
    fields = artwork_fields
    template_name = 'catalogue/artwork_detail.html'

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['owner'].required = False
        return form


class ArtworkUpdate(LoginRequiredMixin, UpdateView):
    model = Artwork
    fields = artwork_fields
    # form_class = ArtworkForm
    template_name = 'catalogue/artwork_detail.html'

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


class SeriesCreate(LoginRequiredMixin, genericCreateView):
    model = Series
    fields = ['name']


class SeriesUpdate(LoginRequiredMixin, UpdateView):
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


class ExhibitionCreate(LoginRequiredMixin, genericCreateView):
    model = Exhibition
    fields = exhibition_fields


class ExhibitionUpdate(LoginRequiredMixin, UpdateView):
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


class LocationCreate(LoginRequiredMixin, genericCreateView):
    model = Location
    fields = location_fields


class LocationUpdate(LoginRequiredMixin, UpdateView):
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


class LocationDelete(LoginRequiredMixin, DeleteView):
    model = Location
    success_url = reverse_lazy('index')
