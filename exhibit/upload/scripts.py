from bs4 import BeautifulSoup
import requests

from credentials import *


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
    # form = document.select('#object-details form')[0] 
    try:
        form = document.select(form_selector)[0]
        csrf_input = form.find(attrs={'name':'csrfmiddlewaretoken'})
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
    client : logged in requests.session
    """
    
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0'

    login_url = f'https://{domain}/accounts/login/'
    client = requests.Session()
    # initiate session
    c = client.get(login_url)
    login_form_csrf_middleware_token = find_csrf_token_in_html(c.text, 'form.login')

    # print(c.text)
    # print(f'csrf: {login_form_csrf_middleware_token}')
    login_headers = {
        'Host' : domain,
        'Origin': f'https://{domain}',
        'Referer': f'https://{domain}/users/~redirect/',
        'User-Agent': user_agent,
        'content-type': 'application/x-www-form-urlencoded',
    }

    login_form_data = {
        'csrfmiddlewaretoken': login_form_csrf_middleware_token,
        'login': username,
        'password': password,
        'next': '/',
    }
    # print('Cookies before request:')
    # print(client.cookies)
    # r = requests.post(login_url, data=login_form_data , headers=login_headers)
    test_url = 'http://httpbin.org/post'
    r = client.post(login_url, data=login_form_data , headers=login_headers, allow_redirects=False)
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
    return client




def extract_artwork_data_from_filename(filename):
    pass

def upload_artwork(domain_name, series, image_filename, sessionid):

    form_html = requests.get(f'{domain_name}/c/artwork/new').text
    csrf_token = find_csrf_token_in_html(form_html)
    artwork_data = extract_artwork_data_from_filename(image_filename)

    request_data = construct_request(artwork_data, filename, csrf_token, sessionid)
    try:
        response = requests.post(request_data)
        response.raise_for_status()
        print(f'{filename} uploaded successfully')
    except Exception as e:
        print(f'error on {filename}')
        print(e)



client = log_in(test_domain, username, password)
print(client.cookies)