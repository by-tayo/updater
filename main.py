from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from pydantic import BaseModel

import db
import fetcher
import report as report_mod
from config import CATEGORIES

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

app = FastAPI(title="Updater - Research Digest")

db.init_db()


class ReadRequest(BaseModel):
    read: bool = True


@app.get("/")
def root():
    index = FRONTEND_DIST / "index.html"
    if not index.is_file():
        raise HTTPException(
            status_code=503,
            detail="Frontend not built. Run: cd frontend && npm install && npm run build",
        )
    return FileResponse(index)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/categories")
def get_categories():
    counts = db.category_counts()
    return {
        "categories": [
            {
                "key": key,
                "label": label,
                "total": counts.get(key, {}).get("total", 0),
                "unread": counts.get(key, {}).get("unread", 0),
            }
            for key, label in CATEGORIES.items()
        ]
    }


@app.get("/api/articles")
def get_articles(
    category: str | None = Query(None),
    search: str | None = Query(None),
    unread_only: bool = Query(False),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
):
    articles = db.list_articles(category=category, search=search, unread_only=unread_only, limit=limit, offset=offset)
    return {"count": len(articles), "articles": articles}


@app.post("/api/articles/{article_id}/read")
def mark_read(article_id: int, req: ReadRequest):
    db.set_read(article_id, req.read)
    return {"ok": True}


@app.post("/api/fetch")
def trigger_fetch():
    results = fetcher.fetch_all()
    total_new = sum(r["new"] for r in results)
    failed = [r for r in results if not r["ok"]]
    return {
        "total_new": total_new,
        "sources_fetched": len(results),
        "sources_failed": len(failed),
        "results": results,
    }


@app.post("/api/report")
def generate_report(days: int = Query(1, ge=1, le=30)):
    path = report_mod.generate_report(days=days)
    return {"filename": path.name, "content": path.read_text(encoding="utf-8")}


@app.get("/api/reports")
def get_reports():
    return {"reports": report_mod.list_reports()}


@app.get("/api/reports/{filename}")
def get_report(filename: str):
    path = (report_mod.REPORTS_DIR / filename).resolve()
    if report_mod.REPORTS_DIR.resolve() not in path.parents or not path.is_file():
        raise HTTPException(status_code=404, detail="Report not found")
    return PlainTextResponse(path.read_text(encoding="utf-8"), media_type="text/markdown")


if FRONTEND_DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/favicon.svg")
    def favicon():
        return FileResponse(FRONTEND_DIST / "favicon.svg")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=False)
