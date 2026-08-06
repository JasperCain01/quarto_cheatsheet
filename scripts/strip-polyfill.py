#!/usr/bin/env python3
"""Remove Pandoc's legacy ES6 polyfill <script> from the rendered HTML.

Pandoc injects a `cdnjs.cloudflare.com/polyfill/...` tag alongside MathJax. It
is only needed by browsers that predate ES6, and it is the one thing stopping
`embed-resources: true` from producing a genuinely self-contained page — so it
gets stripped after every render, locally and in CI alike.

Run automatically via the `post-render` hook in _quarto.yml.
"""

from __future__ import annotations

import pathlib
import re
import sys

PATTERN = re.compile(
    r'[ \t]*<script[^>]*src="https?://cdnjs\.cloudflare\.com/polyfill/[^"]*"[^>]*>'
    r"\s*</script>\s*",
    re.IGNORECASE,
)


def strip(path: pathlib.Path) -> bool:
    html = path.read_text(encoding="utf-8")
    cleaned, count = PATTERN.subn("\n", html)
    if count:
        path.write_text(cleaned, encoding="utf-8")
    return bool(count)


def main() -> int:
    root = pathlib.Path(__file__).resolve().parent.parent
    targets = [root / "index.html"]

    missing = [p for p in targets if not p.exists()]
    if missing:
        print(
            "strip-polyfill: expected output not found: "
            + ", ".join(str(p) for p in missing),
            file=sys.stderr,
        )
        return 1

    for path in targets:
        if strip(path):
            print(f"strip-polyfill: removed polyfill script from {path.name}")
        else:
            print(f"strip-polyfill: nothing to strip in {path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
