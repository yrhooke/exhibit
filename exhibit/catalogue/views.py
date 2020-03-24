import json

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse 
from django.http import HttpResponseNotAllowed, HttpResponseBadRequest
from django.urls import reverse_lazy, reverse, NoReverseMatch
from django.views.generic import ListView, TemplateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.expressions import F
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import redirect, render

from catalogue.models import Artwork, Series, Exhibition, Location, ArtworkImage
from catalogue.forms import ArtworkDetailForm, SeriesDetailForm, LocationDetailForm, ExhibitionDetailForm
from catalogue.forms import ArtworkSearchForm, LocationSearchForm, ExhibitionSearchForm
from catalogue.forms import WorkInExhibitionForm
from catalogue.forms import ArtworkImageUploadForm


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

        ordered_queryset = queryset.order_by(
            F('size').desc(nulls_last=True),
            F('year').desc(nulls_last=True),
            'series__id',
            'title',
        )

        # return queryset.order_by('size').desc(nulls_last=True).order_by('year').desc(nulls_last=True).order_by, 'series__id', 'title')[:50]
        return ordered_queryset

    def get_context_data(self, **kwargs):
        context = super(SearchMixin, self).get_context_data(**kwargs)
        artwork_search_args, exhibition_search_args = dict(), dict()
        if kwargs.get('series'):
            artwork_search_args['series'] = kwargs['series'].pk
        if kwargs.get('location'):
            artwork_search_args['location'] = kwargs['location'].pk
        if kwargs.get('exhibition'):
            exhibition_search_args = {'exhibition': kwargs['exhibition'].pk}
        search_results = self.execute_search(artworkargs=artwork_search_args,
                                             exhibitionargs=exhibition_search_args)

        page = self.request.GET.get('page', 1)
        paginator = Paginator(search_results, 30)
        try:
            context['search_results'] = paginator.page(page)
        except PageNotAnInteger:
            context['search_results'] = paginator.page(1)
        except EmptyPage:
            context['search_results'] = paginator.page(paginator.num_pages)

        forms = self._prefill_forms()
        context['artwork_search_form'] = forms[0]
        context['location_search_form'] = forms[1]
        context['exhibition_search_form'] = forms[2]

        return context


create_action_button_text = 'Create'
edit_action_button_text = 'Save Changes'


class genericCreateView(CreateView):
    template_name = 'catalogue/detail/detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['action_name'] = create_action_button_text
        return context


class genericUpdateView(UpdateView):
    template_name = 'catalogue/detail/detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['action_name'] = edit_action_button_text
        context['edit_mode'] = True
        return context


class HomeView(LoginRequiredMixin, ListView):
    template_name = 'home.html'
    model = Series


class ArtworkList(LoginRequiredMixin, SearchMixin, ListView):
    model = Artwork
    template_name = 'catalogue/overview/artwork.html'


class ArtworkCreate(LoginRequiredMixin, genericCreateView):
    model = Artwork
    form_class = ArtworkDetailForm
    template_name = 'catalogue/detail/artwork_detail.html'

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form
    
    def form_valid(self, form):
        self.object = form.save()

        artwork_image = form.cleaned_data['artwork_image']
        artwork_image.artwork = self.object
        artwork_image.save()

        return HttpResponseRedirect(self.get_success_url())


class ArtworkUpdate(LoginRequiredMixin, genericUpdateView):
    model = Artwork
    form_class = ArtworkDetailForm
    template_name = 'catalogue/detail/artwork_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['exhibitionForm'] = WorkInExhibitionForm()
        return context

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        # form.fields['image'].required = False
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form



def clone_artwork(request, artwork_pk):
    """creates a copy of an existing Artwork"""
    artwork = Artwork.objects.get(pk=artwork_pk)

    new_artwork_image = ArtworkImage()
    new_artwork_image.image = artwork.get_image
    
    artwork.title = "Copy of " + artwork.title
    artwork.pk = None
    artwork.save()

    new_artwork_image.artwork = artwork
    new_artwork_image.save()

    return redirect(artwork)

def artworkimage(request, pk):
    image = ArtworkImage.objects.get(pk=pk)

    return render(request, 'catalogue/utils/artworkimage.html', {'image' : image})
    
def artworkimage_upload(request):
    if request.method == 'POST':
        form = ArtworkImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            artworkimage = form.save()
            return JsonResponse({
                'image_id' : artworkimage.pk,
                'image_url': artworkimage.image.url,
            })
        else:
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['POST'])

class ArtworkDelete(LoginRequiredMixin, DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')


class SeriesList(LoginRequiredMixin, ListView):
    model = Series
    template_name = 'catalogue/overview/series.html'


class SeriesCreate(LoginRequiredMixin, genericCreateView):
    model = Series
    form_class = SeriesDetailForm
    template_name = 'catalogue/detail/series_detail.html'


class SeriesUpdate(LoginRequiredMixin, SearchMixin, genericUpdateView):
    model = Series
    form_class = SeriesDetailForm
    template_name = 'catalogue/detail/series_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(SeriesUpdate, self).get_context_data(series=self.get_object(), **kwargs)

        context['hasSeries'] = True
        return context


class SeriesDelete(LoginRequiredMixin, DeleteView):
    model = Series
    success_url = reverse_lazy('index')


class ExhibitionList(LoginRequiredMixin, ListView):
    model = Exhibition
    template_name = "catalogue/overview/exhibition.html"


class ExhibitionCreate(LoginRequiredMixin, genericCreateView):
    model = Exhibition
    form_class = ExhibitionDetailForm
    template_name = 'catalogue/detail/exhibition_detail.html'


class ExhibitionUpdate(LoginRequiredMixin, SearchMixin, genericUpdateView):
    model = Exhibition
    form_class = ExhibitionDetailForm
    template_name = 'catalogue/detail/exhibition_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(ExhibitionUpdate, self).get_context_data(exhibition=self.object, **kwargs)

        context['hasExhibition'] = True
        artworks = [s.artwork for s in self.object.workinexhibition_set.all()]
        return context


class ExhibitionDelete(LoginRequiredMixin, DeleteView):
    model = Exhibition
    success_url = reverse_lazy('index')


class LocationList(LoginRequiredMixin, ListView):
    model = Location
    template_name = "catalogue/overview/location.html"

    def get_context_data(self, **kwargs):
        context = super(LocationList, self).get_context_data(**kwargs)
        context['PermanentLocations'] = Location.objects.filter(category='P')
        context['GalleryLocations'] = Location.objects.filter(category='G')
        context['ClientLocations'] = Location.objects.filter(category='C')
        context['OtherLocations'] = Location.objects.all().exclude(category__in=['C', 'G', 'P'])

        return context


class LocationCreate(LoginRequiredMixin, genericCreateView):
    model = Location
    form_class = LocationDetailForm
    template_name = 'catalogue/detail/location_detail.html'


class LocationUpdate(LoginRequiredMixin, SearchMixin, genericUpdateView):
    model = Location
    form_class = LocationDetailForm
    template_name = 'catalogue/detail/location_detail.html'

    def get_context_data(self, **kwargs):

        # Call the base implementation first to get a context
        context = super(LocationUpdate, self).get_context_data(location=self.object, **kwargs)

        context['hasLocation'] = True
        return context


class LocationDelete(LoginRequiredMixin, DeleteView):
    model = Location
    success_url = reverse_lazy('index')

# API


def add_work_in_exhibition(request):
    # if this is a POST request we need to process the form data
    response = {'success': False, 'errors': set()}
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = WorkInExhibitionForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            form.save()
            response['success'] = True
        else:
            for field in form:
                for error in field.errors:
                    response['errors'].add(f"{field.label}: " + error)
                for error in form.non_field_errors():
                    response['errors'].add(error)
            # exhibition = request.POST.get('exhibition')
            # if not exhibition:
            #     response['errors'].append("Specifying an exhibition is required")

    response['errors'] = list(response['errors'])  # JsonResponse doesn't handle sets well
    return JsonResponse(response)


class ExhibitionsForArtwork(ListView):
    template_name = "catalogue/list_module/exhibition_list.html"

    def get_queryset(self):
        artwork = Artwork.objects.get(pk=self.kwargs.get('pk'))
        queryset = [s.exhibition for s in artwork.workinexhibition_set.all().order_by('-pk')]
        return queryset
