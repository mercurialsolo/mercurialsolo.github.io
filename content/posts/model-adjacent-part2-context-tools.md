---
title: "Model-Adjacent Products, Part 2: Context & Tools"
date: 2026-01-09T11:00:00
author: mercurialsolo
tags: [ai, engineering, rag, memory, mcp, tools]
summary: "Retrieval, memory, and tool systems determine what the model knows and what it can do. Get these wrong and the model hallucinates or fails silently."
series: ["Model-Adjacent Products"]
ShowToc: true
TocOpen: false
---

Retrieval, memory, and tool systems determine what the model knows and what it can do. Get these wrong and the model hallucinates or fails silently.

## Retrieval Systems

RAG is not "add a vector database." It's a cache hierarchy with freshness policies and provenance tracking.

### Cache Hierarchy

```
L1: Prompt Cache        → System prompts, instructions (60-90% hit)
L2: Embedding Cache     → Query embeddings (20-40% hit)
L3: Result Cache        → (query_hash, version) → chunks (10-30% hit)
L4: Document Store      → Ground truth chunks
```

Each level trades freshness for speed. Make these tradeoffs explicit.

### Freshness SLAs

Different sources tolerate different staleness:

| Source | Max Staleness | Trigger |
|--------|---------------|---------|
| Support tickets | 5 min | Webhook |
| Product docs | 4 hours | Git push |
| Policies | 24 hours | Manual publish |
| Historical data | 7 days | Batch job |

Build re-indexing as a production system. Users will ask "why doesn't it know about X?"

### Provenance

Every chunk carries metadata:

```json
{
  "content": "Refunds processed in 5-7 days...",
  "source": "help-center/refunds.md",
  "version": "a3f2b1c",
  "indexed_at": "2026-01-08T14:30:00Z",
  "confidence": 0.87
}
```

Enables: citations, debugging, freshness-aware reranking, user trust.

### Hybrid Retrieval

Vector search misses keyword matches. Keyword search misses semantic similarity. Use both.

```
Query → Vector Search → Results A
      → BM25 Search   → Results B
      → Reciprocal Rank Fusion → Final Results
```

The reranker (cross-encoder or LLM-based) is where quality is won or lost.

## Memory Architecture

Memory is a product category. Users expect AI to remember. They also expect control over what's remembered.

### Memory Types

**Episodic:** What happened, when.
- "Last week you asked about refund policies"

**Semantic:** Stable facts.
- "User's company is Acme Corp"
- "User prefers concise responses"

**Procedural:** How to work with this user.
- "When user says 'ship it', deploy to staging"

### Schema

```json
{
  "user_id": "u_abc123",
  "memories": [
    {
      "type": "semantic",
      "content": "Prefers concise, technical responses",
      "confidence": 0.92,
      "created_at": "2026-01-05T10:30:00Z",
      "source": "explicit_feedback"
    }
  ]
}
```

### Compaction

Raw logs grow unbounded. Convert to structured facts periodically.

```
Raw: 200 turns over 6 months (50KB)
Compacted: facts + preferences + recent context (2KB)
```

### Conflict Resolution

When new info contradicts stored memory:

1. Check recency (newer wins)
2. Check confidence (explicit > inferred)
3. Check source (user statement > system inference)
4. Update, keep history for audit

### User Control

Required capabilities:
- View what's remembered
- Correct inaccuracies
- Delete specific memories
- Export data

Not optional—increasingly required by regulation.

## Tool Ecosystems

Once agents call real systems, stringly-typed prompt integrations break. Tools become infrastructure.

### MCP: The Protocol Shift

Model Context Protocol makes tools discoverable and self-describing.

Before: Every integration is custom code.
After: Tools discovered at runtime with typed schemas.

```python
tools = mcp_client.list_tools()  # Returns schemas, permissions
result = mcp_client.call_tool("calendar.create_event", params)
```

### Schema Quality Matters

Bad:
```json
{"name": "search", "description": "Search for stuff", "parameters": {"q": "string"}}
```

Good:
```json
{
  "name": "knowledge_base_search",
  "description": "Search internal docs. Use for policy questions. NOT for real-time data.",
  "parameters": {
    "query": {"type": "string", "minLength": 3, "maxLength": 200},
    "doc_type": {"enum": ["policy", "product", "how-to"]}
  }
}
```

The model will misuse bad schemas.

### Permission Model

Tools are available under conditions:

```yaml
tool: database_query
permissions:
  - role: support_agent
    allowed_tables: [orders, customers]
    denied_columns: [ssn, credit_card]
    rate_limit: 100/hour
```

Log every call: who, what, when, and the prompt context that triggered it.

## What's Next

Part 3 covers verification, observability, and evals—the quality gates that make production systems trustworthy.

---

*Part of a 4-part series on building production AI systems.*
