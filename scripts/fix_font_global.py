#!/usr/bin/env python3
"""
Remove inline fontFamily styles from TSX/JSX files.

Usage:
  python scripts/fix_font_global.py            # dry run
  python scripts/fix_font_global.py --apply   # apply changes
  python scripts/fix_font_global.py --root frontend/src
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys
from typing import Iterable, Tuple

FONT_FAMILY_PATTERN = re.compile(
    r"""
    (?:^|[\s,{])                 # leading boundary
    fontFamily\s*:\s*            # key
    (['\"]).*?\1                 # string value
    \s*,?                         # optional trailing comma
    """,
    re.VERBOSE,
)


def iter_files(root: pathlib.Path) -> Iterable[pathlib.Path]:
    for path in root.rglob("*"):
        if path.is_dir():
            continue
        if path.suffix not in {".tsx", ".jsx", ".ts", ".js"}:
            continue
        if "node_modules" in path.parts:
            continue
        yield path


def remove_font_family(content: str) -> Tuple[str, int]:
    count = 0

    def _repl(match: re.Match) -> str:
        nonlocal count
        count += 1
        # If there is leading boundary char, preserve it
        text = match.group(0)
        # Remove only the fontFamily fragment
        # Strip leading boundary if it is just whitespace or comma
        cleaned = re.sub(r"fontFamily\s*:\s*(['\"]).*?\1\s*,?", "", text)
        # Normalize leftover punctuation
        cleaned = cleaned.replace("{,", "{")
        cleaned = cleaned.replace(",}", "}")
        return cleaned

    new_content = FONT_FAMILY_PATTERN.sub(_repl, content)
    # Cleanup extra commas from object literals or style props
    new_content = re.sub(r",\s*([}\]])", r"\1", new_content)
    new_content = re.sub(r"([{\[])]\s*,", r"\1", new_content)
    return new_content, count


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write changes to files")
    parser.add_argument(
        "--root",
        default="frontend/src",
        help="Root directory to scan (default: frontend/src)",
    )
    args = parser.parse_args()

    root = pathlib.Path(args.root).resolve()
    if not root.exists():
        print(f"Root not found: {root}")
        return 1

    total_files = 0
    total_replacements = 0

    for path in iter_files(root):
        original = path.read_text(encoding="utf-8")
        updated, count = remove_font_family(original)
        if count == 0:
            continue
        total_files += 1
        total_replacements += count
        rel = path.relative_to(pathlib.Path.cwd())
        print(f"{rel}: remove {count} fontFamily" + (" (apply)" if args.apply else ""))
        if args.apply:
            path.write_text(updated, encoding="utf-8")

    print(f"\nFiles changed: {total_files}, replacements: {total_replacements}")
    if not args.apply and total_files > 0:
        print("Run with --apply to write changes.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
