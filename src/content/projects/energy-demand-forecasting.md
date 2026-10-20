---
title: "Electricity Load Forecasting"
summary: "Prophet, XGBoost, an LSTM, and a Temporal Fusion Transformer compared on hourly PJM load under the same walk-forward validation."
problem: "Find out which model family actually forecasts hourly electricity demand best when every model is validated the same, leak-free way."
categories: [ml]
status: complete
role: "Sole developer"
period: "2025"
year: 2025
order: 5
featured: false
stack: ["Python", "XGBoost", "PyTorch", "PyTorch Forecasting", "Prophet", "SHAP", "pandas"]
result:
  value: "0.81%"
  label: "MAPE, XGBoost, one hour ahead"
  context: "Mean over 3 walk-forward folds of 30 days each, PJM AEP hourly load."
github: "https://github.com/bachnguyennn/Energy-Demand-Prediction"
resume:
  - "Compared Prophet, XGBoost, an LSTM, and a Temporal Fusion Transformer for hourly load forecasting with 3-fold walk-forward validation on PJM data."
  - "Engineered lag (1 h, 24 h, 168 h), rolling, cyclical-time, and holiday features; XGBoost reached 0.81% MAPE one hour ahead, and SHAP confirmed the short lags dominate."
---

## Overview

Grid operators have to predict demand before it happens. I wanted to compare a statistical model, gradient boosting, and two deep learning models on the same footing and let the validation, not my expectations, decide. The data is PJM's hourly load for the AEP region.

## The problem

Electricity demand is very regular: strong daily and weekly cycles, dips on holidays, and enormous autocorrelation. This hour's load looks a lot like last hour's, with clear echoes at 24 and 168 hours. That structure suggests the features before any model is trained: **lags** at 1, 24, and 168 hours, rolling statistics, cyclical encodings of hour and weekday, and holiday flags.

## Approach

- **Walk-forward validation.** A random split leaks the future into training. Each of 3 folds trains on everything before a cut-off and tests on the next 30 days, then the window rolls forward.
- **Four model families:**
  - **Prophet:** trend plus seasonality curve fitting; does not use recent load.
  - **XGBoost:** gradient-boosted trees on the engineered features.
  - **LSTM:** a recurrent network over recent history.
  - **Temporal Fusion Transformer:** a multi-horizon attention model.
- **Forecast horizon.** The XGBoost and LSTM setups use the previous hour's load, so their numbers are **one-step-ahead (next-hour)** forecasts.

## Results

| Model | MAE (MW) | RMSE (MW) | MAPE |
|---|---:|---:|---:|
| Prophet | 1,396.96 | 1,769.79 | 9.00% |
| **XGBoost** | **125.09** | **161.94** | **0.81%** |
| LSTM | 170.69 | 222.05 | 1.11% |
| Temporal Fusion Transformer | 896.78 | 1,060.03 | 5.53% |

![Model comparison across MAE, RMSE and MAPE](../../assets/projects/energy-demand-forecasting/model-comparison.png)

XGBoost wins because `lag_1h` captures the autoregressive structure directly. Prophet gets the daily and weekly shape but misses sharp hourly turns, because it never sees recent load. The TFT underfit on a deliberately short budget of 3 epochs.

![XGBoost and LSTM predictions against actual load over a week](../../assets/projects/energy-demand-forecasting/predictions.png)

SHAP confirmed that the short lags dominate XGBoost's predictions, as the autocorrelation analysis suggested:

![SHAP feature importance for the XGBoost model](../../assets/projects/energy-demand-forecasting/shap.png)

## Engineering trade-offs and limitations

- **Not a like-for-like horizon comparison.** Prophet forecasts from the calendar alone, while XGBoost and the LSTM see the previous hour. The ranking is fair for next-hour forecasting, but a day-ahead forecast would lose `lag_1h` and the gap would shrink.
- **Missing a persistence baseline.** "Next hour equals this hour" is the obvious baseline for one-step-ahead load and should be reported next to the models.
- **TFT was under-trained,** so its result says little about the architecture.
- **No weather data,** which is the main external driver of demand.

## What I learned

Read the autocorrelation before choosing a model: it predicted both the winning features and the winner. And state the forecast horizon next to every error metric, because "0.81% MAPE" means something very different an hour ahead than a day ahead.

**Next:** a persistence baseline, a true day-ahead setup (recursive or direct multi-horizon), weather features, and quantile forecasts.
