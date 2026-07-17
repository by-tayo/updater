from datetime import datetime, timezone
from pathlib import Path

from config import CATEGORIES
import db

REPORTS_DIR = Path(__file__).resolve().parent / "reports"


def generate_report(days: int = 1) -> Path:
    REPORTS_DIR.mkdir(exist_ok=True)
    articles = db.articles_since(days)

    by_category: dict[str, list[dict]] = {}
    for a in articles:
        by_category.setdefault(a["category"], []).append(a)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [f"# Digest — {today}", "", f"_{len(articles)} articles from the last {days} day(s)_", ""]

    for cat_key, cat_label in CATEGORIES.items():
        cat_articles = by_category.get(cat_key, [])
        if not cat_articles:
            continue

        lines.append(f"## {cat_label} ({len(cat_articles)})")
        lines.append("")
        for a in cat_articles:
            lines.append(f"- **[{a['title']}]({a['url']})** — _{a['source']}_")
            if a.get("summary"):
                lines.append(f"  {a['summary']}")
            elif a.get("snippet"):
                lines.append(f"  {a['snippet']}")
        lines.append("")

    content = "\n".join(lines)
    out_path = REPORTS_DIR / f"digest-{today}.md"
    out_path.write_text(content, encoding="utf-8")
    return out_path


def list_reports() -> list[dict]:
    if not REPORTS_DIR.exists():
        return []
    files = sorted(REPORTS_DIR.glob("digest-*.md"), reverse=True)
    return [{"name": f.name, "modified": f.stat().st_mtime} for f in files]
