#!/usr/bin/env python3
import json
import sys

def main():
    if len(sys.argv) != 2:
        print("Usage: notion_fetch_plan.py <notion-page-url>", file=sys.stderr)
        return 1

    url = sys.argv[1].strip()
    if not url:
        print("Error: Notion page URL is required.", file=sys.stderr)
        return 1

    payload = {
        "tool": "notion-fetch",
        "url": url,
    }
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
