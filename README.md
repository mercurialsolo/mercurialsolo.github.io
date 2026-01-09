# mercurialsolo.github.io

Personal site built with [Hugo](https://gohugo.io/) and [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

**Live site:** https://mercurialsolo.github.io

## Setup

### Prerequisites

```bash
# Install Hugo (macOS)
brew install hugo

# Verify installation
hugo version
```

### Clone and run locally

```bash
# Clone with submodules (theme)
git clone --recurse-submodules https://github.com/mercurialsolo/mercurialsolo.github.io.git
cd mercurialsolo.github.io

# Start development server
hugo server -D

# Open http://localhost:1313
```

## Content Structure

```
content/
├── posts/      # Blog posts
├── projects/   # Work and side projects
├── reading/    # Books and articles
├── travel/     # Places visited
├── archives.md # Archive page
└── search.md   # Search page
```

## Writing Posts

```bash
# Create new post
hugo new posts/my-new-post.md
```

Posts use this frontmatter:

```yaml
---
title: "Post Title"
date: 2026-01-09
author: mercurialsolo
tags: [tag1, tag2]
summary: "Brief description for post list"
ShowToc: true
---
```

## Embedding Mini-Apps

Use the `app` shortcode to embed interactive HTML/JS apps:

```markdown
{{< app src="/apps/demo.html" height="400px" title="Demo App" >}}
```

Place app files in `static/apps/`.

## Deployment

Site auto-deploys via GitHub Actions on push to `main`.

To deploy manually:

```bash
# Build
hugo --gc --minify

# Output in ./public/
```

## Configuration

Edit `hugo.yaml` for:
- Site title, description, author
- Social links (GitHub, X, LinkedIn)
- Menu items
- Theme settings

## License

Content: All rights reserved
Code: MIT
