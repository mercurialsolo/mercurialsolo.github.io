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

## Content Guidelines

- Posts focus on AI, technology, and professional insights
- Write in clear, direct prose (no excessive hedging)
- Include code examples where relevant
- Link to external sources with context
