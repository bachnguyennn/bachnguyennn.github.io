---
title: "Interpretable Chest X-Ray Pneumonia Detection"
summary: "A ResNet50 pneumonia screener tuned for 96.9% recall, with Grad-CAM overlays to show where it's looking."
role: "Builder"
period: "2025"
domain: cv
domainLabel: "Medical Computer Vision"
tags: ["PyTorch", "ResNet50", "Transfer Learning", "Grad-CAM", "Explainability"]
featured: true
order: 2
github: "https://github.com/bachnguyennn/Chest_X-Pneumonia-Detection"
experiment: "chest_xray_pneumonia"
domainTag: "cv"
headline: "96.9% recall + Grad-CAM"
year: 2025
---

> **TL;DR —** A ResNet50 pneumonia screener tuned for 96.9% recall — catching almost every case — with Grad-CAM overlays so you can see it's looking at the lungs, not the labels.

> For research and education only — not validated or intended for clinical diagnosis.

## The question I wanted to answer

I wanted to build a pneumonia screener for chest X-rays — but the framing I cared about wasn't "what's the highest accuracy?" It was: **if this were a real screening tool, what kind of mistake is acceptable?**

In screening, a *missed* pneumonia case (false negative) is far more dangerous than a false alarm (false positive). So the question I actually set out to answer was: *can I build a model that catches almost every pneumonia case, stays honest about its false alarms, and can show me where it's looking so I can trust it?*

## Getting to know the data

The dataset is the Kaggle pediatric chest X-ray set (Guangzhou Women and Children's Medical Center). Two things jumped out during exploration:

1. **It's imbalanced** — there are far more pneumonia images than normal ones. A model that just guesses "pneumonia" would score deceptively well on accuracy. That immediately ruled out accuracy as my headline metric.
2. **The images vary in contrast, positioning, and artifacts** — normal anatomical variation can genuinely *look* like opacity. This is exactly the kind of thing that fools a model into learning the wrong cue (a label in the corner, the image border) instead of the lungs.

These two observations set the whole design: I needed imbalance handling, a precision-recall view of performance, and — critically — a way to *see what the model attends to.*

## How I thought about it

- **Backbone:** ResNet50 with ImageNet transfer learning — strong features, stable training, and a clean final conv block that's ideal for class-activation maps.
- **Imbalance:** weighted random sampling + weighted cross-entropy, so the minority "normal" class isn't drowned out.
- **Training:** freeze the backbone and train the head first, then fine-tune later layers, saving the best checkpoint by validation **F1** (not accuracy).
- **The tradeoff, made on purpose:** I tuned toward high pneumonia recall, accepting more false positives. In a screening context that's the *right* error to make.
- **Trust:** I added **Grad-CAM and Eigen-CAM** overlays so every prediction comes with a visual of where the model's evidence came from.

## What I found

On the held-out test split:

| Metric | Value |
|---|---:|
| Accuracy | 90.4% |
| ROC-AUC | 96.5% |
| PR-AUC | 97.5% |
| **Pneumonia recall** | **96.9%** |

The model catches **96.9% of pneumonia cases** — exactly the behaviour I designed for. The confusion matrix shows the tradeoff working as intended: very few missed pneumonias (12), at the cost of more false alarms (48 normals flagged):

![Confusion matrix on the test split](../../assets/projects/chest-xray-pneumonia/confusion-matrix.png)

Because the classes are imbalanced, the precision-recall curve is the honest view of ranking quality:

![Precision-Recall curve for the pneumonia class](../../assets/projects/chest-xray-pneumonia/pr-curve.png)

Then the part I care about most — *is it looking at the lungs, or cheating?* The Grad-CAM / Eigen-CAM overlays put the original X-ray next to gradient-based and activation-based evidence maps:

![Grad-CAM and Eigen-CAM overlays on a correct prediction](../../assets/projects/chest-xray-pneumonia/gradcam.png)

## Takeaways

The model does what a screener should: high sensitivity, with its reasoning on display. But I also documented its **failure cases** — the 12 false negatives and 48 false positives — because in medical AI those are the most important images to study, and they show exactly where the model would be unreliable. It's a strong research prototype, not a clinical device, and I'm explicit about that. What I took away: defining the *right* error before training mattered more than any architecture choice.

**Stack:** PyTorch · torchvision · pytorch-grad-cam · scikit-learn · Gradio demo
