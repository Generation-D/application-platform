import os
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client


def load_env_vars(env_path: Optional[str] = None) -> None:
    load_dotenv(dotenv_path=env_path)


def init_supabase(env_path: Optional[str] = None):
    load_env_vars(env_path)
    # Check for the new format first, then fall back to the old format
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL') or os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_SERVICE_KEY')
    return create_client(url, key)


def init_supabase_with_rls(env_path: Optional[str] = None):
    load_env_vars(env_path)
    # Check for the new format first, then fall back to the old format
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL') or os.getenv('SUPABASE_URL')
    key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY') or os.getenv('SUPABASE_ANON_KEY')
    return create_client(url, key)
