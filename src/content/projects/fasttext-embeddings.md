---
title: "FastText Subword Embeddings from Scratch"
summary: "Word embeddings built from scratch to test whether subword n-grams beat Skip-Gram — they win on coverage and morphology."
role: "Builder"
period: "2025"
domain: ml
domainLabel: "NLP / Representation Learning"
tags: ["PyTorch", "Word Embeddings", "Skip-Gram", "FastText", "t-SNE"]
featured: false
order: 6
github: "https://github.com/bachnguyennn/Fast-Text-Embedding-System"
experiment: "fasttext_embeddings"
domainTag: "nlp"
headline: "subword n-grams beat skip-gram"
year: 2025
---

> **TL;DR —** Word embeddings built from scratch to test whether FastText's character n-grams beat plain Skip-Gram — they win on coverage and morphology, with an honest accounting of the gap to web-scale pretrained models.

## The question I wanted to answer

Most people *use* word embeddings; far fewer can explain *why* they work. I wanted to close that gap for myself by building word vectors from absolute scratch — no `gensim.load()` — and answering a concrete question: **does FastText's big idea (breaking words into character n-grams) actually buy you anything over plain Skip-Gram, when both are trained under identical conditions?**

And I wanted to benchmark my home-grown models against the real, pretrained ones — and report the gap honestly instead of hiding it.

## Getting to know the data

I trained on **text8** — the first 100MB of Wikipedia, about 17 million tokens. Exploring it shaped two design choices:

- The vocabulary is **Zipfian** — a handful of words appear constantly, a huge tail appears a few times. I applied frequency subsampling so the model doesn't waste all its capacity on "the" and "of."
- Once I split words into character n-grams (3–6 chars, with `<` `>` boundary markers), the subword vocabulary exploded to **333,000 unique n-grams** — far bigger than the 71k word vocab. That's the cost of subwords, and it had to be worth paying.

## How I thought about it

I implemented the full stack myself so I could trace a single token end-to-end: tokenizer → subword hashing → **Skip-Gram with negative sampling** → training on Apple MPS → `.vec` export → the *same* evaluation scripts I'd run on the baselines.

The key experiment was a controlled A/B: **Skip-Gram vs FastText on identical settings** (300d, 10 epochs, same corpus). One detail I was careful about: FastText wraps each word in boundary markers (`where` → `<where>`) so that prefix/suffix n-grams are distinct from interior ones — without that, the substring `her` inside `where` would collide with `there`, `other`, and create cross-word noise.

Both models trained cleanly to convergence:

![Training loss curves for Skip-Gram and FastText](../../assets/projects/fasttext-embeddings/training-loss.png)

## What I found

Benchmarked on WordSim-353 and the Google analogy task, against official pretrained vectors:

| Model | WordSim ρ | Analogy | Coverage |
|---|---:|---:|---:|
| Skip-Gram (mine) | **0.60** | 8.3% | 99.4% |
| FastText (mine) | 0.56 | **11.3%** | **100%** |
| FastText (official) | 0.70 | 71.3% | 100% |
| GloVe 300d | 0.61 | 71.7% | 100% |

The honest gap is the analogy score: ~11% vs ~71%. But that gap is about **data scale** (text8 is tiny vs web-scale corpora), *not* a bug — proven by running official models through my exact scripts.

The more interesting finding is **where subwords actually helped.** Not on every metric — but on **coverage** (100% of test pairs get a vector) and **morphology**. FastText's nearest neighbours cluster word *forms* together because character n-grams capture shared stems and affixes:

![Nearest-neighbour cosine similarity: Skip-Gram vs FastText](../../assets/projects/fasttext-embeddings/neighbors.png)

Projecting the learned vectors with t-SNE shows real lexical structure emerging from scratch:

![t-SNE projection of the from-scratch Skip-Gram embeddings](../../assets/projects/fasttext-embeddings/tsne-skipgram.png)

## Takeaways

Subwords didn't beat Skip-Gram on every scalar — they paid off specifically in **coverage and morphology**, exactly where the theory says they should. The portfolio claim here isn't a leaderboard number; it's that I can implement the paper correctly, design a controlled experiment, and interpret the result — including being clear that the gap to pretrained models is a data-budget story, not an implementation one.

**Stack:** PyTorch (Apple MPS) · Gensim (baselines only) · scikit-learn · t-SNE
