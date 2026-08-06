# Quarto Report Syntax Cheatsheet

A personal reference for the markdown, YAML, Quarto-specific, HTML, and CSS syntax used when building bespoke `.qmd` reports. Intended to be dropped onto GitHub Pages later as a navigable site — for now it's one long file, ordered so each section builds on the last.

## Contents

1. [Markdown](#1-markdown)
2. [YAML](#2-yaml)
3. [Quarto Features](#3-quarto-features)
4. [HTML](#4-html)
5. [CSS](#5-css)

---

## 1. Markdown

Pandoc-flavoured markdown, which is what Quarto parses. This is the base layer everything else sits on top of.

#### Headings
```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```
Quarto builds the table of contents from these, so keep them hierarchical (don't skip from H2 to H4).

#### Emphasis
```markdown
*italic*  or  _italic_
**bold**  or  __bold__
***bold italic***
~~strikethrough~~
```

#### Superscript / subscript
```markdown
x^2^ superscript
H~2~O subscript
```

#### Paragraphs and line breaks
```markdown
This is one paragraph.

This is a new paragraph (blank line above).

This line ends with two trailing spaces  
so this continues on a new line, same paragraph.

This line ends with a backslash\
same effect as trailing spaces.
```

#### Lists
```markdown
- Unordered item
- Another item
  - Nested item (indent 2–4 spaces)

* Also unordered (asterisk works too)
+ Also unordered (plus works too)

1. Ordered item
2. Another item
   1. Nested ordered item

- [ ] Unchecked task
- [x] Checked task
```

#### Links
```markdown
[link text](https://example.com)
[link text](https://example.com "optional title on hover")
[reference-style link][ref-id]

[ref-id]: https://example.com

<https://example.com>   # bare URL, auto-linked
```

#### Images
```markdown
![alt text](images/plot.png)
![alt text](images/plot.png "optional title")
![alt text](images/plot.png){width=60%}
```
The `{width=...}` attribute syntax is a Quarto/Pandoc extension, not pure CommonMark — flagged because it looks like plain markdown but won't work outside Quarto/Pandoc rendering.

#### Tables (pipe tables)
```markdown
| Column A | Column B | Column C |
|:---------|:--------:|---------:|
| left     | centre   | right    |
| aligned  | aligned  | aligned  |
```
`:---` left-aligns, `:---:` centres, `---:` right-aligns, plain `---` is default.

#### Blockquotes
```markdown
> A single-level quote.
>
> > A nested quote.
```

#### Code
````markdown
Inline `code` uses single backticks.

```r
# a fenced code block with language for syntax highlighting
mean(x)
```
````

#### Horizontal rule
```markdown
---
***
___
```
All three produce a horizontal rule — pick one and be consistent (I'd suggest `---`, but note that's also used for YAML delimiters, so make sure it's got blank lines around it in the body).

#### Footnotes
```markdown
Here's a claim that needs a source.[^1]

[^1]: This is the footnote text, can go anywhere in the document.
```

#### Math notation
```markdown
Inline math sits between single dollar signs: $E = mc^2$

Display math gets its own paragraph and is centred:
$$
E = mc^2
$$

Numbered, cross-referenceable equation (see Section 3 for @eq- referencing):
$$
E = mc^2
$$ {#eq-mass-energy}

See @eq-mass-energy for the relationship above.
```
Renders via MathJax automatically in HTML output — no YAML setup required. Common LaTeX symbols:
```markdown
\alpha \beta \gamma \pi \sigma \Delta \Sigma
\leq \geq \neq \approx \times \pm \infty
\frac{a}{b}   \sqrt{x}   x^{2}   x_{i}
\sum_{i=1}^{n}   \int_{a}^{b}
```

#### Definition lists
```markdown
Term
:   Definition of the term, indented under it.
```

#### Escaping characters
```markdown
\*not italic\*
\# not a heading
```

#### Comments
```markdown
<!-- This won't appear in the rendered output -->
```

#### Fenced divs and spans (Pandoc extension — the bridge into Quarto)
```markdown
::: {.class-name}
Content inside the div, can contain other markdown.
:::

Some text with a [highlighted phrase]{.class-name} inline.
```
This is the syntax Quarto builds callouts, tabsets, columns, and conditional content on top of — see Section 3.

---

## 2. YAML

YAML drives two things in a `.qmd`: the document front matter (between `---` delimiters at the top of the file) and per-chunk options (see `#|` syntax in Section 3).

#### Basic syntax rules
```yaml
key: value
nested:
  child-key: value
  another-child: value
list-value:
  - item one
  - item two
boolean-value: true      # Quarto wants lowercase true/false — not True/Yes
number-value: 42
quoted-string: "needed if the value has a colon: like this, or starts with a special character"
```
Indentation must be **spaces, not tabs**, and must be consistent — 2 spaces per level is the common convention.

#### Multi-line strings
```yaml
folded: >
  This will be joined
  into a single line
  with spaces.

literal: |
  This will keep
  its line breaks
  exactly as typed.
```

#### Comments
```yaml
# A comment — ignored by the parser
title: "My Report"  # inline comment
```

#### Document front matter — common Quarto options
```yaml
---
title: "Monthly Activity Report"
subtitle: "Directorate summary"
author: "Jasper"
date: last-modified          # or a fixed date, or "today"
date-format: "D MMMM YYYY"   # UK-style date formatting
format:
  html:
    toc: true
    toc-depth: 3
    toc-location: left
    number-sections: true
    theme: cosmo
    css: styles.css
    code-fold: true
    code-tools: true
    page-layout: article       # article | full
    embed-resources: true      # single self-contained HTML file (was self-contained)
    fig-width: 7
    fig-height: 5
execute:
  echo: false
  warning: false
  message: false
  freeze: auto                # re-use previous execution unless the source changes
---
```

#### Parameterised reports
```yaml
---
title: "Ward Report"
params:
  ward: "Ward 4"
  month: "2026-07"
---
```
Referenced in code via `params$ward` (R) or `params["ward"]` (Python).

#### Multiple output formats from one file
```yaml
format:
  html:
    toc: true
  docx:
    toc: false
```

#### Anchors and aliases (rarely needed, but useful for repeated blocks)
```yaml
defaults: &defaults
  echo: false
  warning: false

execute:
  <<: *defaults
  eval: true
```

---

## 3. Quarto Features

Quarto-specific syntax layered on top of markdown — code chunks, callouts, tabsets, layout, and cross-references.

#### Code chunk anatomy
````markdown
```{r}
#| label: fig-sales-trend
#| echo: false
#| warning: false
#| fig-cap: "Sales trend by quarter"
#| fig-width: 8
#| fig-height: 5

ggplot(data, aes(x, y)) + geom_line()
```
````
Options go on lines starting `#|` at the top of the chunk (the "hash-pipe" syntax) — this is preferred over the older comma-separated `{r, echo=FALSE}` style, which Quarto still supports but doesn't recommend for new documents.

#### Common chunk options
| Option | Effect |
|---|---|
| `label` | Chunk ID, used for cross-referencing (`fig-`, `tbl-` prefix required for figures/tables) |
| `echo` | Show the source code (`true`/`false`/`fenced`) |
| `eval` | Actually run the code (`true`/`false`) |
| `output` | Include the results (`true`/`false`/`asis`) |
| `include` | Catch-all: run the code but show neither code nor output (setup chunks) |
| `warning` / `message` | Suppress warnings / package-load messages |
| `error` | Allow the document to render even if the chunk errors |
| `fig-cap` / `fig-alt` | Figure caption / alt text |
| `fig-width` / `fig-height` | Figure dimensions in inches |
| `code-fold` | Collapse code behind a "Show the code" toggle |
| `code-summary` | Custom text for the fold toggle |
| `cache` | Reuse the chunk's previous output if the code hasn't changed |

Document-wide defaults for any of these go under `execute:` in the YAML front matter (Section 2); per-chunk `#|` options override the default for that one chunk.

#### Figure sizing — static vs dynamic width

Two different options control this, and mixing them up is the usual source of confusion:

- **`fig-width` / `fig-height`** (inches) set the size of the graphics device the plot is *drawn* at. This changes the plot's internal proportions — a narrower `fig-width` with the same ggplot theme makes text and points look relatively larger, because everything is drawn onto a smaller canvas.
- **`out-width` / `out-height`** set how the *resulting image is displayed* in the browser (the HTML `width`/`height`/CSS), independent of how it was drawn. This is what you want for controlling on-page size without touching font/point proportions.

**Static size** — always the same physical size, regardless of column width:
````markdown
```{r}
#| fig-width: 8
#| fig-height: 5
#| out-width: "6in"

ggplot(data, aes(x, y)) + geom_line()
```
````

**Dynamic size — fill whatever column it's placed in**, so it automatically resizes if you later wrap it in `.column-page` or `.column-body-outset`:
````markdown
```{r}
#| fig-width: 8
#| fig-height: 5
#| out-width: "100%"

ggplot(data, aes(x, y)) + geom_line()
```
````
`out-width: "100%"` is a CSS percentage relative to the plot's immediate container, so it scales responsively with the browser window and with whichever layout div it sits inside.

**Setting a consistent default for the whole document** (recommended if you have several plots and want them all to look the same rather than setting this per chunk) — add to the YAML front matter:
```yaml
execute:
  fig-width: 8
  fig-height: 5
knitr:
  opts_chunk:
    out.width: "100%"
```
With that default in place, an individual chunk only needs to override `out-width` when it wants an exception (e.g. a smaller inline diagram):
````markdown
```{r}
#| out-width: "50%"

ggplot(data, aes(x, y)) + geom_point()
```
````

#### Inline code execution
```markdown
There were `r nrow(data)` admissions this month.
```

#### Callouts
```markdown
::: {.callout-note}
Five types are available: `note`, `tip`, `warning`, `important`, `caution`.
:::

::: {.callout-tip title="Optional custom title"}
Body text for the callout.
:::

::: {.callout-caution collapse="true"}
## Click to expand
This callout starts collapsed. Use `collapse="false"` to start expanded
but still collapsible.
:::
```

#### Tabsets
````markdown
::: {.panel-tabset}
## Code

```{r}
#| echo: fenced
#| eval: false
head(mtcars)
```

## Output

```{r}
#| echo: false
head(mtcars)
```
:::
````
Each `##` heading inside a `.panel-tabset` div becomes one tab.

#### Layout — columns and margins
```markdown
::: {.column-margin}
Margin note or small figure.
:::

::: {.column-page}
Content wider than the default body column.
:::

::: {.column-body-outset}
Slightly wider than body, short of full page width.
:::

::: {layout-ncol=2}
![Plot one](img1.png)
![Plot two](img2.png)
:::

::: {layout="[[70,30], [100]]"}
Row 1: 70% / 30% split. Row 2: full width.
:::

::: {layout="[[40,-20,40]]"}
Two 40%-wide columns with a 20% gap between (negative values = spacing).
:::
```
Column classes (`.column-margin`, `.column-page`, `.column-screen`, `.column-body-outset`) control *where* something sits on the page; `layout-ncol`/`layout-nrow`/custom arrays control multi-item grids *within* a block.

#### Cross-references
```markdown
See @fig-sales-trend for detail, and @tbl-summary for the underlying figures.
```
Requires the target to carry a reserved-prefix label:
```markdown
![Sales trend](plot.png){#fig-sales-trend}

| A | B |
|---|---|
| 1 | 2 |
: Summary table {#tbl-summary}
```
Reserved prefixes: `fig-`, `tbl-`, `eq-`, `sec-`, `lst-` (code listings), plus a few theorem-style ones. Section references (`@sec-...`) additionally need `number-sections: true` in the YAML. Avoid underscores in labels — use hyphens.

#### Conditional / format-specific content
```markdown
::: {.content-visible when-format="html"}
This paragraph only appears in HTML output.
:::

::: {.content-hidden when-format="pdf"}
This paragraph is hidden from PDF output only.
:::
```

#### Includes (splitting a report across files)
```markdown
{{< include _shared-intro.qmd >}}
```

#### Raw HTML passthrough
````markdown
```{=html}
<div class="custom-banner">Raw HTML that Quarto won't touch</div>
```
````

#### Dashboards (`format: dashboard`)

A separate output format for single-screen layouts (KPI-style pages), built from the same heading and div syntax as everything above.

```yaml
---
title: "Ward Activity"
author: "Jasper"
logo: images/logo.png
format:
  dashboard:
    orientation: columns   # default is rows; this switches ## headings to columns
    theme: cosmo
---
```

**Layout** — heading level controls the structure: level 1 (`#`) = page, level 2 (`##`) = row or column (depending on `orientation`), each code chunk beneath becomes a card automatically:
````markdown
## Row {height=70%}

```{r}
#| title: Admissions by week
ggplot(data, aes(week, admissions)) + geom_col()
```

## Row {height=30%}

```{r}
#| title: Bed occupancy
plot(occupancy)
```
````
`{height=...}`/`{width=...}` on the heading set that row/column's relative size; omit it and Quarto fills available space automatically. A card's title comes from the `#| title:` chunk option.

**Value boxes** — for a single headline metric:
````markdown
```{r}
#| component: valuebox
#| title: "Beds occupied"

list(value = 87, icon = "hospital", color = "primary")
```
````

**Tabsets inside a dashboard** — add `.tabset` to a row/column heading rather than using `.panel-tabset`:
```markdown
## Row {.tabset}
```

**Sidebar** — apply `.sidebar` to a level 1 (whole-dashboard) or level 2 (single-page) heading for input controls.

**Multiple pages** — stack level 1 headings above your rows/columns; each becomes a navbar entry:
```markdown
# Overview
## Row
...
# Detail
## Row
...
```

---

## 4. HTML

Raw HTML drops straight into a `.qmd` and renders as-is for HTML output — useful for the handful of things markdown/Quarto syntax doesn't cover directly.

#### Collapsible section (native, no JS needed)
```html
<details>
<summary>Click to expand</summary>

Content that's hidden until the reader clicks the summary line.
Add a blank line after `<summary>` if you want the body parsed as markdown.

</details>

<details open>
<summary>Expanded by default</summary>
Content here.
</details>
```

#### Div and span
```html
<div class="highlight-box">
Block-level content.
</div>

<span class="badge">inline snippet</span>
```

#### Line break / horizontal rule
```html
Text before<br>text after, same paragraph.
<hr>
```

#### Anchor / jump links
```html
<a id="top"></a>
...
<a href="#top">Back to top</a>
```

#### Comments
```html
<!-- Not shown in rendered output -->
```

#### Embedding external content
```html
<iframe src="https://example.com" width="100%" height="400"></iframe>
```

#### Small text-level helpers
```html
<mark>highlighted text</mark>
<kbd>Ctrl</kbd> + <kbd>C</kbd>
<small>fine print</small>
<abbr title="National Health Service">NHS</abbr>
```

---

## 5. CSS

Basic styling for a bespoke HTML report — enough to override Quarto/Bootstrap defaults without pulling in a framework.

#### Where to put it
```yaml
# in the YAML front matter
format:
  html:
    css: styles.css
```
```html
<!-- or inline, directly in the .qmd body -->
<style>
.highlight-box { background-color: #fef3c7; }
</style>
```
````markdown
<!-- or as a dedicated CSS chunk -->
```{css}
.highlight-box { background-color: #fef3c7; }
```
````

#### Selector basics
```css
p { }                 /* every <p> element */
.highlight-box { }    /* every element with class="highlight-box" */
#report-title { }     /* the single element with id="report-title" */
div p { }             /* every <p> inside a <div> (descendant) */
div > p { }           /* every <p> that is a direct child of a <div> */
a:hover { }           /* a link, while hovered */
```

#### Common properties
```css
.example {
  color: #1f2937;
  background-color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Segoe UI", sans-serif;
  text-align: left;
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  margin: 0 auto;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

#### Useful selectors for overriding Quarto's own output
```css
.callout-note { border-left-color: #2563eb; }   /* recolour a callout type */
.panel-tabset .nav-link { font-weight: 500; }   /* tab labels */
.column-margin { font-size: 0.85rem; }          /* margin note text */
.quarto-title-banner { background-color: #111827; }
table.table { font-size: 0.9rem; }              /* gt/kable output tables */
pre, code { font-family: "Cascadia Code", monospace; }
```

#### Basic flex layout (for simple side-by-side blocks outside Quarto's own layout divs)
```css
.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

#### Responsive tweak (narrow screens)
```css
@media (max-width: 600px) {
  .example { padding: 0.5rem; }
}
```

