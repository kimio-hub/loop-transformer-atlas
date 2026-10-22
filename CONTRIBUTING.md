# Contributing to LOOP / ATLAS

We aim to maintain **a useful reading map**, not the longest possible list. The catalog snapshot is a starting point; public contributions make it more reliable over time.

## 1. Suggest a resource

Open an Issue with the **Suggest a research resource** form. Provide a primary-source link, a short description of what is genuinely new, why it is worth reading, and any important experimental caveats. The editors decide whether to include it and what priority tier to assign.

## 2. Prefer the original research

Accepted links should normally point to arXiv/proceedings, an original researcher-written blog, or an official project/code page. Secondary summaries are welcome only when they teach a difficult topic substantially better than the original and accurately distinguish author claims from independently established facts.

## 3. Keep the architectural scope precise

- `core`: the same Transformer parameters run recurrently across **virtual computation depth** within one forward pass.
- `foundation`: earlier related concepts such as adaptive computation time or equilibrium models.
- `adjacent`: important latent, recurrent or diffusion ideas that help understanding but are **not** direct evidence for weight-tied looped Transformers.

Do **not** automatically label tool-use agents, an ordinary long Chain-of-Thought, diffusion denoising, or generic RNNs as core Loop Transformer work.

## 4. Editing an entry

Edit `catalog.json`. Use unique stable `id` values (arXiv ID when possible), and supply `title`, `short`, `year`, `month`, `kind`, `scope`, `tier`, `topic`, `author`, `desc`, `why`, `caveat`, `url`, `arxiv`, `code`, `project`, `tags`.

```bash
python build_site.py
```

Commit the updated JSON and generated `index.html` together. If changing CSS or JS, edit `site_template.html` and rebuild. Do not hand-edit generated `index.html`.

## 5. Quality rubric

An entry should be included based on its original contribution, conceptual clarity, controlled experimental comparisons, known limitations, and educational value. The `tier` labels (S/A/B) are editorial **reading priorities**, not formal peer-review scores. Do not advertise numbers without identifying the benchmark, model, budget and baseline from the source.

## 6. Corrections

Use **Report an incorrect or outdated entry** to point out typos, dead links, wrong dates, unjustified claims or changed versions. Be specific and cite the paper or author page.