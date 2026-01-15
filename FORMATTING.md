# Formatting Guide

A reference for writing well-formatted articles on this site. These techniques improve readability and help readers navigate complex topics.

---

## Quick Reference

| Element | Syntax | Use For |
|---------|--------|---------|
| Term popup | `{{< term "RAG" >}}` | Jargon, acronyms, technical terms |
| Highlight box | `{{< highlight-box title="..." >}}` | Key insights, summaries |
| Collapsible | `{{< collapse summary="..." >}}` | Optional details, long content |
| Table | Markdown tables | Comparisons, structured data |
| Blockquote | `> text` | Quotes, key statements |

---

## Term Popups

Click-to-reveal definitions for terms that need explanation without disrupting flow.

### Basic Usage

```markdown
The {{< term "RAG" >}} approach reduces hallucinations.
```

Looks up "RAG" in the glossary and shows definition on click.

### Custom Display Text

```markdown
Understanding {{< term key="context-window" text="context windows" >}} is crucial.
```

Shows "context windows" but looks up "context-window" in glossary.

### Inline Definition

```markdown
The {{< term name="moat" def="A sustainable competitive advantage that's hard to replicate" >}} matters.
```

For one-off terms that don't need to be in the glossary.

### Post-Specific Glossary

Add terms in your post's frontmatter:

```yaml
---
title: "My Post"
glossary:
  barbell-thesis: "Value concentrates at extremes while the middle gets squeezed."
  vertical-integration: "Controlling multiple layers of the stack."
---
```

### Global Glossary

Add commonly-used terms to `data/glossary.yaml`:

```yaml
RAG:
  definition: "Retrieval-Augmented Generation - combining LLMs with external knowledge."

inference:
  definition: "Running a trained model to generate outputs, as opposed to training."
```

### When to Use Terms

- **Do use** for: industry jargon, acronyms, concepts readers might not know
- **Don't use** for: common words, terms you explain in the text anyway

---

## Highlight Boxes

Visually distinct callout sections for important content.

### With Title

```markdown
{{< highlight-box title="The Key Insight" >}}
Infrastructure providers and AI labs are vertically integrating.

The middle layer is getting absorbed.
{{< /highlight-box >}}
```

### Without Title

```markdown
{{< highlight-box >}}
**TL;DR:** Own the chips or own the customers. Everything else is a footnote.
{{< /highlight-box >}}
```

### When to Use Highlight Boxes

- Key takeaways or summaries
- Important warnings or caveats
- Frameworks or mental models
- Actionable checklists

**Don't overuse** - if everything is highlighted, nothing stands out.

---

## Collapsible Sections

Hide optional content that some readers may want to skip.

```markdown
{{< collapse summary="Technical details" >}}
The implementation uses a recursive descent parser with
memoization for performance...
{{< /collapse >}}
```

### When to Use Collapsibles

- Technical deep-dives in non-technical articles
- Extended examples or code
- Historical context or background
- Methodology explanations

---

## Tables

Use for comparisons and structured data.

```markdown
| Layer | Examples | Margin |
|-------|----------|--------|
| Grid | NVIDIA, TSMC | 73% |
| Factory | LangChain, Pinecone | 40-60% |
| Appliance | Cursor, Harvey | 70-80% |
```

### Table Best Practices

- Keep tables simple (3-5 columns max)
- Use bold for row headers when needed
- Align numbers to make comparisons easy
- Consider a highlight box for single-row "key facts"

---

## Text Formatting

### Emphasis Hierarchy

```markdown
**Bold** - Key terms, important points
*Italic* - Emphasis, introducing new terms
`code` - Technical terms, file names, commands
```

### Lists

Use bullet lists for unordered items:
```markdown
- First point
- Second point
- Third point
```

Use numbered lists for sequences or rankings:
```markdown
1. First step
2. Second step
3. Third step
```

### Blockquotes

For quotes or key statements:
```markdown
> Own the chips or own the customers. Everything else is a footnote.
```

For attributed quotes:
```markdown
> "The early idea that models could be moats has been resoundingly defeated."
> — Nathan Lambert
```

---

## Document Structure

### Headings

```markdown
## Major Section        (H2 - main sections)
### Subsection          (H3 - within sections)
#### Minor heading      (H4 - rarely needed)
```

- Use H2 for main sections (these appear in Table of Contents)
- Use H3 for subsections
- Avoid H4+ unless truly necessary

### Section Breaks

Use horizontal rules sparingly to separate major thought transitions:

```markdown
Content about one topic...

---

Content about a different topic...
```

### Opening

Start with a hook - a bold claim, question, or key insight:

```markdown
> ***Own the chips or the customers. Everything else is a footnote.***

---

## The Consensus Is Wrong

The AI infrastructure buildout is $400B annually...
```

---

## Images

### With Alt Text

```markdown
![Description of what the image shows](/images/post-name/image.png)
```

Write alt text that describes what the image communicates, not just what it contains.

### Diagrams

For simple diagrams, consider Mermaid:

````markdown
```mermaid
graph LR
    A[Input] --> B[Process] --> C[Output]
```
````

---

## Links

### Inline Links

```markdown
According to [a16z's analysis](https://example.com), the market is shifting.
```

### Reference-Style Links

For repeated links or cleaner prose:

```markdown
The [OpenRouter study][openrouter] shows interesting patterns.

[openrouter]: https://openrouter.ai/research
```

---

## Example: Well-Formatted Section

```markdown
## What Survives the Collapse

**Three categories maintain pricing power:**

**1. Infrastructure suppliers with manufacturing moats**

NVIDIA and TSMC maintain 73% gross margins through complexity and
ecosystem lock-in. Cheap training doesn't mean cheap {{< term "inference" >}} at scale.

**2. Vertical specialists with domain moats**

Harvey, Abridge, ElevenLabs. Regulatory complexity and proprietary
data create barriers labs can't easily cross.

**3. Embedded platforms with {{< term "data-gravity" >}}**

Databricks at $62B. Once your data lives there, switching costs compound.

{{< highlight-box title="The Survival Test" >}}
Ask yourself:

1. **Manufacturing moat?** Physical complexity that takes years to replicate.
2. **Regulatory moat?** Domain expertise where compliance is the product.
3. **Data gravity?** Are you the system of record?

If you can't answer yes to at least one, you're building a feature—not a company.
{{< /highlight-box >}}
```

---

## Checklist Before Publishing

- [ ] Frontmatter complete (title, date, tags, summary)
- [ ] Opening hooks the reader
- [ ] Technical terms have {{< term >}} popups where helpful
- [ ] Key insights in highlight boxes (1-2 per post max)
- [ ] Tables used for comparisons
- [ ] Images have descriptive alt text
- [ ] Links work and add value
- [ ] Read aloud to check flow
