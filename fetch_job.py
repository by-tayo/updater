"""Standalone daily fetch job, meant to be run by Windows Task Scheduler.

    python fetch_job.py

Fetches all configured sources into the local DB. Run main.py's
dashboard separately (or alongside) to browse what's collected.
"""

import sys
from datetime import datetime, timezone

import db
import fetcher

if __name__ == "__main__":
    db.init_db()
    print(f"[{datetime.now(timezone.utc).isoformat()}] Starting fetch...")

    results = fetcher.fetch_all()
    total_new = sum(r["new"] for r in results)
    failed = [r for r in results if not r["ok"]]

    for r in results:
        status = "OK" if r["ok"] else f"FAILED: {r['error']}"
        print(f"  {r['source']}: {status} (new={r['new']}, seen={r['seen']})")

    print(f"Done. {total_new} new articles, {len(failed)} source(s) failed.")
    sys.exit(1 if failed and total_new == 0 else 0)
