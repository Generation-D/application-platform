from datetime import datetime

import pytz
from dateutil.parser import isoparse
from dateutil.parser._parser import ParserError

from backend.utils.consts import DATETIME_FORMAT


def dt_is_iso8601(date_string):
    try:
        # Try to parse the string as an ISO 8601 date/datetime
        # This will raise a ValueError if the string is not in the correct format
        isoparse(date_string)
        return True
    except (ValueError, ParserError):
        return False


def convert_to_timezone(date: datetime):
    preferred_timezone = pytz.timezone('Europe/Berlin')
    utc_tz = pytz.timezone('UTC')
    preferred_datetime = preferred_timezone.localize(datetime(date.year, date.month, date.day, 0, 0, 0))
    utc_datetime = preferred_datetime.astimezone(utc_tz)
    return utc_datetime.strftime(DATETIME_FORMAT)
