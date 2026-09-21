---
title: "End-to-End Electricity Load Forecasting"
summary: "Four models compared for hourly electricity forecasting under walk-forward validation — XGBoost wins at 0.81% MAPE."
role: "Builder"
period: "2025"
domain: ml
domainLabel: "Time-Series ML"
tags: ["XGBoost", "LSTM", "Prophet", "Temporal Fusion Transformer", "SHAP"]
featured: true
order: 3
github: "https://github.com/bachnguyennn/Energy-Demand-Prediction"
experiment: "energy_load_forecast"
domainTag: "time-series"
headline: "XGBoost wins at 0.81% MAPE"
year: 2025
---

> **TL;DR —** A four-model bake-off for hourly electricity forecasting; gradient-boosted trees on lag features win at 0.81% MAPE — exactly what the data's auto-regressive structure predicted.

## The question I wanted to answer

Electricity can't be stored cheaply, so grid operators have to predict demand *before* it happens — a forecast that's off by a few percent means either wasted generation or a shortfall. I wanted to answer a practical question: **how accurately can I forecast hourly electricity demand a day ahead, and which modelling approach actually wins — a classic statistical model, gradient boosting, or deep learning?**

Rather than assume deep learning is best, I decided to put four very different models on the *same* footing and let the validation decide.

## Getting to know the data

I used the **PJM hourly consumption** dataset. Exploring it, the structure of electricity demand is striking and very regular:

- **Strong daily and weekly seasonality** — demand rises and falls with the working day and dips on weekends.
- **It's intensely auto-regressive** — this hour's load looks a lot like last hour's. The autocorrelation at a 1-hour lag is enormous, and there are clear echoes at 24h and 168h (a day and a week).

That last insight basically wrote the feature engineering for me: if the recent past predicts the near future this strongly, then **lag features** (1h, 24h, 168h), rolling statistics, and cyclical time encodings should carry most of the signal — with holiday flags to catch the irregular dips.

## How I thought about it

Two decisions mattered most:

1. **Validation that can't cheat.** With time series, a random train/test split leaks the future into the past. I used **3-fold walk-forward validation** — train on the past, test on the next 30 days, roll forward — which mirrors how a forecast is actually used in production.
2. **A fair, diverse bake-off.** I pitted four models against each other so I could reason about *why* one wins, not just *that* it does:
   - **Prophet** — statistical baseline (trend + seasonality curve-fitting)
   - **XGBoost** — gradient-boosted trees on the engineered lag features
   - **LSTM** — a recurrent net that learns temporal dependencies
   - **Temporal Fusion Transformer** — a modern multi-horizon deep model

## What I found

The results lined up exactly with what the EDA hinted — the models that exploit recent history win decisively:

| Model | MAE (MW) | MAPE |
|---|---:|---:|
| Prophet (baseline) | 1,396.96 | 9.00% |
| **XGBoost** | **125.09** | **0.81%** |
| LSTM | 170.69 | 1.11% |
| Temporal Fusion Transformer | 896.78 | 5.53% |

![Model comparison across MAE, RMSE and MAPE](../../assets/projects/energy-demand-forecasting/model-comparison.png)

XGBoost lands at **0.81% MAPE** — because the `lag_1h` feature directly captures that auto-regressive structure. Prophet captures the broad daily/weekly shape but misses the sharp hourly turns (it's curve-fitting, not using recent load). The TFT underfit here on a deliberately short training budget — a reminder that a more powerful model isn't automatically a better one.

![XGBoost and LSTM predictions vs actual load over a week](../../assets/projects/energy-demand-forecasting/predictions.png)

A SHAP check confirmed the story: the short-term lag features dominate the model's decisions, just as the autocorrelation analysis predicted.

![SHAP feature importance for the XGBoost forecaster](../../assets/projects/energy-demand-forecasting/shap.png)

## Takeaways

For this problem, **boosted trees on well-engineered lag features beat the fancier deep models** — and the EDA told me why before I trained anything. The biggest lever wasn't model choice, it was honest validation and features that respect the data's structure. Next step would be folding in **weather data**, which is the obvious missing driver of demand.

**Stack:** XGBoost · PyTorch (LSTM) · PyTorch Forecasting (TFT) · Prophet · SHAP · pandas
