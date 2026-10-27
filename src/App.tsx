import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, Clock3,
  Command, Instagram, Linkedin, Mail, Menu, Moon, Search, Share2, Sparkles,
  Sun, Twitter, X, Zap,
} from "lucide-react";
import {
  Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams,
} from "react-router-dom";
import { articles as sampleArticles, categories, categoryDescriptions, type Article } from "./data";

const pageSize = 6;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => readStorage("signal-theme", "light"));
  const [bookmarks, setBookmarks] = useState<string[]>(() => readStorage("signal-bookmarks", []));
  const [liveArticles, setLiveArticles] = useState<Article[] | null>(null);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("signal-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetch("/api/news")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Could not load live headlines.");
        if (active && payload.source === "live" && Array.isArray(payload.articles)) setLiveArticles(payload.articles as Article[]);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Could not load live headlines.";
        if (!message.includes("not configured")) setNewsError(message);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("signal-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const source = liveArticles ?? sampleArticles;
  const toggleBookmark = (id: string) => {
    setBookmarks((current) => current.includes(id) ? current.filter((saved) => saved !== id) : [...current, id]);
  };
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const article = location.pathname.startsWith("/article/")
      ? source.find((item) => item.slug === location.pathname.slice("/article/".length))
        ?? sampleArticles.find((item) => item.slug === location.pathname.slice("/article/".length))
      : undefined;
    const category = location.pathname.startsWith("/category/")
      ? decodeURIComponent(location.pathname.slice("/category/".length))
      : undefined;
    const titles: Record<string, string> = {
      "/": "Signal — Ideas shaping tomorrow",
      "/latest": "The latest — Signal",
      "/trending": "Trending — Signal",
      "/categories": "Explore topics — Signal",
      "/about": "About Signal",
      "/contact": "Contact Signal",
      "/saved": "Your reading list — Signal",
      "/search": "Search the journal — Signal",
    };
    document.title = article ? `${article.title} — Signal` : category ? `${category} — Signal` : titles[location.pathname] ?? "Signal — Ideas shaping tomorrow";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = article?.excerpt ?? (category ? categoryDescriptions[category] ?? "Explore the Signal journal." : "Signal is an independent journal exploring artificial intelligence, technology, and the ideas shaping tomorrow.");
  }, [location.pathname, source]);

  return (
    <div className="app-shell">
      <Header theme={theme} onTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      {newsError && <div className="api-notice" role="status">Live headlines are temporarily unavailable. Showing editorial concepts instead.</div>}
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname + location.search} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          <Routes>
            <Route path="/" element={<HomePage articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} live={Boolean(liveArticles)} />} />
            <Route path="/latest" element={<ListingPage title="The latest" eyebrow="FRESH OFF THE PRESS" articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} live={Boolean(liveArticles)} />} />
            <Route path="/trending" element={<ListingPage title="What's resonating" eyebrow="THE CONVERSATION RIGHT NOW" articles={source.filter((article) => article.trending || article.featured)} bookmarks={bookmarks} onBookmark={toggleBookmark} live={Boolean(liveArticles)} />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:category" element={<CategoryPage articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} live={Boolean(liveArticles)} />} />
            <Route path="/article/:slug" element={<ArticlePage articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/search" element={<SearchPage articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} live={Boolean(liveArticles)} />} />
            <Route path="/saved" element={<SavedPage articles={source} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function Header({ theme, onTheme }: { theme: "light" | "dark"; onTheme: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Signal home"><span className="brand-mark"><span /></span><span>signal<span className="brand-dot">.</span></span></Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/latest" onClick={() => setMobileOpen(false)}>Latest</NavLink>
          <NavLink to="/trending" onClick={() => setMobileOpen(false)}>Trending <span className="nav-spark">↗</span></NavLink>
          <NavLink to="/categories" onClick={() => setMobileOpen(false)}>Explore</NavLink>
          <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
          <div className="mobile-nav-extra"><NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink><NavLink to="/saved" onClick={() => setMobileOpen(false)}>Reading list</NavLink></div>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" aria-label="Open search" onClick={() => setSearchOpen((open) => !open)}><Search size={18} /></button>
          <Link to="/saved" className="icon-button saved-trigger" aria-label="Reading list"><Bookmark size={18} /></Link>
          <button className="icon-button theme-toggle" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} onClick={onTheme}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
          <Link className="header-cta" to="/latest">Read the journal <ArrowUpRight size={15} /></Link>
          <button className="icon-button mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {searchOpen && <motion.form className="search-popover" onSubmit={submit} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          <Search size={18} /><input autoFocus aria-label="Search stories" placeholder="Search ideas, topics, stories..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <kbd>ENTER</kbd><button className="icon-button" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={17} /></button>
        </motion.form>}
      </AnimatePresence>
    </header>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function LoadingImage({ src, alt, loading = "lazy", className = "" }: { src: string; alt: string; loading?: "eager" | "lazy"; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return <span className={`image-frame ${className}`}>
    {(!src || failed) ? <span className="image-fallback" role="img" aria-label={alt}><Sparkles size={22} /></span> : <>
      <span className={`image-skeleton ${loaded ? "is-hidden" : ""}`} aria-hidden="true" />
      <img className={`loading-image ${loaded ? "is-loaded" : ""}`} src={src} alt={alt} loading={loading} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
    </>}
  </span>;
}

function SourceLabel({ live }: { live: boolean }) {
  return live
    ? <span className="source-label live-label"><span className="live-dot" /> Live headlines</span>
    : <span className="source-label concept-label"><Sparkles size={12} /> AI-generated concepts</span>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.45, ease: "easeOut" }}>{children}</motion.div>;
}

function BookmarkButton({ article, saved, onToggle, className = "" }: { article: Article; saved: boolean; onToggle: (id: string) => void; className?: string }) {
  return <button className={`bookmark-button ${saved ? "is-saved" : ""} ${className}`} aria-label={saved ? `Remove ${article.title} from reading list` : `Save ${article.title}`} aria-pressed={saved} onClick={() => onToggle(article.id)}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /></button>;
}

function ArticleCard({ article, saved, onBookmark, index = 0 }: { article: Article; saved: boolean; onBookmark: (id: string) => void; index?: number }) {
  return (
    <Reveal className={`article-card card-delay-${index % 3}`}>
      <div className="card-image-wrap">
        <Link to={article.slug ? `/article/${article.slug}` : article.sourceUrl || "/latest"} className="card-image-link" aria-label={`Read ${article.title}`}><LoadingImage src={article.image} alt={article.imageAlt} /></Link>
        <Badge className="image-badge">{article.category}</Badge>
        <BookmarkButton article={article} saved={saved} onToggle={onBookmark} className="card-bookmark" />
      </div>
      <div className="card-copy">
        <div className="card-meta"><span>{article.author}</span><span className="meta-separator">·</span><span>{article.readTime}</span></div>
        <h3><Link to={article.slug ? `/article/${article.slug}` : article.sourceUrl || "#"}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" to={article.slug ? `/article/${article.slug}` : article.sourceUrl || "#"}>{article.sourceUrl ? "Read source" : "Read story"} <ArrowUpRight size={15} /></Link>
      </div>
    </Reveal>
  );
}

function ArticleGrid({ articles, bookmarks, onBookmark }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void }) {
  if (!articles.length) return <EmptyState title="Nothing here just yet" text="Try another topic or come back soon for more stories." />;
  return <div className="article-grid">{articles.map((article, index) => <ArticleCard key={article.id} article={article} saved={bookmarks.includes(article.id)} onBookmark={onBookmark} index={index} />)}</div>;
}

function SectionHeading({ eyebrow, title, link, linkLabel = "View all stories" }: { eyebrow: string; title: string; link?: string; linkLabel?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{link && <Link className="text-link heading-link" to={link}>{linkLabel} <ArrowRight size={16} /></Link>}</div>;
}

function Hero({ article, live }: { article: Article; live: boolean }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-kicker"><span className="hero-kicker-line" /> A JOURNAL FOR WHAT'S NEXT</div>
        <h1>Ideas shaping<br />our <span>tomorrow.</span></h1>
        <p>Thoughtful stories on AI, technology, and the people building a more curious future.</p>
        <div className="hero-actions"><Link className="button button-dark" to="/latest">Explore the latest <ArrowRight size={16} /></Link><Link className="hero-link" to="/about">A little about us <ArrowDown size={14} /></Link></div>
        <div className="hero-social-proof"><div className="avatar-stack"><span>M</span><span>A</span><span>J</span><span>+</span></div><div><strong>Curiosity, delivered.</strong><small>Join 12,000+ thoughtful readers</small></div></div>
      </div>
      <div className="hero-visual">
        <Link to={article.slug ? `/article/${article.slug}` : article.sourceUrl || "/latest"} className="hero-image-link"><LoadingImage src={article.image} alt={article.imageAlt} loading="eager" /></Link>
        <div className="hero-image-overlay" />
        <Badge className="hero-image-category">{article.category}</Badge>
        <div className="hero-image-copy"><div className="hero-story-meta"><span className="hero-featured"><span /> EDITOR'S PICK</span><span>{article.readTime}</span></div><Link to={article.slug ? `/article/${article.slug}` : "/latest"}><h2>{article.title}</h2></Link><p>{article.excerpt}</p><SourceLabel live={live} /></div>
        <div className="hero-visual-index"><span>01</span><span className="index-rule" /><span>08</span></div>
      </div>
      <div className="hero-footnote"><span>INDEPENDENT THINKING. HUMAN PERSPECTIVE.</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
    </section>
  );
}

function HomePage({ articles, bookmarks, onBookmark, live }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void; live: boolean }) {
  const [page, setPage] = useState(1);
  const featured = articles.find((article) => article.featured) ?? articles[0] ?? sampleArticles[0];
  const latest = articles.filter((article) => article.id !== featured.id);
  const pageCount = Math.max(1, Math.ceil(latest.length / pageSize));
  return (
    <>
      <div className="page-container"><Hero article={featured} live={live} />
        <div className="editorial-note"><span><Sparkles size={14} /> A NOTE ON OUR STORIES</span><SourceLabel live={live} /><p>{live ? "Headlines link to their original publishers. The original source is responsible for the reporting." : "These are AI-generated editorial concepts, not real-time reporting. Live headlines are available when an API key is configured."}</p></div>
        <section className="section-block latest-section"><SectionHeading eyebrow="THE LATEST" title="Fresh perspectives" link="/latest" />
          <ArticleGrid articles={latest.slice((page - 1) * pageSize, page * pageSize)} bookmarks={bookmarks} onBookmark={onBookmark} />
          {pageCount > 1 && <Pagination page={page} pages={pageCount} onPage={setPage} />}
        </section>
        <section className="category-feature"><div className="category-feature-top"><p className="eyebrow">A LITTLE OF EVERYTHING</p><Link className="text-link" to="/categories">All topics <ArrowRight size={15} /></Link></div><h2>Find your next<br /><span>rabbit hole.</span></h2><div className="category-pills">{categories.map((category) => <Link className={`category-pill ${category.color}`} to={`/category/${encodeURIComponent(category.name)}`} key={category.name}><span>{category.icon}</span>{category.name}<ArrowUpRight size={15} /></Link>)}</div></section>
        <Newsletter />
      </div>
    </>
  );
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  return <nav className="pagination" aria-label="Pagination"><button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page"><ArrowLeft size={16} /></button>{Array.from({ length: pages }, (_, index) => <button key={index + 1} className={page === index + 1 ? "active-page" : ""} aria-current={page === index + 1 ? "page" : undefined} onClick={() => onPage(index + 1)}>{String(index + 1).padStart(2, "0")}</button>)}<button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages} aria-label="Next page"><ArrowRight size={16} /></button></nav>;
}

function ListingPage({ title, eyebrow, articles, bookmarks, onBookmark, live }: { title: string; eyebrow: string; articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void; live: boolean }) {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(articles.length / pageSize);
  const shown = articles.slice((page - 1) * pageSize, page * pageSize);
  return <div className="page-container interior-page"><div className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}<span>.</span></h1><p className="page-intro">{live ? "Independent perspectives on the stories shaping artificial intelligence and technology." : "A collection of AI-generated story concepts. These are not real-time news or reported events."}</p><SourceLabel live={live} /></div><div className="listing-toolbar"><span>{articles.length} stories</span><span><Clock3 size={14} /> Updated {live ? "from news sources" : "for your curiosity"}</span></div><ArticleGrid articles={shown} bookmarks={bookmarks} onBookmark={onBookmark} />{pages > 1 && <Pagination page={page} pages={pages} onPage={setPage} />}<Newsletter /></div>;
}

function CategoriesPage() {
  return <div className="page-container interior-page"><div className="page-heading"><p className="eyebrow">EXPLORE BY INTEREST</p><h1>Curiosity has<br /><span>many directions.</span></h1><p className="page-intro">Take the scenic route. Find a topic that makes you think, and follow it somewhere new.</p></div><div className="category-grid">{categories.map((category) => <Reveal key={category.name}><Link className={`category-tile ${category.color}`} to={`/category/${encodeURIComponent(category.name)}`}><div className="category-tile-top"><span className="category-glyph">{category.icon}</span><ArrowUpRight size={18} /></div><div><h2>{category.name}</h2><p>{categoryDescriptions[category.name]}</p><span className="category-count">Explore topic <ArrowRight size={14} /></span></div></Link></Reveal>)}</div></div>;
}

function CategoryPage({ articles, bookmarks, onBookmark, live }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void; live: boolean }) {
  const { category = "" } = useParams();
  const name = decodeURIComponent(category);
  const results = articles.filter((article) => article.category.toLowerCase() === name.toLowerCase());
  const description = categoryDescriptions[name] ?? "Explore the latest perspectives from across the Signal journal.";
  return <div className="page-container interior-page"><Link to="/categories" className="back-link"><ArrowLeft size={15} /> All topics</Link><div className="page-heading category-heading"><p className="eyebrow">EXPLORE A TOPIC</p><h1>{name}<span>.</span></h1><p className="page-intro">{description}</p><SourceLabel live={live} /></div><ArticleGrid articles={results} bookmarks={bookmarks} onBookmark={onBookmark} /></div>;
}

function SearchPage({ articles, bookmarks, onBookmark, live }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void; live: boolean }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);
  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return [];
    return articles.filter((article) => `${article.title} ${article.excerpt} ${article.category} ${article.author}`.toLowerCase().includes(normalized));
  }, [articles, query]);
  return <div className="page-container interior-page search-page"><div className="page-heading"><p className="eyebrow">A CURIOUS MIND'S BEST TOOL</p><h1>Search the<br /><span>journal.</span></h1><p className="page-intro">Follow a question. See where it takes you.</p></div><form className="large-search" onSubmit={(event) => { event.preventDefault(); setParams(input.trim() ? { q: input.trim() } : {}); }}><Search size={20} /><input autoFocus aria-label="Search stories" placeholder="Try “creative AI” or “the future of work”" value={input} onChange={(event) => setInput(event.target.value)} /><button className="button button-dark" type="submit">Search <ArrowRight size={15} /></button></form>{query && <div className="search-results-heading"><h2>Results for “{query}”</h2><span>{results.length} {results.length === 1 ? "story" : "stories"} · {live ? "live headlines" : "AI-generated concepts"}</span></div>}<ArticleGrid articles={results} bookmarks={bookmarks} onBookmark={onBookmark} /></div>;
}

function ArticlePage({ articles, bookmarks, onBookmark }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void }) {
  const { slug = "" } = useParams();
  const article = articles.find((item) => item.slug === slug) ?? sampleArticles.find((item) => item.slug === slug);
  const [shareMessage, setShareMessage] = useState("");
  if (!article) return <NotFoundPage />;
  const related = articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 3);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: article.title, url });
      else { await navigator.clipboard.writeText(url); setShareMessage("Link copied"); window.setTimeout(() => setShareMessage(""), 2000); }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") setShareMessage("Could not share this link");
    }
  };
  return <div className="page-container article-page"><Link to="/latest" className="back-link"><ArrowLeft size={15} /> Back to the journal</Link><article><header className="article-header"><Badge>{article.category}</Badge><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><div className="author-avatar">{article.author.split(" ").map((part) => part[0]).join("")}</div><div><strong>{article.author}</strong><span>{article.date} <i>·</i> {article.readTime}</span></div><div className="article-actions"><button className="share-button" onClick={share}><Share2 size={16} /> Share</button><BookmarkButton article={article} saved={bookmarks.includes(article.id)} onToggle={onBookmark} /></div></div></header>
      <LoadingImage className="article-cover" src={article.image} alt={article.imageAlt} loading="eager" />
      {article.sourceUrl && <p className="source-attribution">Original reporting by <a href={article.sourceUrl} target="_blank" rel="noreferrer">{article.sourceName || "the publisher"} <ArrowUpRight size={13} /></a></p>}
      <div className="article-body"><aside className="article-toc"><p>IN THIS STORY</p><a href="#story">The big picture</a><a href="#more">Keep exploring</a><span><Clock3 size={14} /> {article.readTime}</span></aside><div className="article-content" id="story"><div className="article-notice"><Sparkles size={16} /><p>{article.sourceUrl ? "This article links to original publisher reporting. Visit the source for full coverage." : "This is an AI-generated editorial concept, created for illustration. It does not report real events."}</p></div>{article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="article-endmark">✳</div><div className="share-bottom"><span>Enjoyed this perspective?</span><button className="share-button" onClick={share}><Share2 size={15} /> Share this story</button>{shareMessage && <span className="share-feedback" role="status">{shareMessage}</span>}</div></div></div></article>
      {related.length > 0 && <section className="section-block related-section" id="more"><SectionHeading eyebrow="KEEP EXPLORING" title="A few more rabbit holes" link="/latest" /><ArticleGrid articles={related} bookmarks={bookmarks} onBookmark={onBookmark} />{}</section>}</div>;
}

function SavedPage({ articles, bookmarks, onBookmark }: { articles: Article[]; bookmarks: string[]; onBookmark: (id: string) => void }) {
  const saved = articles.filter((article) => bookmarks.includes(article.id));
  return <div className="page-container interior-page"><div className="page-heading"><p className="eyebrow">YOUR PERSONAL COLLECTION</p><h1>The reading<br /><span>list.</span></h1><p className="page-intro">Good ideas deserve a second look. Your saved stories live here, on this device.</p></div><ArticleGrid articles={saved} bookmarks={bookmarks} onBookmark={onBookmark} /></div>;
}

function AboutPage() {
  return <div className="page-container interior-page about-page"><div className="page-heading"><p className="eyebrow">A SMALL INTRODUCTION</p><h1>Technology is<br />a human <span>story.</span></h1><p className="page-intro">Signal is an independent journal for people who want to understand where AI and technology might take us—and who gets to shape the journey.</p></div><div className="about-visual"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85" alt="Planet Earth connected by a luminous digital network" /><span>MORE SIGNAL. LESS NOISE.</span></div><div className="about-columns"><div><p className="eyebrow">OUR POINT OF VIEW</p><h2>Curious, not breathless.</h2></div><div><p>We believe the best technology stories begin with people, not hype. They ask better questions, make room for nuance, and stay open to what we have not figured out yet.</p><p>Signal is a demo editorial experience. Sample stories on this site are AI-generated concepts, not reported events or real-time news. When a news API is connected, real headlines are clearly labeled and link back to their original publishers.</p><Link className="text-link" to="/contact">Come say hello <ArrowRight size={15} /></Link></div></div><Newsletter /></div>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return <div className="page-container interior-page contact-page"><div className="page-heading"><p className="eyebrow">OUR INBOX IS OPEN</p><h1>Good ideas start<br />with <span>hello.</span></h1><p className="page-intro">A story suggestion, a thoughtful disagreement, or just a note? We would love to hear from you.</p></div><div className="contact-layout"><div className="contact-aside"><div className="contact-icon"><Mail size={21} /></div><p className="eyebrow">THE OLD-FASHIONED WAY</p><a href="mailto:hello@signaljournal.example">hello@signaljournal.example <ArrowUpRight size={14} /></a><p>We typically respond within a couple of business days.</p></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>Your name<input required name="name" placeholder="How should we address you?" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>What's on your mind?<textarea required name="message" rows={5} placeholder="Tell us a little more..." /></label><button className="button button-dark" type="submit">{submitted ? <><Check size={16} /> Message received</> : <>Send your note <ArrowRight size={16} /></>}</button>{submitted && <p className="form-success" role="status">Thanks for reaching out. Your note is ready for our editorial team.</p>}</form></div></div>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    const subscribers = readStorage<string[]>("signal-newsletter", []);
    if (!subscribers.includes(email.trim().toLowerCase())) {
      localStorage.setItem("signal-newsletter", JSON.stringify([...subscribers, email.trim().toLowerCase()]));
    }
    setMessage("You're on the list. Look out for a little more signal.");
    setEmail("");
  };
  return <section className="newsletter"><div className="newsletter-decoration"><span /><span /><span /><span /></div><div className="newsletter-copy"><p className="eyebrow"><Zap size={13} /> THE SIGNAL LETTER</p><h2>Good ideas.<br /><span>Better mornings.</span></h2><p>A thoughtful note on AI and what's next, delivered every other Sunday. No noise. Unsubscribe whenever.</p></div><form className="newsletter-form" onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><div className="newsletter-input"><Mail size={17} /><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" aria-label="Subscribe"><ArrowRight size={17} /></button></div><span className="newsletter-note" role="status">{message || "A little wonder, straight to your inbox. No spam. Ever."}</span></form><div className="newsletter-bottom"><span>INDEPENDENTLY CURATED</span><span>MADE FOR THE CURIOUS <Sparkles size={13} /></span></div></section>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><div><Command size={22} /></div><h2>{title}</h2><p>{text}</p><Link className="text-link" to="/latest">Browse the journal <ArrowRight size={15} /></Link></div>;
}

function NotFoundPage() {
  return <div className="page-container not-found"><p className="eyebrow">A LITTLE OFF THE MAP</p><h1>Well, this is<br /><span>unexpected.</span></h1><p>That page seems to have wandered somewhere else.</p><Link className="button button-dark" to="/">Find your way home <ArrowRight size={16} /></Link></div>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link to="/" className="brand"><span className="brand-mark"><span /></span><span>signal<span className="brand-dot">.</span></span></Link><p>Ideas shaping tomorrow.<br />A journal for the curious.</p><div className="social-links"><a href="https://www.linkedin.com/" aria-label="LinkedIn"><Linkedin size={16} /></a><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={16} /></a><a href="https://twitter.com/" aria-label="Twitter"><Twitter size={16} /></a></div></div><div className="footer-column"><span>THE JOURNAL</span><Link to="/latest">Latest stories</Link><Link to="/trending">Trending now</Link><Link to="/categories">All topics</Link><Link to="/saved">Reading list</Link></div><div className="footer-column"><span>ABOUT SIGNAL</span><Link to="/about">Our perspective</Link><Link to="/contact">Get in touch</Link><a href="mailto:hello@signaljournal.example">hello@signaljournal.example</a></div><div className="footer-newsletter"><span>ONE GOOD EMAIL.</span><p>A little perspective for your inbox.</p><Link to="/#newsletter" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }}>Find your signal <ArrowRight size={15} /></Link></div></div><div className="footer-bottom"><span>© 2026 SIGNAL JOURNAL. MADE FOR THE CURIOUS.</span><span>CONCEPT STORIES ARE AI-GENERATED, NOT REAL-TIME NEWS.</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO TOP ↑</a></div></footer>;
}

export default App;
