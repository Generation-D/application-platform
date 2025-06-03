import pytest

from backend.utils.utils_regex import (
    email_regex_check,
    natural_number_check,
    phone_number_regex_check,
    rational_number_check,
)


@pytest.mark.parametrize(
    'string,expectation',
    [
        ('+49 123 4567890', True),
        ('+00 123 4567890', True),
        ('+131234567890', True),
        ('0131 2345678', True),
        ('I234 5678905', False),
        ('123412345678905123412341234', False),
        ('a+00 123 4567890', False),
    ],
)
def test_phone_number_regex_check(string: str, expectation: bool):
    assert phone_number_regex_check(string) == expectation


@pytest.mark.parametrize(
    'string,expectation',
    [
        ('Mustermann.Max@gmail.com', True),
        ('mustermann.max@gmail.com', True),
        ('mustermann-max@webgmx.com', True),
        ('mustermann-maxweb@gmx.com.', False),
        ('mustermann-maxwebgmx.com', False),
    ],
)
def test_email_regex_check(string: str, expectation: bool):
    assert email_regex_check(string) == expectation


@pytest.mark.parametrize(
    'string,expectation',
    [
        ('1234', True),
        ('00001234', False),
        ('-1234', False),
        ('0.01234', False),
    ],
)
def test_natural_number_check(string: str, expectation: bool):
    assert natural_number_check(string) == expectation


@pytest.mark.parametrize(
    'string,expectation',
    [
        ('1234', True),
        ('-001234', False),
        ('0.01234', True),
        ('-0.1234', True),
        ('-0.01234', True),
        ('0.0I234', False),
        ('01234a', False),
    ],
)
def test_rational_number_check(string: str, expectation: bool):
    assert rational_number_check(string) == expectation
