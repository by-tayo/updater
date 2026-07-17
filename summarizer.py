"""
AI summarization, disabled until an API key is configured.

To enable: set ANTHROPIC_API_KEY in a .env file (see .env.example),
install the anthropic package, and fill in `summarize()` below to call
the Messages API. Everything that calls this module already handles
`None` as "no summary available" so no other file needs to change.
"""

import os

ENABLED = bool(os.environ.get("ANTHROPIC_API_KEY"))


def summarize(title: str, snippet: str, category: str) -> str | None:
    if not ENABLED:
        return None

    raise NotImplementedError(
        "ANTHROPIC_API_KEY is set, but summarize() hasn't been implemented yet."
    )
