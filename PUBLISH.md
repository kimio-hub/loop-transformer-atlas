# Publish LOOP / ATLAS with GitHub Pages

The website is already built. No local compilation or external dependencies are required for a reader to view it.

## 1. Create a new empty repository

While signed into GitHub, go to https://github.com/new and create a **public** repository named `loop-transformer-atlas` (or a name you prefer). Avoid selecting an initial README, `.gitignore` or license when making the empty repository, since the prepared package already contains the necessary files.

Do **not** mix this site into unrelated private research repositories.

## 2. Upload the site

Upload the contents of the `loop-transformer-atlas` folder directly to your repository's root. Ensure these paths are present:

- `index.html` — the entire website
- `catalog.json` — the editable catalog
- `site_template.html` and `build_site.py` — source template and generator
- `README.md` and `reading-guide.md` — documentation
- `bibliography.md` — all resource links in Markdown
- `CONTRIBUTING.md` — contribution guidelines
- `.github/ISSUE_TEMPLATE/` — community submission and correction forms
- `.nojekyll` — disables unnecessary Jekyll processing

## 3. Turn on GitHub Pages

In the repository go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, and click **Save**. GitHub will show the Pages address after the first deployment completes. It will normally look like:

`https://YOUR_USERNAME.github.io/loop-transformer-atlas/`

This is an illustrative pattern, not a verified website address.

## 4. Maintain the catalog

Edit `catalog.json`, run `python build_site.py`, then commit both the JSON and newly generated `index.html`. Changes to `main` are published by Pages. For new contributors, use the provided GitHub Issue templates and review additions before editing the catalog.

## 5. Future improvements

Add a separate `notes/` directory with original Chinese deep-reading essays, research graphs and experiment comparisons. Over time, these original interpretations should become the site's main asset; maintaining the raw paper list alone is not the goal.