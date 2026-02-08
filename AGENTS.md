# Repository Guidelines

## Project Structure & Module Organization
This repository is a Hugo site using the PaperMod theme.

- `content/`: authored content (`posts/`, `projects/`, `conferences-talks/`) plus section pages like `archives.md` and `search.md`.
- `layouts/`: local template overrides and custom shortcodes (for example `app`, `term`, `highlight-box`).
- `assets/`: extended styles (notably `assets/css/extended/custom.css`).
- `static/`: files copied as-is to the built site (images, embedded app files under `static/apps/`).
- `data/glossary.yaml`: shared glossary terms used by the `term` shortcode.
- `themes/PaperMod/`: git submodule theme source; treat as upstream code and avoid direct edits.

## Build, Test, and Development Commands
- `hugo server -D`: run local dev server including drafts at `http://localhost:1313`.
- `hugo --gc --minify`: production build (same core command used in CI).
- `hugo new posts/my-post-title.md`: create a new post with archetype front matter.
- `git submodule update --init --recursive`: ensure theme submodule is present after clone.

## Coding Style & Naming Conventions
- Write content in Markdown with YAML front matter.
- Use lowercase, hyphenated slugs for post filenames and tags (example: `model-adjacent-part2-context-tools.md`).
- Keep section landing pages as `_index.md`.
- Follow `FORMATTING.md` for shortcode usage, callouts, tables, and Mermaid blocks.
- Keep configuration changes in `hugo.yaml` focused and grouped by concern.

## Testing Guidelines
There is no separate unit-test suite in this repo. Validation is build and rendering based:

- Run `hugo --gc --minify` before opening a PR; treat build failures as blockers.
- Spot-check updated pages in `hugo server -D`, including shortcode rendering and navigation links.
- For static assets, verify referenced paths resolve from `/static` to the expected public URL.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects, often with a prefix (`fix:`, `publish:`, `update:`).

- Keep commits scoped to one logical change.
- Use clear subjects (example: `fix: correct publish date for model-collapse`).
- PRs should include: summary of changes, affected content paths, and screenshots for visual/layout changes.
- Link related issues/tasks when applicable and note any follow-up content work.
