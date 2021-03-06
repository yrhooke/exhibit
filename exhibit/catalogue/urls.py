from django.urls import path
from . import views

app_name='catalogue'
urlpatterns = [
    path('artwork/', views.ArtworkList.as_view(), name="artwork_index"),
    path('artwork/new/', views.ArtworkCreate.as_view(), name='artwork_new'),
    path('artwork/clone/<int:artwork_pk>/', views.CloneArtwork.as_view(), name='artwork_clone'),
    path('artwork/<int:pk>/', views.ArtworkUpdate.as_view(), name='artwork_detail'),
    path('artwork/<int:pk>/delete/', views.ArtworkDelete.as_view(), name='artwork-delete'),
    path('artwork/image/new', views.ArtworkImageUpload.as_view(), name="artwork_image_upload"),
    # path('artwork/image/<int:pk>', views.artworkimage, name="artwork_image"),
    path('series/', views.SeriesList.as_view(), name="series_index"),
    path('series/new/', views.SeriesCreate.as_view(), name='series_new'),
    path('series/<int:pk>/', views.SeriesUpdate.as_view(), name='series_detail'),
    path('series/<int:pk>/delete/', views.SeriesDelete.as_view(), name='series-delete'),
    path('exhibition/', views.ExhibitionList.as_view(), name="exhibition_index"),
    path('exhibition/new/', views.ExhibitionCreate.as_view(), name='exhibition_new'),
    path('exhibition/<int:pk>/', views.ExhibitionUpdate.as_view(), name='exhibition_detail'),
    path('exhibition/<int:pk>/delete/', views.ExhibitionDelete.as_view(), name='exhibition-delete'),
    path('location/', views.LocationList.as_view(), name="location_index"),
    path('location/new/', views.LocationCreate.as_view(), name='location_new'),
    path('location/<int:pk>/', views.LocationUpdate.as_view(), name='location_detail'),
    path('location/<int:pk>/delete/', views.LocationDelete.as_view(), name='location-delete'),
    # path('ajax_calls/search/', views.autocompleteView),
    path('api/addworkinexhibition', views.add_work_in_exhibition, name='add_workinexhibition'),
    path('api/exhibitionsforartwork/<int:pk>', views.ExhibitionsForArtwork.as_view(), name='exhibitions_for_artwork'),
    path('saledata', views.saledata_test_view, name="saleData_test"),
    path('api/saledata', views.SaleDataUpdate.as_view(), name="saleData_update"),
    path('api/imageuploadauth', views.S3AuthAPIView.as_view(), name='image_upload_auth'),
]
