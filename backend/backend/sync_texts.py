import argparse
import os
from pathlib import Path
from backend.utils.utils_supabase import init_supabase
import markdown
from loguru import logger

log = logger

def get_all_markdown_files(dir_path: Path, base: Path = Path()) -> list[str]:
    files = []
    for entry in dir_path.iterdir():
        rel_path = base / entry.name
        if entry.is_dir():
            files.extend(get_all_markdown_files(entry, rel_path))
        elif entry.is_file() and entry.suffix == '.md':
            files.append(str(rel_path))
    return files

def markdown_to_html(md_text: str) -> str:
    return markdown.markdown(md_text)

def sync_texts(env_file_path: str, markdown_files_path: str):
    BASE_DIR = Path(markdown_files_path)
    markdown_files = get_all_markdown_files(BASE_DIR)

    if not markdown_files:
        log.info(f"⚠️  No Markdown files found in {BASE_DIR}. Nothing to upload.")
        return

    supabase = init_supabase(env_file_path)

    supabase.table('phase_texts').delete().neq('id', 0).execute()

    for rel_path in markdown_files:
        full_path = BASE_DIR / rel_path
        with open(full_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        html_content = markdown_to_html(md_content)

        try:
            response = supabase.table('phase_texts').upsert({
                'path': rel_path,
                'html_content': html_content
            }).execute()
            log.info(f"✅ Uploaded {rel_path} ({len(response.data) if response.data else 0} row(s))")
        except Exception as e:
            log.error(f"❌ Failed to upload {rel_path}: {e}")

    log.info("✅ All markdown files uploaded to Supabase")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Script to sync phase texts to the supabase database')

    parser.add_argument(
        '--env_file',
        help='Path to the .env file',
        type=str,
        default=None,
        dest='env_file_path',
        required=True,
    )

    parser.add_argument(
        '--md_path',
        help='Path to the markdown folder',
        type=str,
        default=None,
        dest='markdown_files_path',
        required=True,
    )
    return parser.parse_args() 

if __name__ == "__main__":
    args = parse_args()
    sync_texts(**vars(args))
