from django.test import TestCase
from catalogue.models import ArtworkImage
from django.utils import timezone


class ImageViewGETTest(TestCase):

    def create_image(self, name="image 1", description="some description"):
        return ArtworkImage.objects.create(name=name, description=description)

    def test_get_image(self):
        self.fail("test")

    def test_get_image_invalid_pk(self):
        self.fail("test")

    def test_get_image_unauthorized(self):
        self.fail("test")


class ImageViewPOSTTest(TestCase):

    def test_post_image_saved(self):
        self.fail("test")

    def test_post_image_with_pk(self):
        self.fail("test")

    def test_post_image_missing_url(self):
        self.fail("test")

    def test_post_image_unauthorized(self):
        self.fail("test")


class ImageViewPUTTest(TestCase):

    def test_put_image_not_allowed(self):
        self.fail("test")


class ImageViewDELETETest(TestCase):

    def test_delete_image_saved(self):
        self.fail("test")

    def test_delete_image_invalid_pk(self):
        self.fail("test")

    def test_delete_image_unauthorized(self):
        self.fail("test")
