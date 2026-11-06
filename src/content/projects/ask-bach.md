---
title: "Ask Bach: Hybrid-Retrieval RAG Service"
shortTitle: "Ask Bach"
summary: "A chatbot that answers questions about my work using notes I wrote and lists its sources. Try it with the chat button on this page."
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
  - "Made source metadata unforgeable by design: the model returns only integer evidence IDs, and Python maps them back to the retrieved chunks."
  - "Evaluated retrieval separately from generation (Recall, Precision, MRR @3); hybrid reached 10/10 Recall@3 on a small labeled set, enforced as a regression gate in GitHub Actions alongside 23 unit and API tests."
  - "Deployed with Docker on Azure Container Apps, using Container Apps secrets for the LLM key and a managed identity for Cosmos DB access; cut cold start 3x (32 s to 10.6 s) and the image 5x (3.26 GB to 0.6 GB)."
  - "Hardened the public API for a $0 budget: per-IP rate limiting to protect the free LLM quota, and a clean 503 fallback instead of raw errors."
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

- **Sources the model cannot fabricate.** The model never sees filenames. It returns integer evidence IDs, and application code resolves them. Every returned source is guaranteed to be a chunk that was actually retrieved for that question. That guarantees the source is real, not that every sentence is supported by it (see Limitations).
- **Refusal is a normal answer.** When the context does not contain the answer, the service says so and returns no sources, instead of erroring or guessing.
- **Retrieval measured separately from generation.** Most bad answers start as bad retrieval, so retrieval has its own evaluation script that makes no LLM calls. It runs in CI on every push and fails the build if retrieval gets worse.
- **Fail gracefully on a free tier.** A per-IP rate limit stops one visitor from using up the free LLM quota for everyone, and if the LLM or database is down the API returns a clean `503`, which this widget turns into a message with my email.
- **Secrets stay on the server.** The Groq key is a Container Apps secret, Cosmos DB is reached through a managed identity with role-based access, and CORS only allows this site. The browser only ever sees a public API URL.

## Evaluation

The benchmark is deliberately small: **10 queries**, made of 5 original questions and 5 paraphrases that share their relevance labels. The relevance rule was fixed before any results were seen. Results on the current knowledge base (22 documents, 122 chunks):

| Metric | Dense | BM25 | Hybrid |
|---|---:|---:|---:|
| Recall@3 | **10/10** | **10/10** | **10/10** |
| Precision@3 | 53% | **67%** | 60% |
| MRR@3 | 0.88 | 0.83 | **0.93** |

What I take from this:

- **Hybrid ranks evidence highest**, and all three retrievers now find evidence for every question. BM25 is still ahead on precision, so hybrid against BM25 is close.
- **A new document can break an unrelated answer.** Adding GrammarMe dropped hybrid recall to 9/10, because its chunks pushed the skills chunk out of the dense top 10 for "Which coding languages can Bach use?". CI caught it, and rewording one line of that chunk fixed it. These scores were measured after that fix, so the rise in MRR from 0.88 to 0.93 isn't a clean gain.
- **A bigger knowledge base is a harder haystack.** When the corpus grew from 33 to 115 chunks, hybrid precision fell from 70% to 60% and MRR from 0.95 to 0.88. I re-labelled the benchmark for the new chunks before re-running it, because the old labels pointed at chunks that no longer existed.
- **10/10 recall hides a weakness.** For "What is Bach researching?", every retriever passes only through a one-sentence summary in the profile document; generic Q&A chunks outrank the research document itself.
- **The paraphrases are easier than real questions** because I wrote them knowing the documents.

When dense retrieval moved from in-memory NumPy to Cosmos DB, I reran the benchmark against the cloud index, and I've repeated it since. Both return identical rankings, so the migration changed infrastructure, not behaviour. That same result is why CI can run the benchmark offline, without cloud credentials. It only holds because the index is exact; switching to an approximate index would need the check again.

## Deployment

- A Docker image built for `linux/amd64`, pushed to **Azure Container Registry** with versioned tags. Installing the CPU-only build of PyTorch and baking the embedding model into the image shrank it from 3.26 GB to about 0.6 GB and cut the cold start (the first question after the app has scaled to zero) from **32 s to 10.6 s**.
- **Azure Container Apps** serves it over HTTPS with environment variables, Container Apps secrets, and CORS restricted to this site.
- The same backend has a small content API. `/content/experience` serves public experience records from Cosmos DB, which this site uses to refresh its experience list in the browser; the static page stays the source of truth (see the [experience page](/experience/)).

## Limitations

- **Groundedness is not measured.** A valid citation does not mean every sentence is supported. In testing, the model combined two true facts from one chunk into a claim the chunk never made.
- **Small evaluation set.** 10 retrieval queries is enough to catch regressions, not to compare methods with confidence.
- **Simple rate limiting.** The limit is per visitor and kept in memory, which suits one small container but wouldn't stop a distributed attack. There is no authentication; the API only serves public information.
- **Cold starts.** The app scales to zero when idle to stay free, so the first question after a quiet period takes about 10 seconds. The chat widget says so while it waits.

## What I learned

- Evaluate retrieval before judging the LLM's answers.
- Give each chunk a stable identity (`document`, `chunk_id`) and keep it from chunking through to the API response, or evaluation labels quietly drift.
- Structured output checks shape, not truth. `{"answer": "Bach worked at Google.", "used_context": [999]}` is schema-valid, which is why source resolution exists.

**Next:** a larger evaluation set with questions written by other people, plus unanswerable and prompt-injection cases; an answer-level faithfulness score; and a baseline that skips retrieval and gives the model the whole knowledge base, to test whether RAG is earning its complexity here.
