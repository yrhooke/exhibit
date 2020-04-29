from django.test import TestCase
from catalogue.models import Artwork
from django.utils import timezone
from catalogue.forms import ArtworkDetailForm


class ArtworkViewGETTest(TestCase):

    def create_artwork(self, name="artwork 1", description="some description"):
        return Artwork.objects.create(name=name, description=description)

    def test_get_artwork(self):
        self.fail("test")

    def test_get_artwork_invalid_pk(self):
        self.fail("test")

    def test_get_artwork_unauthorized(self):
        self.fail("test")


class ArtworkViewPOSTTest(TestCase):

    def test_post_artwork_saved(self):
        self.fail("test")

    def test_post_artwork_with_pk(self):
        self.fail("test")

    def test_post_artwork_missing_title(self):
        self.fail("test")

    def test_post_artwork_missing_series(self):
        self.fail("test")

    def test_post_artwork_invalid_series(self):
        self.fail("test")

    def test_post_artwork_missing_year(self):
        self.fail("test")

    def test_post_artwork_invalid_year(self):
        self.fail("test")

    def test_post_artwork_missing_width_cm(self):
        self.fail("test")

    def test_post_artwork_invalid_width_cm(self):
        self.fail("test")

    def test_post_artwork_missing_height_cm(self):
        self.fail("test")

    def test_post_artwork_invalid_height_cm(self):
        self.fail("test")

    def test_post_artwork_missing_depth_cm(self):
        self.fail("test")

    def test_post_artwork_invalid_depth_cm(self):
        self.fail("test")

    def test_post_artwork_missing_width_in(self):
        self.fail("test")

    def test_post_artwork_invalid_width_in(self):
        self.fail("test")

    def test_post_artwork_missing_height_in(self):
        self.fail("test")

    def test_post_artwork_missing_depth_in(self):
        self.fail("test")

    def test_post_artwork_missing_size(self):
        self.fail("test")

    def test_post_artwork_invalid_size(self):
        self.fail("test")

    def test_post_artwork_missing_medium(self):
        self.fail("test")

    def test_post_artwork_missing_rolled(self):
        self.fail("test")

    def test_post_artwork_invalid_rolled(self):
        self.fail("test")

    def test_post_artwork_missing_framed(self):
        self.fail("test")

    def test_post_artwork_missing_status(self):
        self.fail("test")

    def test_post_artwork_invalid_status(self):
        self.fail("test")

    def test_post_artwork_missing_additional(self):
        self.fail("test")

    def test_post_artwork_missing_price_nis(self):
        self.fail("test")

    def test_post_artwork_invalid_price_nis(self):
        self.fail("test")

    def test_post_artwork_missing_price_usd(self):
        self.fail("test")

    def test_post_artwork_invalid_price_usd(self):
        self.fail("test")

    def test_post_artwork_unauthorized(self):
        self.fail("test")


class ArtworkViewPUTTest(TestCase):

    def test_put_artwork_saved(self):
        self.fail("test")

    def test_put_artwork_with_pk(self):
        self.fail("test")

    def test_put_artwork_missing_title(self):
        self.fail("test")

    def test_put_artwork_missing_series(self):
        self.fail("test")

    def test_put_artwork_invalid_series(self):
        self.fail("test")

    def test_put_artwork_missing_year(self):
        self.fail("test")

    def test_put_artwork_invalid_year(self):
        self.fail("test")

    def test_put_artwork_missing_width_cm(self):
        self.fail("test")

    def test_put_artwork_invalid_width_cm(self):
        self.fail("test")

    def test_put_artwork_missing_height_cm(self):
        self.fail("test")

    def test_put_artwork_invalid_height_cm(self):
        self.fail("test")

    def test_put_artwork_missing_depth_cm(self):
        self.fail("test")

    def test_put_artwork_invalid_depth_cm(self):
        self.fail("test")

    def test_put_artwork_missing_width_in(self):
        self.fail("test")

    def test_put_artwork_invalid_width_in(self):
        self.fail("test")

    def test_put_artwork_missing_height_in(self):
        self.fail("test")

    def test_put_artwork_missing_depth_in(self):
        self.fail("test")

    def test_put_artwork_missing_size(self):
        self.fail("test")

    def test_put_artwork_invalid_size(self):
        self.fail("test")

    def test_put_artwork_missing_medium(self):
        self.fail("test")

    def test_put_artwork_missing_rolled(self):
        self.fail("test")

    def test_put_artwork_invalid_rolled(self):
        self.fail("test")

    def test_put_artwork_missing_framed(self):
        self.fail("test")

    def test_put_artwork_missing_status(self):
        self.fail("test")

    def test_put_artwork_invalid_status(self):
        self.fail("test")

    def test_put_artwork_missing_additional(self):
        self.fail("test")

    def test_put_artwork_missing_price_nis(self):
        self.fail("test")

    def test_put_artwork_invalid_price_nis(self):
        self.fail("test")

    def test_put_artwork_missing_price_usd(self):
        self.fail("test")

    def test_put_artwork_invalid_price_usd(self):
        self.fail("test")

    def test_put_artwork_unauthorized(self):
        self.fail("test")


class ArtworkViewDELETETest(TestCase):

    def test_delete_artwork_saved(self):
        self.fail("test")

    def test_delete_artwork_invalid_pk(self):
        self.fail("test")

    def test_delete_artwork_unauthorized(self):
        self.fail("test")
