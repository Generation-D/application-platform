import argparse
from datetime import datetime

from backend.enums.question_type import QuestionType
from backend.logger import Logger
from loguru import logger
from backend.utils.consts import REGEX_JS, REGEX_TO_DESCRIPTION
from backend.utils.utils_datetime import convert_to_timezone
from backend.utils.utils_file import read_yaml_file
from backend.utils.utils_supabase import init_supabase
from backend.validate_config import (
    DEFAULT_PARAMS,
    MANDATORY_PARAMS,
    OPTIONAL_PARAMS,
    QUESTION_TYPES_DB_TABLE,
    run_structure_checks,
)
        


def add_test_user(supabase):
    users = [dict(mail="u@example.com", role=1), dict(mail="a@example.com", role=2)]
    password = "123456"
    
    for user in users:
        try:
            res_user = supabase.auth.sign_up({"email": user["mail"], "password": password})
            user_id = res_user.user.id
            supabase.table("application_table").insert({"userid": user_id}).execute()
            supabase.table("user_profiles_table").insert(
                {"userid": user_id, "userrole": user["role"], "isactive": True}
            ).execute()
        except Exception as e:
            logger.error(f"Error creating user {user['mail']}: {e}")

    print("Done")

def load_fixtures(config_file_path: str, env_file_path: str):
    supabase = init_supabase(env_file_path)

    add_test_user(supabase)



def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Script to setup the supabase database using the config file"
    )
    parser.add_argument(
        "--config",
        help="Path to the yaml config file",
        type=str,
        default="backend/apl_config_gend_all_phases.yml",
        dest="config_file_path",
        required=False,
    )
    parser.add_argument(
        "--env_file",
        help="Path to the .env file",
        type=str,
        default=None,
        dest="env_file_path",
        required=False,
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    load_fixtures(**vars(args))