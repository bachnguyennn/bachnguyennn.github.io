---
title: "AstroLoc-ML: Can a CNN Plate-Solve the Sky?"
shortTitle: "AstroLoc-ML"
summary: "An end-to-end attempt to regress a camera's sky position from raw star-field pixels, with a synthetic data pipeline, and a clear negative result explained."
problem: "Test whether deep learning can replace geometric star-pattern matching for locating where a telescope image points."
categories: [cv, research]
status: experimental
statusNote: "Negative result: the CNN performed close to random; the classical solver works."
role: "Sole developer"
period: "2025"
year: 2025
order: 9
stack: ["Python", "PyTorch", "EfficientNet", "OpenCV", "NumPy"]
result:
  value: "65.6°"
  label: "best mean angular error"
  context: "A random guess on the sphere averages about 90°. The classical triangle-hash solver succeeds."
github: "https://github.com/bachnguyennn/astro-ml"
---

## Overview

"Plate solving" means looking at a photo of the night sky and working out exactly where the camera was pointing: right ascension, declination, rotation, and field of view. Classical solvers match star patterns. I asked whether a neural network could learn the task end to end from pixels, and committed in advance to reporting the outcome either way.

## Data

Real labeled sky images are scarce, so I built a **synthetic data pipeline** from the HYG star catalogue (~41,500 stars). The catalogue has real structure, such as the Milky Way band and uneven depth:

![Sky coverage of the star catalogue](../../assets/projects/astrolok/sky-coverage.png)

Brightness follows a steep distribution: a few bright anchors and many faint stars, which decides what is visible in a frame.

![Magnitude distribution of catalogue stars](../../assets/projects/astrolok/mag-distribution.png)

Training images use **gnomonic (tangent-plane) projection**, the geometrically correct projection for a small field of view, with magnitude-weighted Gaussian stars and photon and read noise.

![Rendered fields of view at different scales](../../assets/projects/astrolok/fov-grid.png)

## Approach

The hardest design problem was the output. Regressing raw angles failed: 359° and 1° are neighbours, so the loss has a discontinuity, and the network drifted to impossible values like RA = −117°. The fix is the standard one for rotational targets: predict **(sin, cos)** pairs and recover the angle with `atan2`, which makes the target continuous. I used an EfficientNet-B0 backbone with a three-phase transfer schedule: train the head, unfreeze later blocks, then optionally fine-tune on real solved images.

## Results

The training loss fell smoothly, but the angular error barely moved:

![Three-phase training curves](../../assets/projects/astrolok/training-curves.png)

| Run | Training samples | Best angular error | Within 5° |
|---|---:|---:|---:|
| Fast | 5,000 | 65.6° | 1.7% |
| Standard (sin/cos) | 20,000 | 76.6° | 0.2% |

A random guess on a sphere averages about 90°, so the model is barely better than chance. Overlaying a predicted field on the real stars makes it obvious:

![Predicted field overlaid on the actual stars; they do not line up](../../assets/projects/astrolok/demo-overlay.png)

## Why it did not work

Three causes combine. ImageNet features do not transfer to points of light on black. 20,000 synthetic samples are far too few for a 5M-parameter model. Most importantly, **plate solving is a geometric matching problem**, not a feature-learning one. Recognizing an asterism and triangulating from it is exactly what classical matching does well.

So I also built the classical **triangle-hash solver**, the approach Astrometry.net uses, as the baseline, and it works.

## What I learned

Knowing when not to use deep learning is a skill. A negative result with a clear explanation was more useful to me than a vague positive one.
