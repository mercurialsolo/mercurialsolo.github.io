---
name: hugo-blog-formatting
description: Format and polish Hugo blog content for this repository using FORMATTING.md, shortcodes, front matter conventions, and asset/link rules. Use when asked to improve readability, apply consistent structure, or explain supported formatting capabilities.
---

# Hugo Blog Formatting

## Overview
Use this skill to rewrite or clean up post formatting while keeping meaning intact and matching this repository's publishing standards.

## Trigger conditions
- User asks to format, polish, or restructure a draft in `content/`.
- User asks which blog formatting features are supported on this Hugo site.
- User asks to apply local shortcode patterns (`term`, `highlight-box`, `collapse`, `app`) or Mermaid formatting.

## Workflow
1. Identify target file and section (`posts`, `projects`, `conferences-talks`, or root content page).
2. Normalize front matter and heading hierarchy.
3. Apply relevant formatting capabilities from `references/supported-capabilities.md`.
4. Validate internal paths for images and embedded apps.
5. Run Hugo build/preview if requested.

## Front matter baseline (posts)
```yaml
---
title: "Post Title"
date: 2026-01-09T09:30:00
author: mercurialsolo
tags: [ai, technology]
summary: "Brief description for post listings."
ShowToc: true
TocOpen: false
---
```

Rules:
- Tags are lowercase and hyphenated.
- Keep `summary` to 1-2 sentences.
- Keep body free of H1 (`#`) because title lives in front matter.
- Preserve `date` when editing; set `lastmod` when updating existing content.

## Quality checks
- Shortcodes render and close correctly.
- Glossary terms resolve through inline def, post `glossary`, or `data/glossary.yaml`.
- Image paths follow `/images/<slug>/...` from `static/images/<slug>/`.
- App embeds point to files in `static/apps/`.
- Build passes with `hugo --gc --minify` when validation is requested.

## Resources
- `FORMATTING.md`
- `CLAUDE.md`
- `references/supported-capabilities.md`
- `data/glossary.yaml`
- `layouts/shortcodes/`
