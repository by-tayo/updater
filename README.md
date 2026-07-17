# Updater — Research Digest

A local dashboard that aggregates RSS feeds across cybersecurity, cloud, DevSecOps,
sysadmin, AI, and finance (personal + markets), and turns them into browsable
articles and generated digest reports.

## Features

| Feature | Description |
|---|---|
| **Aggregation** | Pulls ~20 RSS/Atom sources across 7 categories, deduplicated by URL |
| **Dashboard** | Browse/search/filter articles by category, mark read/unread |
| **Reports** | Generate a dated markdown digest (`reports/digest-YYYY-MM-DD.md`) of recent articles grouped by category |
| **AI summaries** | Stubbed in, disabled until an `ANTHROPIC_API_KEY` is configured (see below) |

## Quick Start

```bash
pip install -r requirements.txt
python fetch_job.py    # pull the latest articles into the local DB
python main.py          # start the dashboard at http://localhost:8010
```

## Scheduling daily fetches (Windows)

`fetch_job.py` is a standalone script meant for Task Scheduler, independent of
whether the dashboard server is running:

```
schtasks /create /tn "Updater Daily Fetch" /tr "python \"<path-to-repo>\fetch_job.py\"" /sc daily /st 08:00
```

## Enabling AI summaries

1. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`.
2. Install the `anthropic` package.
3. Implement `summarize()` in `summarizer.py` — everything that calls it already
   treats `None` as "no summary available," so no other file needs to change.

## Sources

Configured in `config.py`. Reddit's unauthenticated `.rss` endpoints
rate-limit aggressively and somewhat unpredictably — a failed Reddit fetch is
non-fatal and just means those articles show up on a later fetch instead.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/categories` | Category list with total/unread counts |
| `GET` | `/api/articles?category=&search=&unread_only=` | List articles |
| `POST` | `/api/articles/{id}/read` | Mark an article read/unread |
| `POST` | `/api/fetch` | Trigger a fetch of all sources |
| `POST` | `/api/report?days=N` | Generate a digest report for the last N days |
| `GET` | `/api/reports` | List generated reports |
| `GET` | `/api/reports/{filename}` | Fetch a report's raw markdown |

## Project Structure

```
updater/
├── main.py           # FastAPI backend
├── config.py          # categories + RSS source list
├── db.py               # SQLite storage
├── fetcher.py          # RSS fetch/parse logic
├── summarizer.py        # AI summary hook (disabled by default)
├── report.py             # digest report generation
├── fetch_job.py            # standalone script for scheduled runs
├── requirements.txt
└── static/
    └── index.html          # dashboard UI
```
