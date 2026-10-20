---
title: "Ask Bach: Hybrid-Retrieval RAG Service"
shortTitle: "Ask Bach"
summary: "A retrieval-augmented chatbot that answers questions about my work from a curated knowledge base, served by FastAPI on Azure Container Apps and built into this site."
problem: "Answer free-form questions about my background without letting an LLM invent facts or citations."
categories: [ai, data]
status: deployed
statusNote: "The API runs on Azure Container Apps and powers the chat button on this site."
role: "Sole developer"
period: "2026"
year: 2026
order: 1
featured: true
stack: ["Python", "FastAPI", "Sentence Transformers", "BM25", "Azure Cosmos DB", "Azure Container Apps", "Docker", "Groq"]
result:
  value: "10 / 10"
  label: "Recall@3, hybrid retrieval"
  context: "On a 10-query evaluation set (5 questions + 5 paraphrases). A regression check, not a benchmark."
github: "https://github.com/bachnguyennn/AskBachBot"
resume:
  - "Built a RAG service over a curated knowledge base: BM25 and MiniLM dense retrieval fused with Reciprocal Rank Fusion, answered by a Groq-hosted LLM with strict JSON-schema output."
  - "Made citations unforgeable by design: the model returns only integer evidence IDs, and Python maps them back to the retrieved chunks."
  - "Evaluated retrieval separately from generation (Recall, Precision, MRR @3); hybrid reached 10/10 Recall@3 on a small labeled set, and Cosmos DB vector search reproduced the in-memory dense results exactly."
  - "Deployed with Docker on Azure Container Apps, using Container Apps secrets for the LLM key and a managed identity for Cosmos DB access."
---

## Overview

Ask Bach is the chat button in the corner of this site. It answers questions about my education, experience, research, and projects using only a set of documents I wrote for it. I built every layer myself: ingestion, chunking, dense and lexical retrieval, rank fusion, structured generation, source validation, evaluation, the HTTP API, the container, and the Azure deployment.

## The problem

A portfolio is a fixed set of pages, but visitors usually arrive with one specific question: *has he used Azure? what did he do at CMHA? what is the thesis about?* An LLM can answer in plain language, but it will also fill gaps with confident guesses. I wanted answers grounded in documents I control, and sources the model cannot make up.

## System architecture

```text
question
  → BM25 keyword search (top 10) + MiniLM vectors in Cosmos DB (top 10)
  → Reciprocal Rank Fusion (k = 60) → top 3 chunks
  → Groq LLM, strict JSON: {answer, used_context: [1, 2]}
  → resolve_sources() in Python → {answer, sources: [(document, chunk_id)]}
```

1. **Knowledge base.** Hand-written plain-text documents stored in **Azure Cosmos DB for NoSQL**. Each is split into paragraph-based chunks, and the document title is prefixed to every chunk so a chunk from the middle of a file still says what it is about.
2. **Dense retrieval.** `all-MiniLM-L6-v2` embeds chunks and questions as 384-dimensional vectors. Cosmos DB's vector search returns the nearest chunks by cosine similarity, using a `flat` (exact) index.
3. **Lexical retrieval.** BM25 over a simple regex tokenizer catches exact technical terms that embeddings blur, such as course codes or tool names.
4. **Fusion.** Each retriever returns 10 candidates; **Reciprocal Rank Fusion** (k = 60) merges them, and the top 3 chunks become the context.
5. **Generation.** The Groq-hosted `openai/gpt-oss-120b` model answers in **strict JSON-schema mode**: `{"answer": ..., "used_context": [1, 2]}`.
6. **Source resolution.** Python maps the evidence IDs back to `(document, chunk_id)` pairs. IDs that were not in the context are dropped.

## Implementation decisions

- **Citations the model cannot fabricate.** The model never sees filenames. It returns integer evidence IDs, and application code resolves them. Every returned source is guaranteed to be a chunk that was actually retrieved for that question.
- **Refusal is a normal answer.** When the context does not contain the answer, the service says so and returns no sources, instead of erroring or guessing.
- **Retrieval measured separately from generation.** Most bad answers start as bad retrieval, so retrieval has its own evaluation script that makes no LLM calls.
- **Secrets stay on the server.** The Groq key is a Container Apps secret, Cosmos DB is reached through a managed identity with role-based access, and CORS only allows this site. The browser only ever sees a public API URL.

## Evaluation

The benchmark is deliberately small: **10 queries**, made of 5 original questions and 5 paraphrases that share their relevance labels. The relevance rule was fixed before any results were seen.

| Metric | Dense | BM25 | Hybrid |
|---|---:|---:|---:|
| Recall@3 | 8/10 | **10/10** | **10/10** |
| Precision@3 | 43% | **73%** | 70% |
| MRR@3 *(added post hoc)* | 0.70 | 0.83 | **0.95** |

What I take from this:

- **Hybrid clearly beats dense-only. Hybrid against BM25 is not settled.** They tie on recall, BM25 is slightly ahead on precision, and hybrid's MRR lead comes from two queries.
- **10/10 recall hides a weakness.** For "What is Bach researching?", every retriever passes only through a one-sentence summary in the profile document.
- **The paraphrases are easier than real questions** because I wrote them knowing the documents.

When dense retrieval moved from in-memory NumPy to Cosmos DB, I reran the dense benchmark against the cloud index. It returned the same top 3 chunks, in the same order, with the same scores to four decimal places, so the migration changed infrastructure, not behaviour. That only holds because the index is exact; switching to an approximate index would need the check again.

## Deployment

- A Docker image built for `linux/amd64`, pushed to **Azure Container Registry** with versioned tags.
- **Azure Container Apps** serves it over HTTPS with environment variables, Container Apps secrets, and CORS restricted to this site.
- The same backend has a small content API. `/content/experience` serves public experience records from Cosmos DB, which this site uses to refresh its experience list in the browser; the static page stays the source of truth (see the [experience page](/experience/)).

## Limitations

- **Groundedness is not measured.** A valid citation does not mean every sentence is supported. In testing, the model combined two true facts from one chunk into a claim the chunk never made.
- **Small evaluation set.** 10 retrieval queries is enough to catch regressions, not to compare methods with confidence.
- **No rate limiting or authentication**, and upstream LLM failures surface as HTTP 500s. The chat widget on this site handles that with a timeout and a contact fallback.
- **Cold starts.** The embedding model loads when a container starts, so the first request after a scale-up is slow.

## What I learned

- Evaluate retrieval before judging the LLM's answers.
- Give each chunk a stable identity (`document`, `chunk_id`) and keep it from chunking through to the API response, or evaluation labels quietly drift.
- Structured output checks shape, not truth. `{"answer": "Bach worked at Google.", "used_context": [999]}` is schema-valid, which is why source resolution exists.

**Next:** a 50 to 100 question evaluation set with independently written paraphrases and unanswerable questions, groundedness metrics, and incremental re-indexing from the Cosmos DB change feed.
