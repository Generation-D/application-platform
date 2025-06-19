import re

from backend.utils.consts import REGEX_PY


def phone_number_regex_check(string: str) -> bool:
    """
    Simple phone number regex check.
    See: https://uibakery.io/regex-library/phone-number-python
    """
    return bool(re.match(REGEX_PY['PHONE_NUMBER'], string))


def email_regex_check(string: str) -> bool:
    """
    Simple email regex check.
    See: https://uibakery.io/regex-library/email-regex-python
    """
    return bool(re.match(REGEX_PY['EMAIL'], string))


def natural_number_check(string: str) -> bool:
    """
    Simple check if string contains a natural number (>=0). Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isdigit() instead.
    """
    return bool(re.match(REGEX_PY['NATURAL_NUMBER'], string))


def rational_number_check(string: str) -> bool:
    """
    Simple check if string contains a rational number. Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isnumeric() instead.
    """
    return bool(re.match(REGEX_PY['RATIONAL_NUMBER'], string))


def url_phase_segment_check(string: str) -> bool:
    """
    Simple check if string contains a valid phase segment for the URL.
    """
    return bool(re.match(REGEX_PY['URL_SEGMENT'], string))
