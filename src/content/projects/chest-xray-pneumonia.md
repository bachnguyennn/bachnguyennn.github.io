---
title: "Interpretable Chest X-Ray Pneumonia Detection"
shortTitle: "Chest X-Ray Pneumonia Detection"
summary: "A ResNet50 classifier for pediatric chest X-rays, tuned for high pneumonia recall, with Grad-CAM and Eigen-CAM overlays to check what the model is looking at."
problem: "Build a screening-style classifier where missing a pneumonia case costs more than a false alarm, and make its evidence inspectable."
categories: [ml, cv]
status: complete
statusNote: "Research prototype. Not validated or intended for clinical use."
role: "Sole developer"
period: "2025"
year: 2025
order: 3
featured: true
stack: ["Python", "PyTorch", "torchvision", "ResNet50", "Grad-CAM", "scikit-learn"]
result:
  value: "96.9%"
  label: "Pneumonia recall (378 / 390)"
  context: "Official Kaggle test split (624 images). Specificity is 79.5%: 48 of 234 normal images were flagged."
github: "https://github.com/bachnguyennn/Chest_X-Pneumonia-Detection"
cover: "../../assets/projects/chest-xray-pneumonia/gradcam.png"
coverAlt: "A chest X-ray next to its Grad-CAM and Eigen-CAM heatmaps, with activation concentrated over the lung fields."
resume:
  - "Fine-tuned an ImageNet-pretrained ResNet50 on pediatric chest X-rays with weighted sampling and a weighted loss, selecting checkpoints by validation F1."
  - "Reached 96.9% pneumonia recall and 0.975 PR-AUC on the held-out test split, and documented the trade-off: 79.5% specificity."
  - "Added Grad-CAM and Eigen-CAM overlays and reviewed false negatives and false positives to see where the model fails."
---

> For research and education only. This model is not validated for, or intended for, clinical diagnosis.

## Overview

A ResNet50 classifier that labels pediatric chest X-rays as normal or pneumonia. The question I cared about was not "what is the highest accuracy?" but "if this were a screening tool, which mistake is acceptable?" A missed pneumonia is worse than a false alarm, so the model is tuned for recall, and every prediction comes with a heatmap showing which part of the image drove it.

## The problem

The dataset is the public Kaggle pediatric chest X-ray set (Guangzhou Women and Children's Medical Center). Two things shaped the design:

1. **Class imbalance.** There are far more pneumonia images than normal ones, so a model that always predicts pneumonia already looks accurate. Accuracy could not be the headline metric.
2. **Shortcut risk.** Contrast, positioning, and burned-in markers vary between images. A CNN can learn those cues instead of the lungs, and the metrics would not show it.

## Approach

- **Backbone:** ResNet50 with ImageNet weights. The head is trained first with the backbone frozen, then later blocks are fine-tuned.
- **Imbalance:** weighted random sampling plus weighted cross-entropy.
- **Model selection:** the best checkpoint by validation **F1**, not accuracy.
- **Interpretability:** Grad-CAM (gradient-based) and Eigen-CAM (activation-based) overlays from the last convolutional block.

## Results

Evaluated once on the official test split (624 images: 390 pneumonia, 234 normal) with the saved best checkpoint.

| Metric | Value |
|---|---:|
| Pneumonia recall (sensitivity) | **96.9%** |
| Specificity | 79.5% |
| Precision (pneumonia) | 88.7% |
| PR-AUC | 0.975 |
| ROC-AUC | 0.965 |
| Accuracy | 90.4% |

![Confusion matrix on the test split](../../assets/projects/chest-xray-pneumonia/confusion-matrix.png)

The confusion matrix shows the trade-off I chose: **12 missed pneumonias** against **48 normal images flagged**. Because the classes are imbalanced, the precision-recall curve is the more informative view of ranking quality:

![Precision-recall curve for the pneumonia class](../../assets/projects/chest-xray-pneumonia/pr-curve.png)

## Checking what the model attends to

The overlays put the original image next to the gradient-based and activation-based evidence maps. In the correct prediction below, activation sits over the lung fields rather than the image border or text markers. I also went through the 12 false negatives and 48 false positives, because those are the cases that show where the model would be unreliable.

![Grad-CAM and Eigen-CAM overlays on a correct prediction](../../assets/projects/chest-xray-pneumonia/gradcam.png)

## Limitations

- **One dataset, one hospital.** No external validation, so there is no evidence the model generalizes to other scanners, sites, or adult patients.
- **Heatmaps are a sanity check, not proof.** Grad-CAM shows where gradients concentrate, not that the model's reasoning is medically correct.
- **Threshold and calibration.** The operating point was not calibrated for a real prevalence. Any clinical use would need calibration, threshold selection with clinicians, and prospective validation.

## What I learned

Choosing the error to minimize before training mattered more than the architecture. Once recall was the goal, imbalance handling, F1-based checkpointing, and reading the failure cases followed naturally.
