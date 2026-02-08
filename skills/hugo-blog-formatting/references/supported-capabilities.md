# Supported Formatting Capabilities

Use this as the source of truth when explaining what this repo supports for blog formatting.

## Shortcodes

| Capability | Syntax | Backing location | Notes |
| --- | --- | --- | --- |
| Glossary term popup | `{{< term "RAG" >}}` | `layouts/shortcodes/term.html` | Also supports `key/text` and inline `name/def`. |
| Highlight callout | `{{< highlight-box title="..." >}}...{{< /highlight-box >}}` | `layouts/shortcodes/highlight-box.html` | Omit `title` for titleless callouts. |
| Collapsible content | `{{< collapse summary="..." >}}...{{< /collapse >}}` | Theme shortcode (`themes/PaperMod/layouts/shortcodes/collapse.html`) | Useful for optional details. |
| Embedded app | `{{< app src="/apps/demo.html" height="400px" title="Demo" >}}` | `layouts/shortcodes/app.html` | Source files live in `static/apps/`. |

## Markdown and diagrams
- Standard Markdown for headings, lists, tables, quotes, links, and fenced code blocks.
- Mermaid code fences are supported via `layouts/_default/_markup/render-codeblock-mermaid.html`.
- Markdown tables are preferred for compact comparisons; split large tables when readability drops.

## Asset conventions
- Images: store in `static/images/<slug>/` and reference as `/images/<slug>/<file>`.
- App HTML files: store in `static/apps/` and embed via `app` shortcode.
- Keep descriptive alt text for all images.

## Content structure conventions
- H1 belongs in front matter (`title`); body should start at H2 (`##`).
- Keep sections scannable with short paragraphs and explicit subsection headers.
- Prefer lower-case, hyphenated tags and slugs.

## Validation commands
- Local preview (includes drafts): `hugo server -D`
- Production build check: `hugo --gc --minify`
