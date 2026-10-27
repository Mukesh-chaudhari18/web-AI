import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 8787;
const root = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "10kb" }));

app.get("/api/news", async (_request, response) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    response.json({ source: "sample", articles: null });
    return;
  }

  try {
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", '"artificial intelligence" OR "generative AI" OR "machine learning"');
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("language", "en");
    url.searchParams.set("pageSize", "30");
    const upstream = await fetch(url, { headers: { "X-Api-Key": apiKey } });
    const payload = await upstream.json();
    if (!upstream.ok || payload.status !== "ok") {
      response.status(upstream.status || 502).json({
        error: payload.message || "The news provider could not return headlines.",
      });
      return;
    }

    response.json({
      source: "live",
      articles: payload.articles.map((article, index) => ({
        id: `live-${index}-${article.publishedAt}`,
        title: article.title,
        excerpt: article.description || "Open the original source for the full story.",
        category: "AI & Research",
        author: article.author || article.source?.name || "News desk",
        date: article.publishedAt,
        readTime: "5 min read",
        image: article.urlToImage || "",
        imageAlt: article.title,
        slug: "",
        content: [],
        sourceName: article.source?.name || "Original source",
        sourceUrl: article.url,
        featured: false,
        trending: false,
      })),
    });
  } catch (error) {
    console.error("News provider request failed:", error);
    response.status(502).json({ error: "Could not reach the live news provider." });
  }
});

app.use(express.static(path.join(root, "dist")));
app.get("*", (_request, response, next) => {
  response.sendFile(path.join(root, "dist", "index.html"), (error) => {
    if (error) next();
  });
});

app.listen(port, () => {
  console.log(`Signal server listening on http://localhost:${port}`);
});
