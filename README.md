# Search Engine Project

A full-stack search engine prototype featuring advanced query matching, filtering, autocomplete suggestions, UX enhancements, and analytics.

## 🚀 What’s implemented

### Core search features

- Keyword search in title/content
- Fuzzy search (typos/misspellings via Levenshtein predicate)
- Search suggestions/autocomplete by prefix
- Search history + trending queries
- Saved searches (front-end localStorage)
- Search analytics summary (query count, trending, total bytes)
- Scoring+ranking by relevance, date, title, length

### Advanced filters

- Category filter (Data, Web, Database, Security, DevOps, General)
- Domain filter (from URL domain value)

### UI / UX features

- Google-like top bar with index style layout
- Mode switch: Text (web), Link search, Voice
- Link search mode: searches database and displays relevant links as clickable cards with titles, snippets, and domains
- Dark mode toggle with persist in localStorage
- Result card with snippet + summary + metadata
- AI assistant summary text shown above results with intelligent content analysis and categorization
- AI analyzes search content to provide category insights (Programming, Database, Web Dev, DevOps) and key takeaways
- Search result highlighting via snippet generation
- Load more (infinite-like client paging)
- Share results (web share or clipboard fallback)
- Search performance metrics display (count + ms)

### Backend

- Express.js server with routes:
  - `GET /api/search` -> search + filters + pagination
  - `GET /api/search/history`
  - `GET /api/search/analytics`
  - `GET /api/search/suggestions`
- Mock CSV-backed data store with metadata augmentation (date/category/domain/content_length)
- Search controller + in-memory tracking

## 📁 Repo structure

- `src/`: backend code
  - `server.js`
  - `controllers/searchController.js`
  - `routes/searchRoutes.js`
  - `config/db.js`
- `frontend/`: React + Tailwind app
  - `src/services/api.js`
  - `src/components/` + pages
- `demo_dataset.csv`: sample dataset

## 🛠️ Setup and run

### Backend

```bash
cd "c:\Users\Pasul\training shnoor\day2\search-engine"
npm install
npm run dev
```

### Frontend

```bash
cd "c:\Users\Pasul\training shnoor\day2\search-engine\frontend"
npm install
npm run dev
```

Open the Vite frontend URL (usually `http://localhost:5173`). Backend is at `http://localhost:5000`.

## 🔧 How to use

1. Enter query in search bar.
2. Use filter controls for date/category/domain/length.
3. Choose sort and click `Apply Filters`.
4. Click `Load More` to append next page.
5. Save search in the side panel.
6. Share/export results using top buttons.

## 🧪 Notes

- Current dataset is from `demo_dataset.csv` and in-memory; replace with real DB for production.
- User accounts and login are not yet implemented; can be added as next enhancement.
- PDF export is text-based under prototype behavior.

## ✅ Next improvements

- Add real authentication and Bookmark API
- Add search summaries using external NLU endpoints (Gemini-like)
- Add persistent backend storage and indexing (Postgres / Elastic)
- Add unit tests and e2e coverage
