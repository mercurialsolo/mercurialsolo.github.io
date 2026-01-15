# mercurialsolo.github.io

Personal website built with Hugo + PaperMod theme. Contains blog posts about AI/technology, project portfolio, reading list, and interactive travel globe.

## Tech Stack

- **Hugo** (v0.154.3) - Static site generator
- **PaperMod** - Theme (git submodule in `themes/PaperMod`)
- **GitHub Pages** - Hosting via Actions workflow
- **JavaScript/Three.js** - Interactive apps (travel globe)

## Commands

```bash
# Development server (with drafts)
hugo server -D

# Build for production
hugo --gc --minify

# Create new post
hugo new posts/my-post-title.md

# Create new content in any section
hugo new <section>/filename.md
```

## Content Structure

```
content/
├── posts/       # Blog posts (AI, technology, ideas)
├── projects/    # Portfolio (_index.md with project list)
├── reading/     # Books and articles
├── travel/      # Travel page with interactive globe
├── archives.md  # Archive listing
└── search.md    # Search page
```

## Writing Posts

Frontmatter template:
```yaml
---
title: "Post Title"
date: 2026-01-09
author: mercurialsolo
tags: [ai, technology]
summary: "Brief description for post listings"
ShowToc: true
TocOpen: false
---
```

- Use `hugo new posts/slug.md` to create with default frontmatter
- Tags should be lowercase, hyphenated
- Summary appears in post listings and SEO

## Embedding Interactive Apps

Use the `app` shortcode to embed HTML/JS apps:

```markdown
{{< app src="/apps/demo.html" height="400px" title="Demo App" >}}
```

- Place app HTML files in `static/apps/`
- Apps run in sandboxed iframe with `allow-scripts allow-same-origin`
- See `static/apps/travel-globe.html` for reference implementation

## Configuration

Main config: `hugo.yaml`

Key sections:
- `params.homeInfoParams` - Homepage intro text
- `params.socialIcons` - Social links (GitHub, X, LinkedIn, RSS)
- `menu.main` - Navigation menu items
- `markup.goldmark.renderer.unsafe: true` - Allows raw HTML in markdown

## Customization

- **Custom layouts**: `layouts/` overrides theme layouts
- **Custom shortcodes**: `layouts/shortcodes/`
- **Static assets**: `static/` (copied to root of built site)
- **Extended CSS**: Create `assets/css/extended/custom.css`

## Deployment

Auto-deploys via GitHub Actions on push to `main`. See `.github/workflows/hugo.yml`.

Manual build outputs to `./public/`.

## Important Patterns

1. **Projects page** uses `_index.md` with inline markdown table for project list
2. **Travel page** embeds Three.js globe via app shortcode
3. **Series posts** use naming convention: `topic-partN-subtitle.md`
4. **PaperMod theme** is a submodule - don't edit files in `themes/`

## Custom Formatting

### Term Popups (Glossary)

Add clickable terms that reveal definitions on click. Great for jargon, acronyms, or concepts that need brief explanation.

```markdown
<!-- From global glossary (data/glossary.yaml) -->
The {{< term "RAG" >}} approach improves accuracy.

<!-- Custom display text -->
Understanding {{< term key="context-window" text="context windows" >}} is crucial.

<!-- Inline definition (one-off terms) -->
The {{< term name="moat" def="A sustainable competitive advantage" >}} erodes quickly.
```

**Adding to global glossary** (`data/glossary.yaml`):
```yaml
RAG:
  definition: "Retrieval-Augmented Generation - combining LLMs with external knowledge retrieval."
```

**Post-specific terms** (in frontmatter):
```yaml
glossary:
  barbell-thesis: "Value concentrates at infrastructure and applications, squeezing the middle."
  custom-term: "A definition only relevant to this post"
```

Priority: inline `def` > post frontmatter > global glossary

---

### Highlight Boxes (Callouts)

Create visually distinct sections for key insights, summaries, or important callouts.

```markdown
{{< highlight-box title="The Key Insight" >}}
This content gets a subtle background and left border accent.

Supports **full markdown**: lists, links, bold, etc.

- Point one
- Point two
{{< /highlight-box >}}
```

Omit `title=""` for a titleless callout box.

---

### Collapsible Sections

Use the built-in `collapse` shortcode for expandable content:

```markdown
{{< collapse summary="Click to expand" >}}
Hidden content goes here.

Supports markdown.
{{< /collapse >}}
```

---

### Embedded Apps

For interactive JavaScript applications:

```markdown
{{< app src="/apps/demo.html" height="400px" title="Demo App" >}}
```

Place HTML files in `static/apps/`.

---

## Content Guidelines

- Posts focus on AI, technology, and professional insights
- Write in clear, direct prose (no excessive hedging)
- Include code examples where relevant
- Link to external sources with context
- Use **term popups** for jargon that readers might not know
- Use **highlight boxes** sparingly for key takeaways
