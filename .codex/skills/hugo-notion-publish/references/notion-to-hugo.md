# Notion to Hugo mapping

Use Notion MCP to fetch page properties, block content, and assets. Convert blocks to Hugo Markdown and apply site shortcodes where appropriate.

## Notion MCP tools
- `notion-search`: find candidate pages by keywords when no URL is provided.
- `notion-fetch`: retrieve full page content by URL (properties, blocks, assets).
- Some OpenAI MCP clients expose these as `search` and `fetch` (no `notion-` prefix).

## Page-level rules
- Title -> front matter `title`; remove any top-level H1 from the body.
- Page properties -> front matter (`date`, `tags`, `summary`, `series`).
- Shift headings down one level (H1 -> `##`, H2 -> `###`, H3 -> `####`).

## Block mapping

| Notion block | Hugo Markdown | Notes |
| --- | --- | --- |
| Paragraph | Plain text | Preserve inline bold/italic/code/link styles. |
| Heading 1 | `##` | Avoid H1 in body. |
| Heading 2 | `###` |  |
| Heading 3 | `####` |  |
| Bulleted list | `- item` | Nested lists allowed. |
| Numbered list | `1. item` | Keep numbering simple. |
| To-do list | `- [ ]` or `- [x]` |  |
| Quote | `> quote` |  |
| Callout | `{{< highlight-box >}}` | Use title only if there is a clear label; otherwise omit title. |
| Toggle | `{{< collapse summary="..." >}}` | Toggle title is the summary. |
| Code | fenced code block | Use language when provided. |
| Divider | `---` |  |
| Table | Markdown table | Keep 3-5 columns; otherwise convert to list. |
| Image | Markdown image + `/images/<slug>/` | Save to `static/images/<slug>/`. |
| File | Link to `/images/<slug>/` or `/files/` | Save to `static/` and link. |
| Bookmark/embed | Plain link | Add context in text. |

## Special cases
- Mermaid: if a Notion code block uses `mermaid`, keep it as a fenced Mermaid block.
- Equations: keep as plain text unless math rendering is confirmed for the site.
- Columns or synced blocks: flatten into a single linear flow.
- Notion database views: summarize in prose or extract a table that fits Markdown constraints.

## Asset handling
- Store images at `static/images/<slug>/` and reference as `/images/<slug>/file.ext`.
- Use descriptive alt text; avoid leaving `Untitled`.
- For large media, prefer linking rather than embedding.

## Cleanup checklist
- Remove export banners and Notion-only artifacts.
- Ensure there is only one title (front matter).
- Check that all links are valid and inline code uses backticks.
