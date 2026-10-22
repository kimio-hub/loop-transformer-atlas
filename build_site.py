#!/usr/bin/env python3
"""Validate the catalog and build the static site. No third-party packages needed."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parent

def load_and_validate() -> tuple[list[dict], dict]:
    records = json.loads((BASE / "catalog.json").read_text(encoding="utf-8"))
    editorial = json.loads((BASE / "editorial.json").read_text(encoding="utf-8"))
    if not isinstance(records, list) or not records:
        raise ValueError("catalog.json must be a nonempty array")
    ids: set[str] = set()
    for row in records:
        required = {"id", "title", "short", "year", "kind", "scope", "topic", "url", "tags"}
        if not required <= row.keys():
            raise ValueError(f"Missing catalog fields: {required - row.keys()}")
        if row["id"] in ids:
            raise ValueError(f"Duplicate resource id: {row['id']}")
        ids.add(row["id"])
        if row["kind"] not in {"paper", "blog", "project"}:
            raise ValueError(f"Unknown resource kind: {row['kind']}")
        if row["scope"] not in {"core", "foundation", "adjacent"}:
            raise ValueError(f"Unknown scope: {row['scope']}")
        for field in ("url", "code", "project"):
            value = row.get(field)
            if value and urlparse(value).scheme not in {"https", "http"}:
                raise ValueError(f"Invalid {field} for {row['id']}")
    used = set(editorial["featured"]) | set(editorial["notes"])
    for route in editorial["routes"]:
        used.update(step["id"] for step in route["steps"])
    for note in editorial["notes"].values():
        for field in ("heading", "question", "takeaway", "prerequisite", "focus",
                      "boundary", "level", "review", "source", "checked"):
            if not note.get(field):
                raise ValueError(f"Missing editorial field: {field}")
        used.update(note.get("related", []))
        if urlparse(note["source"]).scheme not in {"http", "https"}:
            raise ValueError("Invalid editorial source URL")
    if used - ids:
        raise ValueError(f"Editorial links reference unknown ids: {used - ids}")
    for name in ("assets/site.css", "assets/site.js", "site_template.html"):
        if not (BASE / name).is_file():
            raise FileNotFoundError(name)
    return records, editorial

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate without writing files")
    parser.add_argument("--standalone", type=Path, help="Also write a self-contained HTML file")
    args = parser.parse_args()
    records, editorial = load_and_validate()
    html = (BASE / "site_template.html").read_text(encoding="utf-8")
    if args.check:
        if (BASE / "index.html").read_text(encoding="utf-8") != html:
            raise ValueError("index.html differs from site_template.html; run build_site.py")
    else:
        (BASE / "index.html").write_text(html, encoding="utf-8")
    if args.standalone:
        css = (BASE / "assets/site.css").read_text(encoding="utf-8")
        js = (BASE / "assets/site.js").read_text(encoding="utf-8")
        data = json.dumps([records, editorial], ensure_ascii=False, separators=(",", ":"))
        data = data.replace("<", r"\u003c").replace(">", r"\u003e")
        html = re.sub(r'<link rel="stylesheet" href="assets/site.css[^"]*">',
                      lambda _: "<style>" + css + "</style>", html)
        html = re.sub(r'<script src="assets/site.js[^"]*" defer></script>', "", html)
        inline = "<script>window.LOOP_DATA=" + data + ";</script><script>" + js + "</script>"
        html = html.replace("</body>", inline + "\n</body>")
        args.standalone.parent.mkdir(parents=True, exist_ok=True)
        args.standalone.write_text(html, encoding="utf-8")
        print(f"Standalone site: {args.standalone}")
    print(f"Validated {len(records)} resources, {len(editorial['notes'])} reading notes, "
          f"{len(editorial['routes'])} learning paths.")

if __name__ == "__main__":
    main()
