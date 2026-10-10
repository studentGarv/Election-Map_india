# Data Directory

This directory contains the CSV data files used by the Election Guide Website:

- `cm_raw_all_states.csv` — Chief Minister history for all Indian states
- `lok_sabha_ruling_party.csv` — Lok Sabha election history and PM records
- `state_party_years_all_states.csv` — State-level party tenure summaries

## Snapshot and sources

The current snapshot was prepared on 9 October 2026. Chief Minister terms cover
the 28 states and the three union territories with elected Chief Ministers.
The five other union territories in the map do not have Chief Minister terms.

- Chief Minister names, dates, parties, and President's Rule intervals are
  extracted from the full timelines on [Janadesh Online](https://janadeshonline.in/chief-ministers).
  This is a secondary source; its statement that it uses ECI and TCPD data is
  not an independent verification of every officeholder or date. ECI election
  reports can confirm assembly results, but do not provide a complete CM tenure
  chronology.
- Lok Sabha election years and party seat totals are checked against the
  [Election Commission's statistical reports](https://www.eci.gov.in/statistical-reports).
  ECI's historical table gives INC 404 seats in 1984 and 232 in 1991; those
  official figures replace the earlier 414 and 244 values. PM succession rows
  are recorded by the Lok Sabha term in which each government served.
- State party summaries are derived from the Chief Minister file. Term days
  include both the first and last day and ongoing terms are counted through
  9 October 2026. Where one administration's reported end date is also the
  next administration's start date, the shared date is counted for the new
  administration only. `total_years` is `total_days / 365.25`, rounded to two
  decimals.

Run `scripts/build_public_data.py` to regenerate the three CSVs. The source
pages are live and may change; the script uses 9 October 2026 as the snapshot
date for open-ended terms.
