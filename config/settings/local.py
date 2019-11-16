from .base import *  # noqa
from .base import env

# read local env
env.read_env(str(ROOT_DIR.path(".envs/.local/.django")))
env.read_env(str(ROOT_DIR.path(".envs/.local/.postgres")))

## USE DIGITALOCEAN FOR STORAGE
# ------------------------------------------------------------------------------
# https://simpleisbetterthancomplex.com/tutorial/2017/08/01/how-to-setup-amazon-s3-in-a-django-project.html
AWS_ACCESS_KEY_ID = env('DJANGO_AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('DJANGO_AWS_SECRET_ACCESS_KEY')
# AWS_DEFAULT_ACL = None # to set privacy setting to default private
AWS_S3_REGION_NAME= env('DJANGO_AWS_S3_REGION_NAME')
AWS_S3_REGION_DOMAIN = f"{AWS_S3_REGION_NAME}.digitaloceanspaces.com"
AWS_S3_ENDPOINT_URL=f"https://{AWS_S3_REGION_DOMAIN}"
AWS_LOCATION = env('DJANGO_AWS_LOCATION')

# Media file management
DEFAULT_FILE_STORAGE = 'config.settings.storage_backends.S3MediaStorage'
AWS_MEDIA_BUCKET_NAME = env('DJANGO_AWS_MEDIA_BUCKET_NAME')
AWS_S3_MEDIA_CUSTOM_DOMAIN =f"{AWS_MEDIA_BUCKET_NAME}.{AWS_S3_REGION_DOMAIN}" 
# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="6rhxwnATsByK42PkEYFdNgdQvrPwJJIRt6hcGw7FvKzB3ieQlUTsW3LkaW28IYCI",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = "localhost"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = 1025

# django-debug-toolbar
# ------------------------------------------------------------------------------
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#prerequisites
# INSTALLED_APPS += ["debug_toolbar"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#middleware
# MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/configuration.html#debug-toolbar-config
DEBUG_TOOLBAR_CONFIG = {
    "DISABLE_PANELS": ["debug_toolbar.panels.redirects.RedirectsPanel"],
    "SHOW_TEMPLATE_CONTEXT": True,
}
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#internal-ips
INTERNAL_IPS = ["127.0.0.1", "10.0.2.2"]


# django-extensions
# ------------------------------------------------------------------------------
# https://django-extensions.readthedocs.io/en/latest/installation_instructions.html#configuration
INSTALLED_APPS += ["django_extensions"]  # noqa F405

# Your stuff...
# ------------------------------------------------------------------------------
