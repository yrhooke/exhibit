from django.test import TestCase
from catalogue.models import Location
from django.utils import timezone


class LocationListViewGETTest(TestCase):

    def test_get_list(self):
        self.fail("test")

    def test_get_list_unauthorized(self):
        self.fail("test")


class LocationListViewPOSTTest(TestCase):
    def test_post_list_not_allowed(self):
        self.fail("test")


class LocationListViewPUTTest(TestCase):

    def test_put_list_not_allowed(self):
        self.fail("test")


class LocationListViewDELETETest(TestCase):

    def test_delete_list_not_allowed(self):
        self.fail("test")
