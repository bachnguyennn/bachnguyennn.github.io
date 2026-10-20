---
title: "Hospital Readmission Risk Model"
summary: "A 30-day readmission model for diabetic patients where the evaluation design matters more than the score: patient-level deduplication, an ordered hold-out, and AUPRC-first metrics."
problem: "Predict a rare clinical outcome without the patient leakage and optimistic metrics that make many results on this dataset look better than they are."
categories: [ml]
status: complete
role: "Sole developer"
period: "2025"
year: 2025
order: 6
stack: ["Python", "XGBoost", "LightGBM", "scikit-learn", "Optuna", "SHAP"]
result:
  value: "0.128"
  label: "AUPRC, XGBoost"
  context: "Against a no-skill baseline of about 0.09, the positive rate. AUROC 0.634."
github: "https://github.com/bachnguyennn/Hospital_Readmission_prediction"
resume:
  - "Modeled 30-day readmission risk across ~100k patient encounter records, keeping one encounter per patient and encoding high-cardinality diagnosis and medication fields."
  - "Held out the last 20% of encounters by encounter ID and scored with AUPRC on a 9% positive class: XGBoost reached 0.128 against a ~0.09 no-skill baseline."
  - "Applied SHAP to identify leading risk drivers, including admission complexity, prior admissions, and medication count."
---

## Overview

A model that predicts whether a diabetic patient will be readmitted within 30 days, built on the UCI "Diabetes 130-US hospitals" dataset (~100,000 encounters). I treated it mainly as an exercise in not fooling myself: this dataset makes it easy to report a flattering number for the wrong reasons.

## The problem

Three properties of the data drove every decision:

1. **Rare outcome.** Only about 9% of encounters end in a 30-day readmission. A model that predicts "no readmission" for everyone is 91% accurate and useless.
2. **Repeat patients.** The same patient appears many times. A random split puts the same person in train and test, and the model gets credit for recognizing them.
3. **Messy, high-cardinality fields.** Thousands of diagnosis codes, two dozen medication columns, and missing values coded as `?`.

## Approach

- **One encounter per patient.** I kept each patient's first encounter, so no person appears on both sides of the split.
- **Ordered hold-out.** Encounters are sorted by `encounter_id` and the last 20% form the test set. The dataset has no admission dates, so this is a proxy for time order, not a verified chronological split (see limitations).
- **AUPRC as the headline metric.** With 9% positives, ROC-AUC looks good easily; precision-recall focuses on the class that matters. For reference, a random classifier scores an AUPRC equal to the positive rate, about 0.09.
- **Models:** logistic regression as the baseline, then XGBoost and LightGBM with Optuna tuning and class weighting (SMOTE as a fallback).

## Results

| Model | AUPRC | AUROC | F1 |
|---|---:|---:|---:|
| **XGBoost** | **0.128** | **0.634** | **0.168** |
| LightGBM | 0.120 | 0.621 | 0.164 |
| Logistic regression | 0.100 | 0.603 | 0.150 |

![Precision-recall curve on the hold-out set](../../assets/projects/hospital-readmission/pr-curve.png)

The numbers are modest. XGBoost's AUPRC is about 1.4× the no-skill baseline, and the gain over logistic regression is small. That is a realistic picture of what structured administrative data can predict here once repeat patients are removed.

SHAP on the LightGBM model pointed to **admission complexity, prior admissions, and total medications** as the strongest drivers, which match clinical intuition:

![SHAP beeswarm for the LightGBM model](../../assets/projects/hospital-readmission/shap-beeswarm.png)

## Limitations

- **The split is ordered by ID, not by date.** `encounter_id` ordering may roughly follow time, but the dataset does not document that. I would not call this a chronological validation, and some temporal leakage cannot be ruled out.
- **First-encounter deduplication changes the population.** The model is evaluated on first visits only, which have fewer prior-history signals than the full set of encounters.
- **One hold-out, no confidence intervals.** The differences between XGBoost and LightGBM are within what a different split could change.
- **No fairness audit.** Performance across demographic groups was not examined, which would be required before any real use.

## What I learned

The evaluation design is the result. Deduplicating by patient and picking the metric for the base rate changed the story more than any model choice, and writing down what the split does *not* guarantee is part of the job.

**Next:** survival analysis (time to readmission instead of a 30-day flag), bootstrap intervals on the hold-out metrics, and a subgroup fairness check.
