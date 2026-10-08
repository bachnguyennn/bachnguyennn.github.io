---
title: "Ask Bach — Cloud-Native RAG Chatbot"
summary: "A hybrid-retrieval RAG chatbot that answers questions about my education, skills, experience, and projects, served from Azure and built into this website."
role: "Builder"
period: "2026"
domain: ml
domainLabel: "LLM / RAG Systems"
tags: ["Python", "FastAPI", "RAG", "Azure Cosmos DB", "Azure Container Apps", "Docker", "Groq"]
featured: true
order: 0
github: "https://github.com/bachnguyennn/AskBachBot"
year: 2026
---

> **TL;DR —** A Retrieval-Augmented Generation chatbot over my own portfolio content. Hybrid retrieval (vector search + BM25, fused with Reciprocal Rank Fusion) feeds a Groq-hosted LLM, the API runs on Azure Container Apps, and the same backend now serves the experience section of this site from Cosmos DB. Try it with the chat button on this page.

## The problem

A portfolio is a fixed list of pages, but recruiters and visitors usually have a specific question: *has he used Azure? what did he do at CMHA? what's his research about?* I wanted visitors to be able to ask those questions in plain language and get an answer grounded in what I've actually done, not an LLM's guess.

## Retrieval

- **Chunking.** A document-processing pipeline loads knowledge-base content from Cosmos DB, splits each document into paragraph-based chunks, and tags every chunk with a source identifier and chunk ID.
- **Dense retrieval.** `all-MiniLM-L6-v2` (Sentence Transformers) turns chunks and questions into 384-dimensional embeddings, stored and searched in **Azure Cosmos DB for NoSQL** with its native vector search and cosine similarity.
- **Lexical retrieval.** Semantic similarity alone misses exact technical terms, so I added **BM25** keyword search.
- **Hybrid fusion.** The two ranked lists are combined with **Reciprocal Rank Fusion (RRF)**, which catches both specific terms and paraphrased questions.

## Generation

The top-ranked chunks are assembled into a structured context and sent to the Groq-hosted **`openai/gpt-oss-120b`** model. The model returns structured output that names the evidence it used. The FastAPI backend validates that output and maps the evidence back to the original source documents, so every answer comes with its references and unsupported claims are easier to catch.

## Evaluation

I measured retrieval separately from generation, using a labeled question set with paraphrased variants and three metrics: **Recall@3, Precision@3, and MRR@3**. I compared dense-only and hybrid retrieval, both before and after the move to Cosmos DB.

On the initial 10-question set, hybrid retrieval scored:

| Metric | Hybrid retrieval |
|---|---:|
| Recall@3 | **100%** |
| Precision@3 | **70%** |
| MRR@3 | **0.95** |

Hybrid beat dense-only on that set and kept the same scores after the cloud migration. Ten questions is a small sample, so I treat this as a regression check rather than a benchmark.

## Deployment

- Containerized the FastAPI app with Docker, built **linux/amd64** images, and pushed versioned images to **Azure Container Registry**.
- Deployed to **Azure Container Apps** behind a public HTTPS endpoint, with environment variables, Azure-managed secrets, and CORS locked to this site.
- The backend reaches Cosmos DB through a **Microsoft Entra managed identity with Cosmos DB role-based access control**, so no database credentials live in the code.

## A database-driven portfolio

The same backend has a content API. A public-filtered `/content/experience` endpoint serves structured experience records from Cosmos DB. This Astro site, hosted on GitHub Pages, fetches them in the browser and updates the experience cards by ID, falling back to build-time content if the API is unavailable. Editing a record in Cosmos DB shows up on the live site after a refresh, with no rebuild or redeploy.

## Takeaways

- Evaluate retrieval on its own before judging the LLM's answers. Most bad answers start as bad retrieval.
- Keep source references consistent from chunking through to the final response.
- Keep a clean split between frontend and backend: API keys and database access stay on the server, and the browser only sees a public API URL.

**Next:** an incremental indexing pipeline on the **Cosmos DB change feed**, so that edits to portfolio records automatically refresh the vector embeddings and the BM25 index. This is planned and not built yet.

**Stack:** Python · FastAPI · Sentence Transformers · BM25 · Azure Cosmos DB · Azure Container Apps · Azure Container Registry · Docker · Groq · Astro
