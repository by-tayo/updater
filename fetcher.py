import time
from datetime import datetime, timezone
from calendar import timegm

import feedparser
import requests

from config import SOURCES
import db

HEADERS = {
    "User-Agent": "desktop:updater-research-digest:v1.0 (personal single-user RSS reader)"
}
REQUEST_TIMEOUT = 15
FETCH_DELAY_SECONDS = 2
# Reddit's unauthenticated .rss endpoint rate-limits aggressively and somewhat
# unpredictably regardless of spacing; a longer delay only reduces (doesn't
# eliminate) 429s. A failed Reddit source is non-fatal -- it just won't
# contribute new articles until a later fetch succeeds.
REDDIT_DELAY_SECONDS = 8


def _strip_html(text: str, limit: int = 400) -> str:
    import re
    clean = re.sub(r"<[^>]+>", " ", text or "")
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean[:limit]


def _parsed_time_to_iso(struct_time) -> str | None:
    if not struct_time:
        return None
    return datetime.fromtimestamp(timegm(struct_time), tz=timezone.utc).isoformat()


def fetch_source(source: dict) -> dict:
    """Fetch one RSS source. Returns a result dict with counts and any error."""
    name = source["name"]
    try:
        resp = requests.get(source["url"], headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        parsed = feedparser.parse(resp.content)
    except Exception as e:
        return {"source": name, "ok": False, "error": str(e), "new": 0, "seen": 0}

    if parsed.bozo and not parsed.entries:
        return {"source": name, "ok": False, "error": str(parsed.bozo_exception), "new": 0, "seen": 0}

    new_count = 0
    now_iso = datetime.now(timezone.utc).isoformat()

    with db.get_conn() as conn:
        for entry in parsed.entries:
            url = entry.get("link")
            title = entry.get("title")
            if not url or not title:
                continue

            snippet = _strip_html(entry.get("summary", ""))
            published = _parsed_time_to_iso(entry.get("published_parsed") or entry.get("updated_parsed"))

            article = {
                "url": url,
                "title": title.strip(),
                "source": name,
                "category": source["category"],
                "published_at": published,
                "fetched_at": now_iso,
                "snippet": snippet,
                "summary": None,
            }
            if db.insert_article(conn, article):
                new_count += 1

    return {"source": name, "ok": True, "error": None, "new": new_count, "seen": len(parsed.entries)}


def fetch_all(sources=None) -> list[dict]:
    results = []
    for source in (sources or SOURCES):
        results.append(fetch_source(source))
        delay = REDDIT_DELAY_SECONDS if "reddit.com" in source["url"] else FETCH_DELAY_SECONDS
        time.sleep(delay)
    return results
