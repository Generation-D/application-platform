from typing import Optional
import os

import storage3
from supabase import create_client
from gotrue import SyncMemoryStorage
from supabase.lib.client_options import ClientOptions


def init_supabase(schema: Optional[str] = None):
    # use SUPABASE_SERVICE_KEY to ignore Row Level Security
    # export SUPABASE_SERVICE_KEY="
    # export SUPABASE_URL="
    options = ClientOptions().replace(schema=schema) if schema else ClientOptions(storage=SyncMemoryStorage())
    return create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY'), options=options)


def init_supabase_bucket_client() -> storage3.SyncStorageClient:
    # use SUPABASE_SERVICE_KEY to ignore Row Level Security
    # export SUPABASE_SERVICE_KEY="
    # export SUPABASE_URL="
    url = os.getenv('SUPABASE_URL') + '/storage/v1'
    headers = {
        "apiKey": os.getenv('SUPABASE_SERVICE_KEY'),
        "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}"
    }
    storage_client = storage3.create_client(url, headers, is_async=False)
    return storage_client


def init_supabase_with_rls():
    # use SUPABASE_ANON_KEY to accept Row Level Security
    return create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_ANON_KEY'))
