#!/usr/bin/env python3
"""
Download GameDB item icons referenced in src/data/upgrades.js
into public/gamedb/icons/.

Usage:
    python scripts/download_gamedb_images.py

Safe to run multiple times — skips files that already exist and are valid.
"""

import re
import sys
import time
import urllib.request
from pathlib import Path

UPGRADES_JS = Path(__file__).parent.parent / "src" / "data" / "upgrades.js"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "gamedb" / "icons"
GAMEDB_BASE_URL = "https://mistfallhunter.gamedb.wiki/icons"
USER_AGENT = "Mozilla/5.0 (compatible; MysticFalls-asset-downloader/1.0)"
MIN_VALID_SIZE = 100  # bytes — anything smaller is probably an error page


def extract_urls(js_path: Path) -> list[tuple[str, str, str]]:
    """Return list of (item_name, filename, download_url) from GAMEDB_IMAGES.

    Supports both local paths (/gamedb/icons/ID.webp) and external URLs.
    """
    text = js_path.read_text(encoding="utf-8")
    results = []

    # Match local paths: "Item Name": "/gamedb/icons/ID.webp"
    local_pattern = re.compile(r'"([^"]+)"\s*:\s*"/gamedb/icons/([^"]+\.webp)"')
    for item_name, filename in local_pattern.findall(text):
        url = f"{GAMEDB_BASE_URL}/{filename}"
        results.append((item_name, filename, url))

    # Match external URLs (fallback for files not yet migrated)
    ext_pattern = re.compile(
        r'"([^"]+)"\s*:\s*"(https://mistfallhunter\.gamedb\.wiki/icons/([^"]+\.webp))"'
    )
    local_items = {name for name, _, _ in results}
    for item_name, _full_url, filename in ext_pattern.findall(text):
        if item_name not in local_items:
            url = f"{GAMEDB_BASE_URL}/{filename}"
            results.append((item_name, filename, url))

    return results


def is_valid_file(path: Path) -> bool:
    return path.exists() and path.stat().st_size >= MIN_VALID_SIZE


def download(url: str, dest: Path) -> str:
    """Download url to dest. Returns 'ok', 'skipped', or error message."""
    if is_valid_file(dest):
        return "skipped"

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status != 200:
                return f"HTTP {resp.status}"
            data = resp.read()
    except Exception as e:
        return str(e)

    if len(data) < MIN_VALID_SIZE:
        return f"response too small ({len(data)} bytes)"

    dest.write_bytes(data)
    return "ok"


def main():
    if not UPGRADES_JS.exists():
        print(f"ERROR: {UPGRADES_JS} not found", file=sys.stderr)
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    entries = extract_urls(UPGRADES_JS)
    total = len(entries)

    if total == 0:
        print("ERROR: no GAMEDB_IMAGES entries found in upgrades.js", file=sys.stderr)
        sys.exit(1)

    print(f"Encontradas: {total}")
    print("-" * 50)

    downloaded = 0
    skipped = 0
    failures: list[tuple[str, str]] = []

    for item_name, filename, url in entries:
        dest = OUTPUT_DIR / filename

        result = download(url, dest)

        if result == "ok":
            downloaded += 1
            print(f"  [OK]  {filename}  ({item_name})")
        elif result == "skipped":
            skipped += 1
            print(f"  [--]  {filename}  ({item_name})  [ja existe]")
        else:
            failures.append((filename, result))
            print(f"  [!!]  {filename}  ({item_name})  FALHA: {result}", file=sys.stderr)

        # Small delay to be polite to the server
        if result == "ok":
            time.sleep(0.1)

    print("-" * 50)
    print(f"Baixadas:     {downloaded}")
    print(f"Já existentes:{skipped}")
    print(f"Falhas:       {len(failures)}")

    if failures:
        print("\nItens com falha:")
        for fname, reason in failures:
            print(f"  {fname}: {reason}")
        sys.exit(1)


if __name__ == "__main__":
    main()
