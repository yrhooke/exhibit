
from django.urls import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect


from catalogue.models import   Exhibition
from catalogue.forms import  ExhibitionDetailForm
from catalogue.views.utils import SearchMixin, genericCreateView, genericUpdateView

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


