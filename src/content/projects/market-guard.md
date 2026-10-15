---
title: "MarketGuard: Crypto Market Anomaly Pipeline"
summary: "A medallion-architecture data pipeline that collects live Coinbase trades into Azure, builds one-minute market metrics with Spark and Delta Lake, and flags statistical volume and price anomalies on a Streamlit dashboard."
role: "Builder"
period: "2026"
domain: data
domainLabel: "Data Engineering"
tags: ["Python", "Apache Spark", "Delta Lake", "Kafka", "Azure Blob Storage", "Azure Container Apps", "Streamlit", "GitHub Actions"]
featured: true
order: 0
github: "https://github.com/bachnguyennn/Market-Guard"
demo: "https://market-guard-coinbase.streamlit.app/"
year: 2026
---

> **TL;DR:** A data engineering project on real market data. A containerized collector on Azure Container Apps streams BTC-USD and ETH-USD trades from the Coinbase WebSocket into an Azure Blob **Bronze** archive. Spark cleans them into a **Silver** Delta table, aggregates **Gold** one-minute metrics (volume, notional, VWAP), and runs rolling z-score detectors for volume spikes and price jumps. The results go to a [Streamlit dashboard](https://market-guard-coinbase.streamlit.app/) as verified Parquet snapshots.

## The problem

Raw exchange feeds are noisy. Messages can repeat, arrive with bad fields, or stop for a while. I wanted to build the whole path from a live WebSocket to a dashboard that says *"this minute looks unusual"*, and make every step safe to replay. Duplicates must not inflate volume, gaps must not create fake signals, and the dashboard must never show half of one snapshot next to half of another.

## Architecture

```text
Coinbase WebSocket → collector (Azure Container Apps) → Azure Blob Bronze (JSONL)
                                                              ↓
Kafka (local, 2 partitions) → Spark Structured Streaming → Silver Delta (insert-only MERGE)
                                                              ↓ batch refresh
                     Streamlit ← Gold + anomaly Parquet ← Gold metrics → anomaly detectors
```

- **Collection.** An `asyncio` collector subscribes to the `matches` channel for BTC-USD and ETH-USD. It buffers trades and hands off batches every 100 trades or every 5 seconds, whichever comes first. It runs as a Docker container on **Azure Container Apps**. A GitHub Actions workflow builds a `linux/amd64` image, pushes it to **Azure Container Registry**, rolls out a new revision, and checks that the live revision runs the expected image. It logs in to Azure with GitHub OIDC, so no client secret is stored.
- **Bronze.** Raw batches land as JSONL in a private Azure Blob container. This is the immutable archive that everything else is rebuilt from.
- **Silver.** Spark validates and casts each trade (`Decimal(20,8)` price and size, typed timestamps, positive values only) and drops malformed records. In the streaming path, Kafka feeds Spark Structured Streaming, and `foreachBatch` writes to Delta with an **insert-only MERGE** keyed on `(product_id, trade_id)`. Replays and restarts therefore never double-count a trade.
- **Gold.** Trades are aggregated into one-minute buckets per product: trade count, base volume, notional volume, and **VWAP**.

## Anomaly detection

All detectors use Spark window functions partitioned by product and by *gap-aware segment*, so a rolling window never spans a period with missing data.

- **Volume spikes.** The z-score of a minute's notional volume against the previous *N* minutes. A minute is flagged above 3σ.
- **Price jumps.** One-minute VWAP returns, computed only when the previous bucket is exactly 60 seconds earlier. They are scored against a rolling mean and standard deviation of recent returns.
- **Warm-up rules.** Minutes without enough history, or with zero variance, produce no score instead of a false alert.

The alerts are statistical flags for someone to investigate. They are not evidence of fraud or manipulation, and the dashboard says so.

## Correctness and testing

- **Replay test.** A local end-to-end demo starts Kafka in Docker, publishes 100 deterministic trades, replays all 100, then restarts Spark on the same checkpoint and replays them again. Silver stays at **100 → 100 → 100** rows.
- **Independent reference.** Every Gold bucket's count, volume, notional, and VWAP is checked against a separate Python `Decimal` calculation. The demo also confirms that both seeded signals fire: a BTC volume spike and an ETH price jump.
- **Failure recovery.** A worker test simulates a crash after the Delta commit but before the Spark checkpoint completes, and checks that recovery gives the correct result.
- **CI.** The suite has 40+ focused tests, plus a real Kafka-to-dashboard integration test that runs in GitHub Actions.

## Publishing to the dashboard

- A manually triggered GitHub Actions workflow pulls the last 6 to 24 hours of Bronze from Azure, rebuilds Silver → Gold → anomalies, and publishes `gold.parquet` and `anomalies.parquet` to a private Blob container.
- Each upload is downloaded again and checked byte-for-byte. A `snapshot.json` manifest with SHA-256 hashes is uploaded **last**. The dashboard checks both files against the manifest before showing either, so a partial publish fails closed instead of mixing two snapshots.
- The Streamlit app reads them with a short-lived, read-only SAS token. Without Azure credentials it falls back to a clearly labeled synthetic demo. It reports the latest market minute and the age of the data separately, and it never claims to be a live feed.

## Takeaways

- Idempotency has to be designed in. Checkpoints, MERGE keys, and replay tests each cover a different way of double-counting.
- Use `Decimal` for money. Floating-point VWAP drifts enough to fail exact reconciliation.
- Fail closed. A dashboard that shows an error is better than one that quietly shows mismatched data.

**Next:** scheduled refreshes, date-partitioned Bronze for cheaper incremental loads, and connecting the live WebSocket producer directly to Kafka.

**Stack:** Python · asyncio · Apache Kafka · Apache Spark (PySpark) · Delta Lake · Azure Blob Storage · Azure Container Apps · Azure Container Registry · Docker · GitHub Actions · Streamlit
