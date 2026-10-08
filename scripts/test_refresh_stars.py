#!/usr/bin/env python3
"""Tests for refresh-stars. Run: python3 scripts/test_refresh_stars.py"""

import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "refresh_stars", Path(__file__).resolve().parent / "refresh-stars.py"
)
refresh_stars = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refresh_stars)

refresh = refresh_stars.refresh
repos_in = refresh_stars.repos_in


def row(name, stack, links):
    return f"| **{name}** | A description | {stack} | 2026-01 | {links} |"


HEADER = "| Project | Details | Stack | Launch | Links |\n|---|---|---|---|---|"
GH = "[GitHub](https://github.com/owner/thing)"


class RefreshTest(unittest.TestCase):
    def refresh_one(self, stack, stars):
        text = f"{HEADER}\n{row('thing', stack, GH)}"
        return refresh(text, lambda repo: stars).split("\n")[-1]

    def test_replaces_an_existing_count(self):
        self.assertIn("Rust · ⭐ 202", self.refresh_one("Rust · ⭐ 162", 202))

    def test_adds_a_count_to_a_bare_language(self):
        self.assertIn("| Swift · ⭐ 7 |", self.refresh_one("Swift", 7))

    def test_adds_a_count_to_an_empty_cell(self):
        self.assertIn("| ⭐ 7 |", self.refresh_one("—", 7))

    def test_drops_the_count_at_zero_stars(self):
        self.assertIn("| Swift |", self.refresh_one("Swift · ⭐ 3", 0))

    def test_leaves_an_empty_cell_empty_at_zero_stars(self):
        self.assertIn("| — |", self.refresh_one("⭐ 3", 0))

    def test_is_idempotent(self):
        text = f"{HEADER}\n{row('thing', 'Rust · ⭐ 9', GH)}"
        once = refresh(text, lambda repo: 9)
        self.assertEqual(text, once)
        self.assertEqual(once, refresh(once, lambda repo: 9))

    def test_preserves_every_other_cell(self):
        hand_written = "| **thing** | Why it matters — a hand-written line | Rust · ⭐ 1 | 2026-01 | " + GH + " |"
        updated = refresh(f"{HEADER}\n{hand_written}", lambda repo: 2).split("\n")[-1]
        self.assertIn("Why it matters — a hand-written line", updated)
        self.assertIn("| 2026-01 |", updated)

    def test_ignores_tables_without_a_stack_column(self):
        text = "| Project | Details | Links |\n|---|---|---|\n| **f** | A fork | " + GH + " |"
        self.assertEqual(text, refresh(text, lambda repo: 99))
        self.assertEqual([], repos_in(text))

    def test_ignores_rows_with_no_github_link(self):
        text = f"{HEADER}\n{row('private', 'Python', 'Private')}"
        self.assertEqual(text, refresh(text, lambda repo: 99))

    def test_reads_the_repo_from_the_github_link_only(self):
        links = GH + " · [Site](https://owner.github.io/thing/)"
        text = f"{HEADER}\n{row('thing', 'Rust', links)}"
        self.assertEqual(["owner/thing"], repos_in(text))

    def test_dedupes_repos_listed_twice(self):
        text = f"{HEADER}\n{row('thing', 'Rust', GH)}\n{row('thing', 'Rust', GH)}"
        self.assertEqual(["owner/thing"], repos_in(text))


class RealPageTest(unittest.TestCase):
    def test_the_real_page_parses(self):
        text = refresh_stars.PAGE.read_text()
        repos = repos_in(text)
        self.assertIn("mercurialsolo/claudectl", repos)
        self.assertIn("cirbuk/plan-lint", repos)
        self.assertNotIn("mercurialsolo/python-feedgen", repos)  # Forks: no Stack column

    def test_the_real_page_is_unchanged_by_its_own_counts(self):
        """Feeding back the counts already on the page must be a no-op."""
        text = refresh_stars.PAGE.read_text()
        on_page = {}
        for line in text.split("\n"):
            match = refresh_stars.REPO_LINK.search(line)
            star = refresh_stars.STAR_SEGMENT.search(line)
            if match:
                repo = f"{match.group(1)}/{match.group(2)}"
                on_page[repo] = int(star.group().split("⭐")[1]) if star else 0
        self.assertEqual(text, refresh(text, on_page.__getitem__))


if __name__ == "__main__":
    unittest.main(verbosity=2)
