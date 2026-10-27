# Signal — AI & technology journal

Signal is a responsive editorial website for AI and technology stories, built with React, TypeScript, Vite, and Express. It runs with clearly identified AI-generated concept articles out of the box. If configured with a NewsAPI key, it can also fetch and label real headlines from the original publishers.

## Requirements

- Node.js 20 or newer
- npm
- Optional: a [NewsAPI](https://newsapi.org/) API key for live headlines

## Getting started

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The Express API runs on port `8787`; Vite proxies `/api` requests to it. Leave `NEWS_API_KEY` blank to use the sample concept articles.

To enable headlines, set `NEWS_API_KEY` in `.env`, then restart the server. The key stays on the server and is not included in browser bundles. Live headlines are supplied by NewsAPI and link to their original sources; availability depends on your NewsAPI plan and key.

## Production

```bash
npm run build
npm start
```

The Express server serves the production build and the `/api/news` endpoint on port `8787` (or `PORT` if set).

## Features

- Home, latest, trending, category, story, search, reading-list, About, and Contact pages
- Responsive layouts, light/dark theme, reduced-motion support, page transitions, and scroll reveals
- Search, category filters, pagination, persistent bookmarks and theme preference
- Newsletter signup interface stored locally in the current browser
- Share with the native share sheet where supported, otherwise copy the article link
- Optional server-side NewsAPI integration with explicit live/concept labels, source attribution, and API error states
- Semantic landmarks, accessible labels, route-aware document title/description, and a not-found page

Newsletter and contact forms are front-end demo interactions; they do not send email or persist to a server. Concept articles are illustrative AI-generated samples, not real-time or independently reported news.
