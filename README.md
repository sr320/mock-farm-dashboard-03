# Shellfish Farm Outplant Dashboard

A polished, lightweight static web dashboard for visualizing mock shellfish farm outplant monitoring data over four years. Built with React, Vite, and Recharts — no backend required.

![Dashboard screenshot placeholder](docs/screenshot-placeholder.png)

> **Note:** Add a screenshot to `docs/screenshot-placeholder.png` after running the dashboard locally.

## Overview

This dashboard presents simulated multi-year monitoring data from four shellfish farm sites, comparing priming treatments across growth, temperature, and survival metrics. It is designed as a shareable demo suitable for GitHub Pages hosting.

## Data Description

All data are **simulated** for demonstration purposes.

| Dimension | Values |
|-----------|--------|
| **Sites** | Baywater, Sequim Bay, Goose Point, Westcott |
| **Treatments** | Control, Heat primed, Freshwater primed, Immune primed, Combined stress primed |
| **Metrics** | Growth (mm shell height), Temperature (°C), Survival (%) |
| **Time span** | 4 years (Year 1–Year 4), monthly time points |

Mock data patterns:
- Growth generally increases over time
- Survival generally declines over time
- Temperature shows seasonal cycles
- Site and treatment differences are intentionally embedded

Data source: `src/data/mockShellfishData.js` (960 records generated programmatically).

## Features

- Interactive filters (site, treatment, metric, year)
- Summary statistic cards
- Time-series line chart
- Treatment comparison grouped bar chart
- Site comparison bar chart
- Sortable, searchable, paginated data table
- Geographic site map with interactive markers (OpenStreetMap)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

## Install Dependencies

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173/mock-farm-dashboard-03/`).

## Build for Production

```bash
npm run build
```

Output is written to the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Deploy to GitHub Pages

This project is configured for GitHub Pages with base path `/mock-farm-dashboard-03/` (must match the repository name).

### GitHub Pages setup (required — fixes blank page)

A blank page means GitHub Pages is serving **source files** instead of the **built app**.

1. Push to `main` (the GitHub Action builds and publishes the app to the **`docs/`** folder).
2. In your repository go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set **Branch** to **`main`** and **Folder** to **`/docs`** (not `/ (root)`).
5. Save and wait 1–2 minutes.

Your site will be at:

```
https://<your-username>.github.io/mock-farm-dashboard-03/
```

### Manual deploy (alternative)

```bash
npm run build
cp -r dist/* docs/
cp dist/.nojekyll docs/
git add docs/
git commit -m "Update GitHub Pages build"
git push origin main
```

Then confirm Pages is set to **main** branch, **`/docs`** folder as above.

### Troubleshooting a blank page

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank white page | Pages serving `main` root (dev `index.html` loads `/src/main.jsx`) | Switch Pages folder to **`/docs`** |
| 404 on JS/CSS files | Wrong base path in `vite.config.js` | `base` must match repo name: `/mock-farm-dashboard-03/` |
| `/map` route 404 | Missing SPA fallback | Build copies `index.html` → `404.html` automatically |

### Important: Repository name

The Vite `base` path must match your GitHub repository name. It is currently set to `/mock-farm-dashboard-03/`. If you rename the repo, update `base` in `vite.config.js`:

```js
base: '/your-repo-name/',
```

The React Router basename is derived automatically from this setting.

## Project Structure

```
shellfish-farm-dashboard/
├── README.md
├── package.json
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── data/
    │   └── mockShellfishData.js
    ├── pages/
    │   ├── DashboardPage.jsx
    │   └── MapPage.jsx
    └── components/
        ├── Header.jsx
        ├── Filters.jsx
        ├── SummaryCards.jsx
        ├── TimeSeriesChart.jsx
        ├── TreatmentComparisonChart.jsx
        ├── SiteComparisonChart.jsx
        ├── DataTable.jsx
        └── SiteMap.jsx
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy to GitHub Pages |

## License

Mock demonstration project — use freely for collaboration and prototyping.
