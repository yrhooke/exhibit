from django.test import TestCase
from catalogue.models import Series
from django.utils import timezone


class SeriesListViewGETTest(TestCase):

    def test_get_list_not_allowed(self):
        self.fail("test")


class SeriesListViewPOSTTest(TestCase):

    def test_reorder_happy_flow(self):
        self.fail("test")

class SeriesListViewPUTTest(TestCase):

    def test_put_list_not_allowed(self):
        self.fail("test")


class SeriesListViewDELETETest(TestCase):

    def test_delete_list_not_allowed(self):
        self.fail("test")
