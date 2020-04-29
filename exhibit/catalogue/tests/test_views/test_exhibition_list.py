from django.test import TestCase
from catalogue.models import Exhibition
from django.utils import timezone


class ExhibitionListViewGETTest(TestCase):

    def test_get_list(self):
        self.fail("test")

    def test_get_list_unauthorized(self):
        self.fail("test")


class ExhibitionListViewPOSTTest(TestCase):
    def test_post_list_not_allowed(self):
        self.fail("test")


class ExhibitionListViewPUTTest(TestCase):

    def test_put_list_not_allowed(self):
        self.fail("test")


class ExhibitionListViewDELETETest(TestCase):

    def test_delete_list_not_allowed(self):
        self.fail("test")
