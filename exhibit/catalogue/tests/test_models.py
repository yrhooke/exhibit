from django.test import TestCase
from catalogue.models import Series
from django.utils import timezone
from catalogue.forms import SeriesDetailForm

class SeriesTest(TestCase):

    def create_series(self, name="series 1", description="some description"):
        return Series.objects.create(name=name, description=description)
    
    def test_series_creation(self):
        s = self.create_series()
        self.assertTrue(isinstance(s, Series))
        self.assertEqual(s.__str__(), s.name)