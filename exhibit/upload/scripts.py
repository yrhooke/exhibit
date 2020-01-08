from bs4 import BeautifulSoup
import requests
import os

from credentials import *


def create_headers(domain, referer):

    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0'

    headers = {
        'Host': domain,
        'Origin': f'https://{domain}',
        'Referer': f'https://{domain}/users/~redirect/',
        'User-Agent': user_agent,
        'content-type': 'application/x-www-form-urlencoded',
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
    return session



def extract_artwork_data_from_filename(filename):
    return dict()


def construct_single_artwork_upload_data(series_id, filename, csrfmiddlewaretoken):

    filename_data = extract_artwork_data_from_filename(filename)

    form_data = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken,
        'series_id': series_id,
    }.update(filename_data)

    return form_data


def upload_single_artwork(session, domain_name, series_id, image_filename, image_file):

    artwork_create_url = f'https://{domain_name}/c/artwork/new/'
    form_html = session.get(artwork_create_url).text
    csrf_middleware_token = find_csrf_token_in_html(form_html, '.object-details form')

    form_data = construct_single_artwork_upload_data(series_id, image_filename, csrf_middleware_token)
    headers = create_headers(domain_name, artwork_create_url)

    try:
        response = session.post(artwork_create_url, data=form_data, headers=headers, files={'image': image_file})
        response.raise_for_status()
        print(f'{image_filename} uploaded successfully')
    except Exception as e:
        print(f'error on {image_filename}')
        try:
            return (session, response)
        except UnboundLocalError:
            return (session, None)
    return (session, response)


# session = requests.get(f'https://{test_domain}')
# print(session.text)
session = create_logged_in_session(test_domain, username, password)
print(session.cookies)

image_path = '/Users/yrhooke/Projects/exhibit/meta/1 תיקיות של ציורים/Figures small/022Figures_In_Every_Girl_2008._80x68in_203x173cmjpg.jpg'
image_file_name = os.path.split(image_path)[-1]

with open(image_path, 'rb') as image_file:
    session, response = upload_single_artwork(session, test_domain, 1, image_file_name, image_file)
    if response:
        print(response.status)
        print(response.text)
    else:
        print('no response')
        print(session)
