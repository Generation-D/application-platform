import logging
from contextlib import nullcontext as does_not_raise

import pytest

from backend.logger import Logger


@pytest.mark.skip(reason="This test is temporarily disabled")
@pytest.mark.parametrize('message', ['TEST MESSAGE'])
def test_logger_api(message: str):
    logger = Logger('API')
    assert logger.info(message)
    logger.debug(message)


@pytest.mark.parametrize('message', ['TEST MESSAGE'])
def test_logger_debug(message: str):
    logging.basicConfig(level=logging.DEBUG)
    logger = Logger('DEBUG')
    with does_not_raise():
        logger.debug(message)
