#!/usr/bin/env python3
"""Remove all .keep files from the repository.

Usage:
  python scripts/remove_keep_files.py            # dry run
  python scripts/remove_keep_files.py --apply   # delete files
"""
from __future__ import annotations

import argparse
import pathlib
import sys


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Delete .keep files")
    parser.add_argument("--root", default=".", help="Root directory to scan")
    args = parser.parse_args()

    root = pathlib.Path(args.root).resolve()
    if not root.exists():
        print(f"Root not found: {root}")
        return 1

    keep_files = list(root.rglob(".keep"))
    if not keep_files:
        print("No .keep files found.")
        return 0

    for path in keep_files:
        rel = path.relative_to(root)
        if args.apply:
            path.unlink(missing_ok=True)
            print(f"Deleted: {rel}")
        else:
            print(f"Found: {rel}")

    print(f"\nTotal .keep files: {len(keep_files)}")
    if not args.apply:
        print("Run with --apply to delete files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
