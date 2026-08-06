# Quarto Report Cheatsheet

A personal reference for the markdown, YAML, Quarto-specific, HTML and CSS
syntax used when building bespoke `.qmd` reports.

**Live site: <https://jaspercain01.github.io/quarto_cheatsheet/>**

The page is itself a Quarto document, so most entries show the syntax on the
left and the *real* rendered result on the right — the callouts, tabsets,
column layouts and cross-references in the "Renders as" panels are genuine
Quarto output rather than screenshots or imitations.

## What's covered

| Section | Contents |
|---|---|
| **1. Markdown** | Headings, emphasis, super/subscript, line breaks, lists, links, images, tables, blockquotes, code fences, rules, footnotes, maths (MathJax + LaTeX symbols), definition lists, escaping, comments, fenced divs and spans |
| **2. YAML** | Syntax rules, multi-line strings, comments, the common `format: html` front-matter options, the front matter behind this very page, parameterised reports, multi-format output, anchors and aliases |
| **3. Quarto features** | Code chunk anatomy and options, `fig-width` vs `out-width` figure sizing, inline code, callouts (all five types, custom titles, collapsing), tabsets, column and margin layout, cross-references, conditional content, includes, raw HTML passthrough, dashboards |
| **4. HTML** | `<details>` collapsibles, divs and spans, line breaks and rules, anchor links, comments, iframes, and text-level helpers (`<mark>`, `<kbd>`, `<abbr>`, …) |
| **5. CSS** | Where to put stylesheets, Bootswatch themes and SCSS variable overrides, selector basics, common properties, selectors for overriding Quarto's own output, flexbox, media queries |

Throughout, **Gotcha** callouts flag the things that silently break a render —
tabs in YAML, `#|` options after a blank line, bare `<hr>` swallowing a `:::`
fence, `@sec-` references without `number-sections: true`, and similar.

The page has a left-hand contents list with a filter box (press <kbd>/</kbd>),
copy buttons on every code block, and a light/dark toggle.

## Repository layout

| Path | Purpose |
|---|---|
| `index.qmd` | **The source.** All cheatsheet content lives here — this is the only file to edit for content changes. |
| `index.html` | The rendered site, committed to the repo because GitHub Pages serves this branch directly. Generated — never edit by hand. |
| `custom.scss` | Theme: Bootstrap/Quarto SCSS variable overrides plus the rules for the side-by-side `.demo` / `.demo-out` example panels. |
| `custom.js` | The contents-list filter box and the back-to-top button, injected via `include-in-header`. |
| `_quarto.yml` | Project config; registers the post-render step. |
| `scripts/strip-polyfill.py` | Post-render cleanup — removes Pandoc's legacy `cdnjs` ES6 polyfill `<script>`, which is the one thing that stops `embed-resources: true` producing a genuinely self-contained page. |
| `images/example-plot.svg` | Placeholder chart used by the image, layout and cross-reference examples. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is rather than running them through Jekyll. |

`index.html` is built with `embed-resources: true`, so it is a single
self-contained file (~4 MB) with no supporting asset directory. The only
external request it makes at runtime is MathJax from jsDelivr, which Quarto
injects via JavaScript and therefore cannot be inlined.

## Editing and rendering

Content changes go in `index.qmd`; styling changes go in `custom.scss`. Then
re-render:

```bash
quarto render          # rebuilds index.html
quarto preview         # live-reloading preview while writing
```

Requires [Quarto](https://quarto.org/docs/get-started/) (built with 1.7.32) and
Python 3 for the post-render script. No R or Python *execution* environment is
needed — `index.qmd` sets `engine: markdown`, so nothing in it is executed; the
`{r}` chunks it shows are display-only examples inside code fences.

Commit both `index.qmd` and the regenerated `index.html`.

## Deployment

GitHub Pages is configured to deploy from the **`main` branch, `/root`
folder**, so whatever `index.html` sits at the repository root *is* the live
site. There is no build step on the Pages side — the committed HTML is served
verbatim.

`.github/workflows/render.yml` re-renders the site and commits the updated
`index.html` back to `main` whenever the source files change there, so the
published page can't drift from `index.qmd`. If Actions is unavailable, running
`quarto render` locally and committing the result achieves the same thing — the
workflow is a convenience, not a dependency.
