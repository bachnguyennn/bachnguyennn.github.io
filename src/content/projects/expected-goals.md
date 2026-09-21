---
title: "Soccer xG → Value-Betting Engine"
summary: "An xG betting engine backtested against the market's closing line — honest enough to show its apparent edge is statistical noise."
role: "Researcher & Builder"
period: "2025"
domain: finance
domainLabel: "Quant / Sports Analytics"
tags: ["XGBoost", "Calibration", "Backtesting", "Dixon-Coles", "SHAP"]
featured: true
order: 1
github: "https://github.com/bachnguyennn/Expected-Goal-Prediction"
experiment: "xg_value_betting"
domainTag: "quant"
headline: "no edge vs the close (and that's right)"
year: 2025
---

> **TL;DR —** A calibrated xG + Dixon-Coles betting engine, backtested against the sharpest line in the market — proving with bootstrap significance that its apparent +5.7% edge is really just noise.

## The question I wanted to answer

I wanted to know something specific and uncomfortable: **can a model I build actually beat the betting market — or do I just *think* it can?**

Anyone can fit a model to historical matches and print a profit on the sample they trained on. The real test in sports betting is the **closing line** — the final odds right before kickoff, after all the sharp money has moved them. Beating the close is the bar that separates a genuine edge from luck. So I set the hardest possible target for myself: build a full xG-driven betting engine and backtest it against **Pinnacle's closing odds**, the sharpest price in the market — and report the result honestly, even if the answer is "no."

## Getting to know the data

I worked with **StatsBomb open shot data** (every shot, with its location and a freeze-frame of where the defenders were) for the shot model, and **football-data.co.uk** results + closing odds for 760 La Liga matches across 2017–19.

The first thing I explored was the distribution of shot quality. Most shots are *bad* — the xG distribution is heavily skewed toward near-zero chances, with a long thin tail of genuine opportunities. That shape matters: it means a model that just predicts "low chance" for everything will look accurate but be useless.

![Distribution of predicted xG values across all shots](../../assets/projects/expected-goals/xg-distribution.png)

This told me early that **calibration**, not raw accuracy, had to be the goal — the model's "0.15" needs to actually mean "scores 15% of the time," or every downstream bet is built on sand.

## How I thought about it

I built the system in layers, each answering the previous layer's weakness:

1. **A shot-level xG model** — XGBoost on shot geometry + freeze-frame defensive context. Crucially, I ran it through **Platt calibration** so the outputs are true probabilities, then sanity-checked it against StatsBomb's own xG (my Brier 0.085 vs their 0.079 — a small gap, since they use proprietary full-body tracking and I only used open data).
2. **A pre-match forecaster** — a Dixon-Coles model that learns each team's attack/defence strength and home advantage, re-fit every matchday on *only* prior games so there's no look-ahead.
3. **A match simulator** — turns those strengths into the full joint distribution of scorelines.
4. **A betting layer** — Expected Value + fractional Kelly staking on top of the simulated probabilities.
5. **A walk-forward backtest** — the part that actually answers my question.

Before trusting any of it, I checked *which signal even explains match outcomes*. Shot **counts** turned out to be noisy and misleading; shot **quality** (xG) explained results far better — validating that the whole xG premise was worth building on.

![xG vs shot counts — which actually explains who deserved to win](../../assets/projects/expected-goals/xg-validation.png)

## What I found

First, the model is **well-calibrated** — predicted probabilities track reality closely, sitting right alongside the StatsBomb benchmark:

![xG calibration curve vs the StatsBomb benchmark](../../assets/projects/expected-goals/calibration.png)

Then the moment of truth — the walk-forward backtest against the closing line:

| Metric | Goals model | xG-proxy |
|---|---|---|
| Bets placed | 1,379 | 1,636 |
| Level-stakes yield | +5.7% | +3.0% |
| **Yield 95% bootstrap CI** | **[−3.2%, +15.0%]** | **[−4.4%, +10.5%]** |
| Significant? | **No** (p=0.11) | **No** (p=0.22) |

That +5.7% yield *looks* like a win — and here's the discipline that matters: I ran a 10,000-sample bootstrap on it, and the confidence interval **crosses zero**. The "profit" is statistically indistinguishable from luck, and the model's match forecast is actually slightly *worse* than the market's (Brier 0.605 vs 0.584).

![Quarter-Kelly bankroll vs the closing line — note the swings](../../assets/projects/expected-goals/backtest-equity.png)

## Takeaways

**No demonstrable edge against the close — and that's the correct answer.** An efficient market *should* be hard to beat, and proving that rigorously (closing-line benchmark, walk-forward validation, bootstrap significance) is a far more valuable demonstration than a cherry-picked profit curve. What I learned: in any predictive-finance problem, the headline isn't the point estimate — it's whether you can tell signal from variance. The tools that do that (calibration, significance testing, benchmarking against the market) are the whole job.

**Stack:** XGBoost · scikit-learn · SciPy · StatsBombPy · SHAP · Optuna · pytest (37 tests)
