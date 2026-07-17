"""Category definitions and RSS source list."""

CATEGORIES = {
    "cybersecurity": "Cybersecurity",
    "cloud": "Cloud",
    "devsecops": "DevSecOps",
    "sysadmin": "SysAdmin",
    "ai": "AI",
    "finance-personal": "Personal Finance",
    "finance-markets": "Market Analysis",
}

# Each source: name, feed URL, category (must match a CATEGORIES key)
SOURCES = [
    # --- Cybersecurity / security research (main focus) ---
    {"name": "Krebs on Security", "url": "https://krebsonsecurity.com/feed/", "category": "cybersecurity"},
    {"name": "The Hacker News", "url": "https://feeds.feedburner.com/TheHackersNews", "category": "cybersecurity"},
    {"name": "BleepingComputer", "url": "https://www.bleepingcomputer.com/feed/", "category": "cybersecurity"},
    {"name": "Dark Reading", "url": "https://www.darkreading.com/rss.xml", "category": "cybersecurity"},
    {"name": "Schneier on Security", "url": "https://www.schneier.com/feed/atom/", "category": "cybersecurity"},
    {"name": "SANS Internet Storm Center", "url": "https://isc.sans.edu/rssfeed.xml", "category": "cybersecurity"},
    {"name": "CISA Advisories", "url": "https://www.cisa.gov/cybersecurity-advisories/all.xml", "category": "cybersecurity"},
    {"name": "r/netsec", "url": "https://www.reddit.com/r/netsec/.rss", "category": "cybersecurity"},

    # --- Cloud ---
    {"name": "AWS Security Blog", "url": "https://aws.amazon.com/blogs/security/feed/", "category": "cloud"},
    {"name": "Google Cloud Security Blog", "url": "https://cloudblog.withgoogle.com/products/identity-security/rss/", "category": "cloud"},
    {"name": "Microsoft Security Blog", "url": "https://www.microsoft.com/en-us/security/blog/feed/", "category": "cloud"},

    # --- DevSecOps ---
    {"name": "r/devops", "url": "https://www.reddit.com/r/devops/.rss", "category": "devsecops"},
    {"name": "r/devsecops", "url": "https://www.reddit.com/r/devsecops/.rss", "category": "devsecops"},

    # --- SysAdmin ---
    {"name": "r/sysadmin", "url": "https://www.reddit.com/r/sysadmin/.rss", "category": "sysadmin"},

    # --- AI ---
    {"name": "arXiv cs.AI", "url": "http://export.arxiv.org/rss/cs.AI", "category": "ai"},
    {"name": "arXiv cs.CR (Cryptography & Security)", "url": "http://export.arxiv.org/rss/cs.CR", "category": "ai"},
    {"name": "Google AI Blog", "url": "https://blog.google/technology/ai/rss/", "category": "ai"},

    # --- Personal finance ---
    {"name": "r/personalfinance", "url": "https://www.reddit.com/r/personalfinance/.rss", "category": "finance-personal"},

    # --- Market analysis ---
    {"name": "MarketWatch Top Stories", "url": "https://www.marketwatch.com/rss/topstories", "category": "finance-markets"},
    {"name": "Yahoo Finance", "url": "https://finance.yahoo.com/news/rssindex", "category": "finance-markets"},
]
