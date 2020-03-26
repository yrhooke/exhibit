from django import forms

class PlaceholderMixin(object):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        field_names = [field_name for field_name, _ in self.fields.items()]
        for field_name in field_names:
            field = self.fields.get(field_name)
            if field.help_text:
                field.widget.attrs.update({'placeholder': field.help_text})
            else:
                field.widget.attrs.update({'placeholder': field.label})
            field.placeholder = field.widget.attrs['placeholder']

