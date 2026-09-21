---
title: "Hospital Readmission Risk Model"
summary: "30-day readmission prediction where the methodology is the point: leakage-free validation over a flattering number."
role: "Builder"
period: "2025"
domain: ml
domainLabel: "Clinical ML"
tags: ["LightGBM", "XGBoost", "AUPRC", "Optuna", "SHAP"]
featured: false
order: 4
github: "https://github.com/bachnguyennn/Hospital_Readmission_prediction"
experiment: "hospital_readmission"
domainTag: "clinical-ml"
headline: "leakage-free > flattering AUC"
year: 2025
---

> **TL;DR —** A 30-day readmission model where the methodology is the point: temporal validation, deduplication, and AUPRC-first scoring earn an honest 0.128 instead of a leaky, inflated number.

## The question I wanted to answer

Hospital readmissions are expensive and often preventable. A 30-day readmission usually means something was missed at discharge — so hospitals have a real incentive to flag high-risk patients early. The question I set out to answer: **can I predict which diabetic patients will be readmitted within 30 days — and, just as importantly, can I do it in a way that wouldn't fall apart in the real world?**

This project is less about chasing a big number and more about *not fooling myself*, because clinical data makes it very easy to do exactly that.

## Getting to know the data

I used the well-known UCI diabetes dataset (~100k encounters). Three things I found during exploration completely shaped the approach:

1. **Severe class imbalance** — only ~9% of patients are readmitted within 30 days. Accuracy is meaningless here; a model that says "no one comes back" is 91% accurate and 100% useless.
2. **The same patient appears multiple times.** If I split naively, a patient could land in both train and test — the model would "remember" them and inflate its score.
3. **High-cardinality, messy fields** — diagnosis codes, medication columns, missing values everywhere.

## How I thought about it

Each of those findings became a deliberate design decision:

- **Temporal validation.** I sorted encounters chronologically and held out the last 20% — mirroring a real deployment where you train on the past and predict the future, never the reverse.
- **First-encounter deduplication.** I kept only each patient's first visit, so no identity leaks across the split.
- **AUPRC as the headline metric.** With 9% positives, ROC-AUC is overly flattering; the precision-recall curve focuses on the rare class that actually matters.
- **Models + tuning:** XGBoost, LightGBM, and a logistic-regression baseline, with Optuna for hyperparameters and SMOTE/class-weighting to handle the imbalance.

## What I found

| Model | AUPRC | AUROC | F1 |
|---|---:|---:|---:|
| **XGBoost** | **0.128** | **0.634** | **0.168** |
| LightGBM | 0.120 | 0.621 | 0.164 |
| Logistic Regression | 0.100 | 0.603 | 0.150 |

![Precision-Recall curve](../../assets/projects/hospital-readmission/pr-curve.png)

These numbers are *modest* — and that's honest. This is a famously hard benchmark, and once you remove the leakage that inflates a lot of published attempts, the real ceiling is low. The value here is a pipeline that earns its number rather than borrowing it from a leaky split.

A SHAP analysis made the model interpretable for a clinical audience — the strongest drivers of readmission risk were **admission complexity, prior admissions, and total medications**, which line up with clinical intuition:

![SHAP beeswarm for the LightGBM model](../../assets/projects/hospital-readmission/shap-beeswarm.png)

## Takeaways

The methodology *is* the project: temporal splits, deduplication, and AUPRC-first evaluation are what make the result trustworthy. I'd rather report a real 0.128 than a leaky 0.4. Next steps would be survival analysis (time-to-readmission instead of a binary flag) and a fairness audit across demographic groups before anything like this went near a real workflow.

**Stack:** LightGBM · XGBoost · scikit-learn · Optuna · SHAP · SMOTE
