---
title: "FastText Subword Embeddings from Scratch"
shortTitle: "FastText Subword Embeddings"
summary: "Skip-Gram and FastText word embeddings implemented from scratch in PyTorch, compared under identical settings and benchmarked against official pretrained vectors."
problem: "Measure what FastText's character n-grams actually add over plain Skip-Gram when everything else is held constant."
categories: [ml]
status: complete
role: "Sole developer"
period: "2025"
year: 2025
order: 8
stack: ["Python", "PyTorch", "Gensim (baselines)", "scikit-learn", "t-SNE"]
result:
  value: "100%"
  label: "WordSim-353 coverage with subwords"
  context: "Against 99.4% for Skip-Gram. Analogy accuracy rose from 8.3% to 11.3%; both trail web-scale vectors (~71%)."
github: "https://github.com/bachnguyennn/Fast-Text-Embedding-System"
cover: "../../assets/projects/fasttext-embeddings/tsne-skipgram.png"
coverAlt: "A t-SNE projection of the from-scratch embeddings with related words clustered together."
---

## Overview

Most people use word embeddings; fewer can explain why they work. I built the full stack myself, with no `gensim.load()`, to answer one question: **does FastText's idea of splitting words into character n-grams help over plain Skip-Gram when both are trained identically?** Then I ran official pretrained models through the same evaluation scripts to see the real gap.

## Data

**text8**, the first 100 MB of Wikipedia (about 17 million tokens).

- The vocabulary is Zipfian, so I applied frequency subsampling to stop the model spending its capacity on "the" and "of".
- Splitting words into 3–6 character n-grams with `<` and `>` boundary markers produced **333,000 unique n-grams**, against a 71,000-word vocabulary. That is the cost of subwords.

## Approach

I implemented tokenizer → subword hashing → **Skip-Gram with negative sampling** → training on Apple MPS → `.vec` export → the same evaluation scripts used for the baselines.

The key experiment was a controlled comparison: **Skip-Gram against FastText with identical settings** (300 dimensions, 10 epochs, same corpus). The boundary markers matter: without them, the `her` inside `where` would share a vector with `her` in `there` and `other`.

![Training loss curves for Skip-Gram and FastText](../../assets/projects/fasttext-embeddings/training-loss.png)

## Results

| Model | WordSim ρ | Analogy | Coverage |
|---|---:|---:|---:|
| Skip-Gram (mine) | **0.60** | 8.3% | 99.4% |
| FastText (mine) | 0.56 | **11.3%** | **100%** |
| FastText (official) | 0.70 | 71.3% | 100% |
| GloVe 300d | 0.61 | 71.7% | 100% |

The analogy gap to official vectors (~11% against ~71%) comes from **data scale**: text8 is tiny next to web-scale corpora. Running the official models through my scripts rules out an evaluation bug.

Subwords did not win everywhere. They helped on **coverage** (every test pair gets a vector) and **morphology**: FastText's nearest neighbours group word forms that share stems and affixes.

![Nearest-neighbour similarity: Skip-Gram against FastText](../../assets/projects/fasttext-embeddings/neighbors.png)

![t-SNE projection of the from-scratch Skip-Gram embeddings](../../assets/projects/fasttext-embeddings/tsne-skipgram.png)

## What I learned

Implementing a paper and designing a controlled experiment around it taught me more than a leaderboard number would have. Subwords paid off exactly where the theory says they should, and the gap to pretrained models is a data-budget story, not an implementation one.
