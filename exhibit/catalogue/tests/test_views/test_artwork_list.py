from django.test import TestCase
from catalogue.models import Artwork
from django.utils import timezone


class ArtworkListViewGETTest(TestCase):

    def test_get_list(self):
        self.fail("test")

    def test_get_list_with_fiter(self):
        self.fail("test")

    def test_get_list_for_series(self):
        self.fail("test")

    def test_get_list_for_series_with_filter(self):
        self.fail("test")

    def test_get_list_for_location(self):
        self.fail("test")

    def test_get_list_for_location_with_filter(self):
        self.fail("test")

    def test_get_list_for_exhibition(self):
        self.fail("test")

    def test_get_list_for_exhibition_with_filter(self):
        self.fail("test")

    def test_get_list_unauthorized(self):
        self.fail("test")


class ArtworkListViewPOSTTest(TestCase):
    def test_post_list_not_allowed(self):
        self.fail("test")


class ArtworkListViewPUTTest(TestCase):

    def test_put_list_not_allowed(self):
        self.fail("test")


class ArtworkListViewDELETETest(TestCase):

    def test_delete_list_not_allowed(self):
        self.fail("test")
