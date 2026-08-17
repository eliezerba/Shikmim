# Shikmim Research Dashboard

Interactive research dashboard and accompanying dataset for the study of sycamore fig trees (*Ficus sycomorus*), their spatial distribution, measured characteristics, avenues, and associated survey polygons.

## Repository structure

The root directory contains the files used by the current version of the dashboard. The active release is always explicit in its filename:

```text
Shikmim/
├── index.html
├── shikmim_research_dashboard_v14.html   # current dashboard
├── app.js
├── style.css
├── data.json
├── server.js
├── updateFromSheets.js
├── build_v14.js
├── README.md
├── .gitignore
└── archive/
    └── legacy-versions/                  # documentation and provenance only
```

Previous generated dashboards and version-specific development scripts are kept in `archive/legacy-versions/`:

```text
archive/legacy-versions/
├── shikmim_research_dashboard_v10.html
├── shikmim_research_dashboard_v11.html
├── shikmim_research_dashboard_v12.html
├── shikmim_research_dashboard_v13.html
├── build_v8.js
├── build_v10.js
├── build_v11.js
├── build_v13.js
└── debug_v8.js
```

When a new version replaces the active release:

1. Move the previous generated dashboard and obsolete version-specific scripts into `archive/legacy-versions/`.
2. Keep the new generated dashboard and its build script in the root.
3. Update `index.html` to point to the new current dashboard.
4. Do not delete historical files; they are retained for provenance and documentation.

## Main components

- `index.html` — public entry point, redirecting to the current dashboard.
- `shikmim_research_dashboard_v14.html` — current generated dashboard.
- `data.json` — research-data snapshot used by the dashboard.
- `app.js` — application and analytical logic.
- `style.css` — dashboard styling.
- `updateFromSheets.js` — generates or updates `data.json` from the project's working data tables.
- `server.js` — optional local development server.
- `build_v14.js` — rebuilds the current generated dashboard.
- `archive/legacy-versions/` — previous versions retained for provenance.

## Running the dashboard locally

From the repository directory:

```bash
python -m http.server 8080
```

or:

```bash
node server.js
```

Then open the local address provided by the server. The dashboard can also be deployed using GitHub Pages.

## Data provenance and updating

The dashboard reads the committed `data.json` snapshot and does not modify research data dynamically in the public static deployment. The working data are converted into `data.json` using `updateFromSheets.js`.

When the underlying research data change, generate, review, and commit the new `data.json` together with any corresponding analytical or dashboard changes.

## Reproducibility and preservation

A dashboard release should be interpreted together with its committed `data.json`, analytical and application code, and generated dashboard file. Git history preserves changes between versions. Publication-associated releases may additionally be preserved in a long-term research repository with a persistent identifier.

## Data and citation

An archived, citable version of the research dataset and accompanying code is available on Zenodo:

**DOI: [10.5281/zenodo.21978527](https://doi.org/10.5281/zenodo.21978527)**
