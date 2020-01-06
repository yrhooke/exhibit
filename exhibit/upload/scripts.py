from bs4 import BeautifulSoup
import requests

def log_in(domain):
    login_url = f'{domain}/accounts/login'
    client = requests.session()
    # initiate session
    c = client.get(login_url)
    login_form_csrf_middleware_token = find_csrf_token_in_html(c.text, 'form.login')




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
    soup = BeautifulSoup(html_string, 'html.parser') 
    # form = document.select('#object-details form')[0] 
    form = document.select(form_selector)[0]
    csrf_input = form.find(attrs={'name'='csrfmiddlewaretoken'})
    return csrf_input.attrs.get('value')

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

