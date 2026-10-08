#!/usr/bin/env python3
"""Refresh GitHub star counts in content/projects/_index.md.

Only the Stack column's star segment is touched. Descriptions and every
other cell are hand-written positioning and are reassembled verbatim.
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

PAGE = Path(__file__).resolve().parent.parent / "content" / "projects" / "_index.md"
REPO_LINK = re.compile(r"github\.com/([\w.-]+)/([\w.-]+?)(?:[)/]|$)")
STAR_SEGMENT = re.compile(r"\s*·?\s*⭐\s*\d+")


def fetch_stars(repo):
    """Return the stargazer count for 'owner/name'."""
    request = urllib.request.Request(
        f"https://api.github.com/repos/{repo}",
        headers={"Accept": "application/vnd.github+json"},
    )
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)["stargazers_count"]
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"{repo}: GitHub returned {error.code}") from error


def split_row(line):
    """Split a markdown table row into its cells, or return None."""
    stripped = line.strip()
    if not stripped.startswith("|") or not stripped.endswith("|"):
        return None
    return stripped[1:-1].split("|")


def render_stack(cell, stars):
    """Put the star count into a Stack cell, dropping it at zero stars."""
    base = STAR_SEGMENT.sub("", cell).strip()
    if stars < 1:
        return f" {base} " if base else " — "
    if not base or base == "—":
        return f" ⭐ {stars} "
    return f" {base} · ⭐ {stars} "


def refresh(text, stars_for):
    """Rewrite star counts in table rows that have a Stack column."""
    lines = text.split("\n")
    stack_column = None
    for index, line in enumerate(lines):
        cells = split_row(line)
        if cells is None:
            stack_column = None
            continue
        labels = [cell.strip().lower() for cell in cells]
        if "stack" in labels:
            stack_column = labels.index("stack")
            continue
        if stack_column is None or stack_column >= len(cells):
            continue
        match = REPO_LINK.search(line)
        if not match:
            continue
        repo = f"{match.group(1)}/{match.group(2)}"
        cells[stack_column] = render_stack(cells[stack_column], stars_for(repo))
        lines[index] = "|" + "|".join(cells) + "|"
    return "\n".join(lines)


def repos_in(text):
    """Every repo referenced by a row that has a Stack column, deduped."""
    found = []
    refresh(text, lambda repo: (found.append(repo), 0)[1])
    return sorted(set(found))


def main():
    text = PAGE.read_text()
    counts = {repo: fetch_stars(repo) for repo in repos_in(text)}
    updated = refresh(text, counts.__getitem__)
    if updated == text:
        print("Star counts already current.")
        return 0
    PAGE.write_text(updated)
    print("Updated:", ", ".join(f"{r} ⭐ {c}" for r, c in sorted(counts.items())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
