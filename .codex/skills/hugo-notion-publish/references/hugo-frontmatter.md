# Hugo front matter

Use this template for posts in `content/posts/`.

```yaml
---
title: "Post Title"
date: 2026-01-09T09:30:00
lastmod: 2026-01-15T11:00:00
author: mercurialsolo
tags: [ai, autonomy]
summary: "Brief description for post listings."
series: ["Series Name"]
ShowToc: true
TocOpen: false
glossary:
  term-key: "Short definition for this post"
---
```

Rules:
- Use ISO 8601 without timezone (`YYYY-MM-DDTHH:MM:SS`) and keep times consistent with the draft or existing post.
- Include `lastmod` only when editing an existing post.
- Keep `summary` to 1-2 sentences; it should read well in post listings.
- Tags are lower-case and hyphenated.
- Omit `series` and `glossary` when unused.
- For other sections, mirror the fields used in existing files in `content/<section>/`.
