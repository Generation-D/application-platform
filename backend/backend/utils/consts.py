DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S'
REGEX_PY = {
    'PHONE_NUMBER': r'^\+?\d{1,4}([-.\/\s]?\d{1,3})?([-.\s]?\d{1,4})?([-.\s]?\d{1,4})?([-.\s]?\d{1,9})?$$',
    'URL_SEGMENT': r'^(_|-|[a-z]|[A-Z]|[0-9])+$',
    'EMAIL': r"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@"
    + r'(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$',
    'TEXT': r'^[a-zA-Z0-9_ ]*$',
    'NATURAL_NUMBER': r'^[1-9]\d+$',
    'RATIONAL_NUMBER': r'^(-?)(0|[1-9]\d*)([.](\d*)[1-9])?$',
}

REGEX_JS = {
    'PHONE_NUMBER': '^\+?\d{1,4}([-.\/\s]?\d{1,3})?([-.\s]?\d{1,4})?([-.\s]?\d{1,4})?([-.\s]?\d{1,9})?$',
    'URL_SEGMENT': '^(_|-|[a-zA-Z0-9])+$',
    'EMAIL': "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$",
    'TEXT': '^[a-zA-Z0-9_ ]*$',
    'NATURAL_NUMBER': '^[1-9]\d+$',
    'RATIONAL_NUMBER': '^(-?)(0|[1-9]\d*)(\.\d*[1-9])?$',
}

REGEX_TO_DESCRIPTION = {
    'PHONE_NUMBER': 'Telefonnummer',
    'URL_SEGMENT': 'URL Segment',
    'EMAIL': 'Email',
    'TEXT': 'Text',
    'NATURAL_NUMBER': 'Natürliche Zahl',
    'RATIONAL_NUMBER': 'Rationale Zahl',
}
