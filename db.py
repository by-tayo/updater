import sqlite3
from pathlib import Path
from contextlib import contextmanager

DB_PATH = Path(__file__).resolve().parent / "updater.db"


def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                source TEXT NOT NULL,
                category TEXT NOT NULL,
                published_at TEXT,
                fetched_at TEXT NOT NULL,
                snippet TEXT,
                summary TEXT,
                read INTEGER DEFAULT 0
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_category ON articles(category)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_published ON articles(published_at)")


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def insert_article(conn, article: dict) -> bool:
    """Insert an article, ignoring duplicates by URL. Returns True if inserted."""
    try:
        conn.execute(
            """INSERT INTO articles (url, title, source, category, published_at, fetched_at, snippet, summary)
               VALUES (:url, :title, :source, :category, :published_at, :fetched_at, :snippet, :summary)""",
            article,
        )
        return True
    except sqlite3.IntegrityError:
        return False


def list_articles(category: str | None = None, search: str | None = None,
                   unread_only: bool = False, limit: int = 100, offset: int = 0):
    query = "SELECT * FROM articles WHERE 1=1"
    params: dict = {}

    if category:
        query += " AND category = :category"
        params["category"] = category

    if search:
        query += " AND (title LIKE :search OR snippet LIKE :search)"
        params["search"] = f"%{search}%"

    if unread_only:
        query += " AND read = 0"

    query += " ORDER BY COALESCE(published_at, fetched_at) DESC LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    with get_conn() as conn:
        rows = conn.execute(query, params).fetchall()
        return [dict(r) for r in rows]


def category_counts():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT category, COUNT(*) as total, SUM(1 - read) as unread FROM articles GROUP BY category"
        ).fetchall()
        return {r["category"]: {"total": r["total"], "unread": r["unread"]} for r in rows}


def set_read(article_id: int, read: bool):
    with get_conn() as conn:
        conn.execute("UPDATE articles SET read = :read WHERE id = :id", {"read": int(read), "id": article_id})


def articles_since(days: int):
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT * FROM articles
               WHERE datetime(fetched_at) >= datetime('now', :cutoff)
               ORDER BY category, COALESCE(published_at, fetched_at) DESC""",
            {"cutoff": f"-{days} days"},
        ).fetchall()
        return [dict(r) for r in rows]
