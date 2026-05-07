# AGENTS.md

This file helps coding agents become productive quickly in this repository.

## Project Snapshot

- Core app: `app.js` (main UI/state/map/charts logic), `style.css`, `data.json`.
- Entry page: `index.html` redirects to the latest versioned dashboard (`shikmim_research_dashboard_v12.html`).
- Local tooling: `server.js` (static hosting + `/api/update`) and `updateFromSheets.js` (regenerates `data.json`).
- Versioned bundles: `shikmim_research_dashboard_v10.html`, `shikmim_research_dashboard_v11.html`, `shikmim_research_dashboard_v12.html` plus build scripts.

For full product/background documentation, see [README.md](README.md).

## Run And Update Commands

- Local server (recommended): `node server.js`
- Local server on custom port: `node server.js 3000`
- Static-only local serve (no update API): `python -m http.server 8080`
- Regenerate data from Google Sheets/local CSV fallback: `node updateFromSheets.js`
- Trigger data refresh through local API: `curl http://localhost:8080/api/update`
- Rebuild versioned bundles:
  - `node build_v8.js`
  - `node build_v10.js`
  - `node build_v11.js`

## Hosting Modes (Critical)

- GitHub Pages is static in this project: runtime must rely on `index.html`, `app.js`, `style.css`, and committed `data.json`.
- `/api/update` works only when running `server.js` locally (or another Node host).
- If data changes are needed for static hosting: run `node updateFromSheets.js` locally, then commit/push `data.json`.

## Data And Integration Notes

- Primary source is a Google Sheets URL configured in `updateFromSheets.js` (`DEFAULT_SHEET_URL`).
- `updateFromSheets.js` discovers sheet tabs by Hebrew/English candidates and falls back to local CSV files when fetch fails.
- ArcGIS polygon geometry is fetched at runtime in `app.js`; sheet-derived polygon metadata is merged into those features.

## Code Conventions And Pitfalls

- Keep files UTF-8 encoded; content includes Hebrew and RTL UI expectations.
- Preserve RTL behavior in layout/UI changes.
- No formal test suite is present; validate by running the app and checking core tabs/filters/charts.
- Build scripts inline `style.css`, `data.json`, and `app.js` into versioned HTML files.
- For bundled outputs, data script block (`id="_dataInline"`) must exist before the inlined app script.

## Safe Change Workflow

1. Edit source files (`app.js`, `style.css`, data/update scripts) first.
2. Run `node updateFromSheets.js` only when data pipeline changes are involved.
3. Run local server and verify map load, polygon rendering, and chart panels.
4. If updating a versioned artifact, run the corresponding `build_v*.js` script.
5. If changing default release target, update redirect in `index.html`.

## High-Value Files To Read First

- `README.md` (setup, update flow, sheet schema)
- `app.js` (application behavior)
- `updateFromSheets.js` (data ingestion/normalization)
- `server.js` (local API behavior)
- `build_v10.js` and `build_v11.js` (artifact generation patterns)