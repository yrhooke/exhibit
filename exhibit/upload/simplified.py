I have a django site for cataloguing images. I'm using a standard CreateView for the creation page. I'm trying to automate image upload by using requests to POST to the create url. 

I can upload images from my browser, so I'm assuming the problem is with my script. I know I'm missing something, because I'm not managing to upload through Postman either. 

When I submit the request I get a status code 200 and the creation page reloads (on success it should redirect to the object page).

I'm using a signed in requests.Session, I'm getting the form's csrf token beforehand.

Here's the relevant part of my code:

 

def upload_single_artwork(session, create_url, artwork, image_file):
    """Upload a single artwork

    Parameters
    ----------
    session: requests.Session
        signed in session
    create_url: string
        get/post url for artwork creation
    artwork: ArtworkData
        artwork metadata object
    image_file: file
        open file object for image

    Returns
    -------
    (session, response) - Session object and Response object or None
    """

    form_received_from_GET = session.get(artwork_create_url).text
    csrf_middleware_token = find_csrf_token_in_html(form_received_from_GET)

    request_data = {
        'title': artwork.Title,
        'year': str(artwork.Year),
        'csrfmiddlewaretoken': csrf_middleware_token,

    }
    file_data = construct_single_image_upload_data( artwork['Image file name'], image_file)
    headers = create_headers(create_url, create_url)
    try:
        response = session.post(artwork_create_url, data=request_data, headers=headers, files=file_data)
        response.raise_for_status()
    except Exception as e:
        print(e)
        try:
            return (session, response)
        except UnboundLocalError:
            return (session, None)
    return (session, response)

def construct_single_image_upload_data(image_file_name, image_file_obj):
    return {
        'image': (image_file_name, image_file_obj, 'img/png')
    }

def create_headers(url, referer):

    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0'

    domain = get_domain(url)
    headers = {
        'Host': domain,
        'Origin': f'https://{domain}',
        'Referer': referer,
        'User-Agent': user_agent,
    }

    return headers

if __name__ == "__main__":
    
    image_path = test_image_path
    artwork_table_path = test_artwork_table_path
    artwork_index = test_artwork_index

    artwork = load_artwork_from_file(artwork_table_path, artwork_index)

    session = create_logged_in_session(test_domain, username, password)

    with open(image_path, 'rb') as image_file:
        session, response = upload_single_artwork(session, test_artwork_upload_url, artwork, image_file)