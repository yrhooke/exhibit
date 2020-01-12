from bs4 import BeautifulSoup
import requests
from requests_toolbelt.multipart import encoder
import pandas as pd
import os

from credentials import *


def create_headers(domain, referer):

    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0'

    headers = {
        'Host': domain,
        'Origin': f'https://{domain}',
        'Referer': referer,
        'User-Agent': user_agent,
        # 'content-type': 'application/x-www-form-urlencoded',
    }

    return headers


def find_csrf_token_in_html(html, form_selector):
    """returns first csrf token found in html

    Parameters
    ----------
    html: string 
        containing html to parse
    form_wrapper: css
        selector uniquely identifying the relevant form

    Returns
    -------
    csrf token or none
    """
    document = BeautifulSoup(html, 'html.parser')
    try:
        form = document.select(form_selector)[0]
        csrf_input = form.find(attrs={'name': 'csrfmiddlewaretoken'})
    except Exception:
        return document
    return csrf_input.attrs.get('value')


def create_logged_in_session(domain, username, password):
    """Log in to website

    Parameters
    ----------
    domain: string
        domain of Exhibit website
    username: string
        username for login
    password: string
        password for login

    Returns
    -------
    session : logged in requests.session
    """

    login_url = f'https://{domain}/accounts/login/'
    session = requests.Session()
    # initiate session
    c = session.get(login_url)
    login_form_csrf_middleware_token = find_csrf_token_in_html(c.text, 'form.login')

    # print(c.text)
    # print(f'csrf: {login_form_csrf_middleware_token}')
    login_headers = create_headers(domain, f'https://{domain}/users/~redirect/')
    login_headers['content-type']='application/x-www-form-urlencoded'

    login_form_data = {
        'csrfmiddlewaretoken': login_form_csrf_middleware_token,
        'login': username,
        'password': password,
        'next': '/',
    }
    # print('Cookies before request:')
    # print(session.cookies)
    # r = requests.post(login_url, data=login_form_data , headers=login_headers)
    # test_url = 'http://httpbin.org/post'
    r = session.post(login_url, data=login_form_data, headers=login_headers, allow_redirects=False)
    # print('request headers:')
    # print(r.request.headers)
    # print('request cookies:')
    # print(r.request._cookies)
    # print('request body:')
    # print(r.request.body)
    # print('request json:')
    # # print(r.request.json)
    # print('response cookies:')
    # print(r.cookies)
    # print('response headers:')
    # print(r.headers)
    # print(r.status_code, r.request.method)
    # print('response content:')
    # print(r.content)

    r.raise_for_status()
    if session.cookies.get('sessionid'):
        print('Login: Success!')
    else:
        raise RuntimeError("can't log in")
    return session


def load_artwork_from_file(filename, row):

    df = pd.read_csv(filename)

    return df.loc[row]



# class ArtworkDetailForm(PlaceholderMixin, forms.ModelForm):
#     class Meta():
#         model = Artwork
#         fields = [
#             'image',
#             'title',
#             'year',
#             'series',
#             'location',
#             'status',
#             'size',
#             'width_cm',
#             'height_cm',
#             'depth_cm',
#             'width_in',
#             'height_in',
#             'depth_in',
#             'rolled',
#             'framed',
#             'medium',
#             'additional',
#             'owner',
#             'sold_by',
#             'price_nis',
#             'price_usd',
#             'sale_currency',
#             'sale_price',
#             'discount',
#             'sale_date',
#         ]
#         widgets = {
#             'image': forms.FileInput,
#             'sale_date': DatePicker,
#             'width_cm': forms.TextInput,
#             'height_cm': forms.TextInput,
#             'depth_cm': forms.TextInput,
#             'width_in': forms.TextInput,
#             'height_in': forms.TextInput,
#             'depth_in': forms.TextInput,
#         }


# artwork_data = {
#     'tit'
# }


# def extract_artwork_data_from_filename(filename):
#     artwork_data = {
#         'title',
#         'year',
#         'series',
#         'location',
#         'status',
#         'size',
#         'width_cm',
#         'height_cm',
#         'depth_cm',
#         'width_in',
#         'height_in',
#         'depth_in',
#         'rolled',
#         'framed',
#         'medium',
#         'additional',
#         'owner',
#         'sold_by',
#         'price_nis',
#         'price_usd',
#         'sale_currency',
#         'sale_price',
#         'discount',
#         'sale_date',
#     }
#     return dict()

# mandatory
# {
#     'title': ,
#     'year': ,
#     'series': ,
#     'location': ,
#     'status': ,
#     'size': ,
#     'width_cm: ,
#     'height_cm': ,
#     'width_in': ,
#     'height_in': ,
#     'additional',
# }


def construct_request_data_from_artwork(artwork, series, location, artwork_status):
    """construct data field for request from artwork

    Parameters
    ----------
        artwork: pandas.Series
        series: string
        location: string

    Returns
    -------
        dict
    """
    size_fields = {
        'Width cm': 'width_cm',
        'Height cm': 'height_cm',
        'Width inch': 'width_in',
        'Height inch': 'height_in',

    }

    data_fields = {
        'title': artwork.Title,
        'year': artwork.Year,
        'series': series,
        'location': location,
        'size': artwork['Size category'],
        'status': artwork_status,
    }

    for field in size_fields.keys():
        if artwork[field]:
            data_fields[size_fields[field]] = artwork[field]
    
    return data_fields


def construct_single_artwork_upload_data(artwork, series, csrfmiddlewaretoken):

    location_id = '1'
    series_id = '1'
    artwork_status = 'D'
    filename_data = construct_request_data_from_artwork(artwork, series_id, location_id, artwork_status)

    form_data = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken,
    }
    form_data.update(filename_data)

    return form_data

def construct_single_image_upload_data(image_file_name, image_file_obj):
    return {
        'image': (image_file_name, 'image/png', image_file_obj, 'image/)
    }

def upload_single_artwork(session, domain_name, series_id, artwork, image_file):

    artwork_create_url = f'https://{domain_name}/c/artwork/new/'
    form_received_from_GET = session.get(artwork_create_url).text
    csrf_middleware_token = find_csrf_token_in_html(form_received_from_GET, '#object-details form')

    request_data = construct_single_artwork_upload_data(artwork, series_id, csrf_middleware_token)
    file_data = construct_single_image_upload_data( artwork['Image file name'], image_file)
    headers = create_headers(domain_name, artwork_create_url)

    multipart_encoder = encoder.MultipartEncoder(fields=request_data.update(file_data))
    try:
        httpbin = "http://httpbin.org/post"
        response = session.post(httpbin, data=request_data, headers=headers, files=file_data)
        response.raise_for_status()
    except Exception as e:
        try:
            return (session, response)
        except UnboundLocalError:
            return (session, None)
    return (session, response)



# session = requests.get(f'https://{test_domain}')
# print(session.text)

if __name__ == "__main__":
    
    image_path = test_image_path
    artwork_table_path = test_artwork_table_path
    artwork_index = test_artwork_index

    artwork = load_artwork_from_file(artwork_table_path, artwork_index)
    # print(artwork)
    # print(construct_request_data_from_artwork(artwork, 1, 1))

    session = create_logged_in_session(test_domain, username, password)

    with open(image_path, 'rb') as image_file:
        session, response = upload_single_artwork(session, test_domain, 1, artwork, image_file)

    if response:
        print(response.status_code)
        with open('output2.html', 'w') as f:
            f.write(response.text)
    else:
        print('no response')
        print(session)
