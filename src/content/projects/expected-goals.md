---
title: "Soccer xG and Value-Betting Backtest"
shortTitle: "Soccer xG / Value-Betting Engine"
summary: "A calibrated expected-goals model and Dixon-Coles match simulator, backtested against Pinnacle closing odds with bootstrap significance tests."
problem: "Test whether a model-driven betting strategy has a real edge over the market, or only looks profitable on one sample."
categories: [ml, research]
status: complete
role: "Sole developer"
period: "2025"
year: 2025
order: 7
stack: ["Python", "XGBoost", "scikit-learn", "SciPy", "StatsBombPy", "SHAP", "Optuna", "pytest"]
result:
  value: "No edge"
  label: "against the closing line"
  context: "+5.7% yield over 1,379 bets, but the 95% bootstrap interval [−3.2%, +15.0%] includes zero (p = 0.11)."
github: "https://github.com/bachnguyennn/Expected-Goal-Prediction"
cover: "../../assets/projects/expected-goals/calibration.png"
coverAlt: "Calibration curve for the expected-goals model, close to the diagonal and to StatsBomb's own xG."
resume:
  - "Built a shot-level xG model (XGBoost with Platt calibration) on StatsBomb open data; Brier 0.085 on an unseen tournament against StatsBomb's own 0.079."
  - "Backtested a Dixon-Coles simulator with fractional Kelly staking against Pinnacle closing odds over 760 La Liga matches, re-fitting only on prior games."
  - "Showed with a 10,000-sample bootstrap that the apparent +5.7% yield is not statistically distinguishable from zero."
---

## Overview

Anyone can fit a model to old matches and print a profit on the same sample. The real test is the **closing line**: the final odds before kickoff, after informed money has moved them. I built a full pipeline, from a shot-level expected-goals (xG) model to a betting backtest, and benchmarked it against Pinnacle's closing odds, the sharpest prices available.

## The problem

Can a model built from open data beat an efficient betting market, or does it only appear to? Answering that needs three things: probabilities that are actually calibrated, a backtest with no look-ahead, and a significance test on the result.

## Approach

1. **Shot-level xG model.** XGBoost on shot geometry and freeze-frame defender positions from StatsBomb open data, trained on the 2018 World Cup and two La Liga seasons and tested on Euro 2020, which it never saw. **Platt calibration** makes a predicted 0.15 mean "scores about 15% of the time".
2. **Pre-match strengths.** A Dixon-Coles model of attack, defence, and home advantage, re-fit every matchday on prior games only.
3. **Match simulation** into a full scoreline distribution.
4. **Betting layer:** expected value with fractional Kelly staking.
5. **Walk-forward backtest** over 760 La Liga matches (2017–19) using football-data.co.uk closing odds.

Before building on xG, I checked that shot *quality* explains match outcomes better than shot *counts*. It does:

![xG compared with shot counts as an explanation of match outcomes](../../assets/projects/expected-goals/xg-validation.png)

## Results

The xG model is well calibrated, close to StatsBomb's own model (Brier 0.085 against their 0.079; they use tracking data that is not public):

![Calibration curve against the StatsBomb benchmark](../../assets/projects/expected-goals/calibration.png)

The backtest against the closing line:

| Metric | Goals model | xG-proxy model |
|---|---:|---:|
| Bets placed | 1,379 | 1,636 |
| Level-stakes yield | +5.7% | +3.0% |
| 95% bootstrap CI | [−3.2%, +15.0%] | [−4.4%, +10.5%] |
| p-value | 0.11 | 0.22 |

The +5.7% yield looks like a win, but a 10,000-sample bootstrap puts zero comfortably inside the interval. The model's match probabilities are also slightly *worse* than the market's (Brier 0.605 against 0.584).

![Quarter-Kelly bankroll over the backtest, with large swings](../../assets/projects/expected-goals/backtest-equity.png)

## Limitations

- **Two seasons of one league.** The sample is too small to detect a small real edge, so "no evidence of an edge" is not proof that none exists.
- **Closing odds only.** Real bets are placed earlier, at different prices, with limits.
- **Open data only.** No tracking data, so the xG model has less information than commercial ones.

## What I learned

The headline is never the point estimate; it is whether the estimate can be told apart from variance. Calibration, a market benchmark, and a bootstrap interval turned a tempting profit curve into a clear, correct answer: no demonstrable edge.
