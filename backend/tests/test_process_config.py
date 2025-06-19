import pytest

from backend.process_config import process_config


@pytest.mark.parametrize('config_file,expectation', [('backend/tests/assets/apl_config.yml', True)])
@pytest.mark.skip(reason='This test is temporarily disabled')
def test_process_config(config_file: str, expectation: bool):
    assert process_config(config_file) == expectation
