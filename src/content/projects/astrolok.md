---
title: "AstroLoc-ML — Deep-Learning Plate Solver"
summary: "Can a CNN plate-solve the night sky from raw pixels? An honest end-to-end attempt — and why geometry beats deep learning here."
role: "Researcher & Builder"
period: "2025"
domain: cv
domainLabel: "Deep Learning / Astronomy"
tags: ["PyTorch", "EfficientNet", "Spherical Regression", "Synthetic Data"]
featured: false
order: 5
github: "https://github.com/bachnguyennn/astro-ml"
experiment: "astroloc_ml"
domainTag: "cv"
headline: "geometry beats deep learning here"
year: 2025
---

> **TL;DR —** Can a CNN plate-solve the night sky from raw pixels? No — and the clean negative result shows exactly why geometric matching, not deep learning, is the right tool for the job.

## The question I wanted to answer

"Plate solving" is the task of looking at a photo of the night sky and figuring out *exactly where the camera was pointing* — its right ascension, declination, rotation, and field of view. Classical solvers do this by matching star patterns. I wanted to ask a research question: **can a neural network learn to plate-solve end-to-end, straight from pixels — and if I'm honest about the results, what does that teach me about where deep learning helps and where it doesn't?**

I committed up front to reporting the real outcome, good or bad.

## Getting to know the data

Real labelled night-sky images are scarce, so I built a **synthetic data pipeline** from the HYG star catalogue (~41,500 stars). Exploring the catalogue and the renderer was half the project.

The stars aren't evenly spread — the Milky Way's band and catalogue depth create real structure across the sky:

![Sky coverage of the star catalogue](../../assets/projects/astrolok/sky-coverage.png)

And star brightness follows a steep distribution — a few bright anchors, many faint ones — which determines what's even visible in a given frame:

![Magnitude distribution of catalogue stars](../../assets/projects/astrolok/mag-distribution.png)

To make training images, I rendered star fields with **gnomonic (tangent-plane) projection** — the geometrically correct projection for a small field of view — splatting magnitude-weighted Gaussian blobs and layering in realistic photon and read noise:

![Rendered fields of view at different scales](../../assets/projects/astrolok/fov-grid.png)

## How I thought about it

The most interesting design problem was the *output*. My first instinct — regress raw angles (RA, Dec, rotation) — failed badly: angles wrap around (359° and 1° are neighbours), so the loss had a discontinuity and the network wandered off predicting nonsense like RA = −117°.

The fix is the standard trick for any rotational/spherical target: predict **(sin, cos) pairs** and reconstruct the angle with `atan2`. That mapping is smooth and continuous, so the loss landscape becomes smooth too. I paired it with a **three-phase transfer-learning** schedule on an EfficientNet-B0 backbone (train head → unfreeze later blocks → optional real-image fine-tune).

## What I found

Here's where the honesty matters. The training loss fell smoothly — but the *angular error* barely moved:

![Three-phase training curves](../../assets/projects/astrolok/training-curves.png)

| Run | Train samples | Best angular error | Within 5° |
|---|---:|---:|---:|
| Fast | 5,000 | 65.6° | 1.7% |
| Standard (sin/cos) | 20,000 | 76.6° | 0.2% |

A random guess on a sphere averages ~90°. My model got to ~65–77°: **barely better than random.** When you overlay the model's predicted sky position onto the real stars, they simply don't line up:

![Predicted field overlaid on the actual stars — they don't match](../../assets/projects/astrolok/demo-overlay.png)

## Why it didn't work

Digging into *why* was the real payoff. Three causes converged: (1) ImageNet features don't transfer to star fields — dots on black are wildly out-of-distribution; (2) 20k synthetic samples isn't nearly enough for a 5M-parameter model; and most fundamentally, (3) **plate solving is a geometric-matching problem, not a feature-learning one.** Recognising "that's Orion's belt" and triangulating from it is exactly what classical asterism matching does well and what a generic CNN does poorly.

So I also built the **classical triangle-hash solver** (the same approach Astrometry.net uses) as the baseline — and it works. The takeaway I value most from this project: knowing *when not to reach for deep learning* is itself a skill, and a clean negative result with a clear explanation is worth more than a vague positive one.

**Stack:** PyTorch · EfficientNet-B0 · OpenCV · NumPy · gnomonic projection
