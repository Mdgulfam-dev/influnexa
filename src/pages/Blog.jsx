import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { getBlogPost, getBlogPosts } from "../lib/api";
import SEO, { absoluteUrl, breadcrumbSchema, pageSchema, SITE_URL } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";

const fallbackBlogPosts = [
  {
    title: "How Product Reviews Build Buyer Trust Before Paid Ads Scale",
    slug: "how-product-reviews-build-buyer-trust",
    category: "Reviews",
    readTime: "7 min read",
    author: "Influnexa Team",
    excerpt: "A practical look at how review campaigns make paid growth more credible.",
    content:
      "Product reviews work because they reduce uncertainty before a buyer meets your ad. A strong review campaign gives shoppers clear product context, authentic creator use cases, and proof that real people have tested what you sell.\n\nFor brands, the best review programs are structured around audience fit, product education, proof collection, and reporting. That makes every creator post easier to trust and every paid campaign easier to scale.",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "The Agency Workflow Behind High-Quality UGC Campaigns",
    slug: "agency-workflow-high-quality-ugc-campaigns",
    category: "UGC",
    readTime: "5 min read",
    author: "Influnexa Team",
    excerpt: "How briefs, approvals, production, and reporting create stronger creator assets.",
    content:
      "High-quality UGC is not random content. It comes from clear briefs, creator matching, product context, approval checkpoints, and a feedback loop that keeps the final assets useful across paid and organic channels.\n\nThe strongest campaigns define the audience, the product message, usage scenarios, hook options, and usage rights before creators begin production.",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "How to Choose Creators for Product Rating Campaigns",
    slug: "how-to-choose-creators-product-rating-campaigns",
    category: "Research",
    readTime: "6 min read",
    author: "Influnexa Team",
    excerpt: "The audience, content, and trust signals that matter before creator selection.",
    content:
      "Creator selection should start with relevance, not follower count. Product rating campaigns need creators whose audience already understands the category, trusts the format, and expects practical product opinions.\n\nBefore approval, review content quality, comment behavior, audience geography, language fit, past brand work, and whether the creator can explain the product clearly.",
    publishedAt: new Date().toISOString(),
  },
];

function formatDate(value) {
  if (!value) return "Recently published";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function articlePath(post) {
  return `/blog/${post.slug || post._id}`;
}

function textSummary(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function slugifyText(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isShortHeading(value) {
  const text = value.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount > 12 || /[.!?]$/.test(text)) {
    return false;
  }

  return /:$/.test(text) || /^[A-Z][A-Za-z0-9&'’(),\-/ ]+$/.test(text);
}

function parseInlineList(text) {
  const listMatch = text.match(/^(.+?:)\s+(.+)$/);

  if (!listMatch) {
    return null;
  }

  const [, intro, rest] = listMatch;
  const items = rest
    .split(/\s+(?=[A-Z][A-Za-z0-9&'’()/+-]*(?:\s+[A-Za-z0-9&'’()/+-]+){0,5}(?:,|$))/)
    .map((item) => item.replace(/,$/, "").trim())
    .filter((item) => item.length > 2);

  if (items.length < 3) {
    return null;
  }

  return { intro, items };
}

function addSmartSectionBreaks(value = "") {
  const sectionPattern = [
    "Table of Contents",
    "Introduction",
    "What Is [A-Z][A-Za-z0-9&'’(),\\-/ ]+\\?",
    "Why [A-Z][A-Za-z0-9&'’(),\\-/ ]+ Matters",
    "Types of [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Define Your [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Know Your [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Key Factors [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Red Flags [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Step-by-Step [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Real-World [A-Z][A-Za-z0-9&'’(),\\-/ ]+",
    "Industry Statistics",
    "Best Practices",
    "Common Mistakes",
    "Recommended Tools",
    "Frequently Asked Questions",
    "Key Takeaways",
    "Conclusion",
    "Call to Action",
  ].join("|");
  const sectionRegex = new RegExp(`\\s+(${sectionPattern})(?=\\s|$)`, "g");

  return value.replace(sectionRegex, "\n\n$1\n");
}

function flushParagraph(paragraphLines, blocks) {
  if (paragraphLines.length === 0) {
    return;
  }

  const text = paragraphLines.join(" ").replace(/\s+/g, " ").trim();
  const inlineList = parseInlineList(text);

  if (inlineList) {
    blocks.push({ type: "paragraph", text: inlineList.intro });
    blocks.push({ type: "list", ordered: false, items: inlineList.items });
  } else {
    blocks.push({ type: "paragraph", text });
  }

  paragraphLines.length = 0;
}

function parseBlogContent(value = "") {
  const blocks = [];
  const paragraphLines = [];
  let activeList = null;
  let paragraphBreaks = 0;
  const lines = addSmartSectionBreaks(value)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\t/g, "  ").trim());

  const flushList = () => {
    if (activeList?.items.length) {
      blocks.push(activeList);
    }
    activeList = null;
  };

  lines.forEach((line) => {
    if (!line) {
      flushParagraph(paragraphLines, blocks);
      flushList();
      paragraphBreaks += 1;
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s*(.+)$/);
    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (headingMatch) {
      flushParagraph(paragraphLines, blocks);
      flushList();
      const markerLevel = headingMatch[1].length;
      const text = headingMatch[2].replace(/^#+\s*/, "").trim();

      if (text) {
        blocks.push({ type: "heading", level: markerLevel === 1 ? 2 : markerLevel, text });
      }
      paragraphBreaks = 0;
      return;
    }

    if (bulletMatch || numberedMatch) {
      flushParagraph(paragraphLines, blocks);
      const ordered = Boolean(numberedMatch);
      const text = (bulletMatch?.[1] || numberedMatch?.[1] || "").trim();

      if (!activeList || activeList.ordered !== ordered) {
        flushList();
        activeList = { type: "list", ordered, items: [] };
      }

      activeList.items.push(text);
      paragraphBreaks = 0;
      return;
    }

    if (paragraphBreaks > 0 && isShortHeading(line)) {
      flushParagraph(paragraphLines, blocks);
      flushList();
      blocks.push({ type: "heading", level: 2, text: line.replace(/:$/, "") });
      paragraphBreaks = 0;
      return;
    }

    flushList();
    paragraphLines.push(line);
    paragraphBreaks = 0;
  });

  flushParagraph(paragraphLines, blocks);
  flushList();

  return blocks;
}

function blogPostSchema(post) {
  const path = articlePath(post);
  const publishedAt = post.publishedAt || post.createdAt || new Date().toISOString();
  const modifiedAt = post.updatedAt || publishedAt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : [`${SITE_URL}/favicon.svg`],
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      "@type": "Person",
      name: post.author || "Influnexa Team",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(path),
    articleSection: post.category || "Influencer Marketing",
    keywords: [post.category, "influencer marketing", "UGC", "product reviews"].filter(Boolean),
  };
}

function BlogCard({ post, featured = false }) {
  return (
    <article className={`blog-page-card ${featured ? "featured" : ""}`}>
      {post.coverImage ? (
        <img loading="lazy" decoding="async" width="640" height="420" src={post.coverImage} alt={`${post.title} cover`} />
      ) : (
        <div className="blog-card-art" aria-hidden="true">
          <span>{post.category || "Insight"}</span>
        </div>
      )}
      <div>
        <div className="blog-meta-row">
          <span>{post.category || "Insight"}</span>
          <small>{post.readTime || "5 min read"}</small>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <a href={articlePath(post)} aria-label={`Read article: ${post.title}`}>Read article</a>
      </div>
    </article>
  );
}

function BlogArticle({ post, relatedPosts = [] }) {
  const sourceContent = (post.content || post.excerpt || "").trim();
  const articleContent = post.title && sourceContent.startsWith(post.title)
    ? sourceContent.slice(post.title.length).trim()
    : sourceContent;
  const contentBlocks = parseBlogContent(articleContent);
  const decoratedBlocks = contentBlocks.map((block, index) => {
    if (block.type !== "heading") {
      return block;
    }

    return {
      ...block,
      id: `${slugifyText(block.text) || "section"}-${index}`,
    };
  });
  const tableOfContents = decoratedBlocks.filter((block) => block.type === "heading").slice(0, 8);

  return (
    <article className="blog-article">
      <a className="blog-back-link" href="/blog">Back to blog</a>
      <div className="blog-article-hero">
        <div>
          <span>{post.category || "Insight"}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="blog-article-meta">
            <strong>{post.author || "Influnexa Team"}</strong>
            <small>{formatDate(post.publishedAt || post.createdAt)} - {post.readTime || "5 min read"}</small>
          </div>
          <div className="blog-article-signals" aria-label="Article highlights">
            <span>Strategy</span>
            <span>Execution</span>
            <span>Reporting</span>
          </div>
        </div>
        {post.coverImage ? (
          <img loading="eager" decoding="async" width="760" height="520" src={post.coverImage} alt={`${post.title} cover`} />
        ) : (
          <div className="blog-article-art" aria-hidden="true">
            <span>{post.category || "Insight"}</span>
          </div>
        )}
      </div>
      <div className={`blog-article-shell ${tableOfContents.length > 1 ? "has-toc" : "without-toc"}`}>
        {tableOfContents.length > 1 && (
          <aside className="blog-toc" aria-label="Table of contents">
            <span>In this article</span>
            {tableOfContents.map((item) => (
              <a key={item.id} href={`#${item.id}`}>{item.text}</a>
            ))}
          </aside>
        )}
        <div className="blog-content">
          {decoratedBlocks.length > 0 ? decoratedBlocks.map((block, index) => {
            if (block.type === "heading") {
              const HeadingTag = block.level === 3 ? "h3" : "h2";
              return <HeadingTag id={block.id} key={`${block.type}-${index}`}>{block.text}</HeadingTag>;
            }

            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag key={`${block.type}-${index}`}>
                  {block.items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{item}</li>)}
                </ListTag>
              );
            }

            return <p key={`${block.type}-${index}`}>{block.text}</p>;
          }) : (
            <p>This post is being prepared by the Influnexa team.</p>
          )}
        </div>
      </div>
      {relatedPosts.length > 0 && (
        <section className="blog-related" aria-label="Suggested blog posts">
          <div className="blog-section-heading">
            <span>Suggested reads</span>
            <a href="/blog">View all posts</a>
          </div>
          <div className="blog-related-grid">
            {relatedPosts.map((item) => <BlogCard key={item._id || item.slug || item.title} post={item} />)}
          </div>
        </section>
      )}
    </article>
  );
}

export default function Blog() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [posts, setPosts] = useState(fallbackBlogPosts);
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const slug = window.location.pathname.replace(/^\/blog\/?/, "").replace(/\/$/, "");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    if (slug) {
      setStatus({ type: "loading", message: "" });
      getBlogPost(slug)
        .then((nextPost) => {
          if (active) {
            setPost(nextPost);
            setStatus({ type: "success", message: "" });
          }
        })
        .catch(() => {
          const fallback = fallbackBlogPosts.find((item) => item.slug === slug);
          if (active) {
            setPost(fallback || null);
            setStatus({
              type: fallback ? "success" : "error",
              message: fallback ? "" : "This blog post could not be found.",
            });
          }
        });
      return () => {
        active = false;
      };
    }

    setPost(null);
    setStatus({ type: "loading", message: "" });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    getBlogPosts("published")
      .then((nextPosts) => {
        if (active) {
          setPosts(nextPosts.length > 0 ? nextPosts : fallbackBlogPosts);
          if (!slug) {
            setStatus({ type: "success", message: "" });
          }
        }
      })
      .catch(() => {
        if (active) {
          setPosts(fallbackBlogPosts);
          if (!slug) {
            setStatus({ type: "success", message: "" });
          }
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const featuredPost = useMemo(() => posts[0], [posts]);
  const remainingPosts = useMemo(() => posts.slice(1), [posts]);
  const categoryList = useMemo(() => {
    return [...new Set(posts.map((item) => item.category).filter(Boolean))].slice(0, 6);
  }, [posts]);
  const relatedPosts = useMemo(() => {
    if (!post) {
      return [];
    }

    const currentKey = post._id || post.slug || post.title;
    const sameCategory = posts.filter((item) => (
      (item._id || item.slug || item.title) !== currentKey
      && item.category
      && post.category
      && item.category.toLowerCase() === post.category.toLowerCase()
    ));
    const otherPosts = posts.filter((item) => (
      (item._id || item.slug || item.title) !== currentKey
      && !sameCategory.includes(item)
    ));

    return [...sameCategory, ...otherPosts].slice(0, 3);
  }, [post, posts]);
  const currentDescription = slug
    ? textSummary(post?.excerpt || post?.content || "Influnexa blog article on influencer marketing, UGC, product reviews, and creator campaign strategy.")
    : "Read Influnexa insights on influencer marketing, creator sourcing, product review campaigns, UGC production, campaign management, and reporting.";
  const currentTitle = slug && post ? post.title : "Influencer Marketing Blog";
  const currentPath = slug && post ? articlePath(post) : "/blog";
  const breadcrumbs = slug && post
    ? [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: articlePath(post) },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ];
  const jsonLd = [
    pageSchema({
      path: currentPath,
      title: currentTitle,
      description: currentDescription,
      type: slug && post ? "Article" : "CollectionPage",
      breadcrumbs,
    }),
    breadcrumbSchema(currentPath, breadcrumbs),
    slug && post ? blogPostSchema(post) : {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Influnexa Blog",
      url: absoluteUrl("/blog"),
      description: currentDescription,
      publisher: { "@id": `${SITE_URL}/#organization` },
      blogPost: posts.map((item) => ({
        "@type": "BlogPosting",
        headline: item.title,
        url: absoluteUrl(articlePath(item)),
        description: item.excerpt,
      })),
    },
  ];

  return (
    <div className={`site blog-page ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}>
      <SEO
        title={currentTitle}
        description={currentDescription}
        path={currentPath}
        type={slug && post ? "article" : "website"}
        noindex={Boolean(slug && !post && status.type === "error")}
        image={post?.coverImage || undefined}
        jsonLd={jsonLd}
      />
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />

      <main className="blog-page-main">
        {slug ? (
          post ? <BlogArticle post={post} relatedPosts={relatedPosts} /> : (
            <section className="blog-empty">
              <span>Not found</span>
              <h1>Blog post not found</h1>
              <p>{status.message || "The article may be unpublished or removed."}</p>
              <Button href="/blog">View all posts</Button>
            </section>
          )
        ) : (
          <>
            <section className="blog-index-hero">
              <div>
                <span>Influnexa blog</span>
                <h1>Influencer marketing insights for brands that need trust, content, and growth.</h1>
                <p>
                  Read practical guidance on creator sourcing, product review campaigns, UGC production, and agency-managed influencer marketing.
                </p>
              </div>
              <div className="blog-index-panel" aria-label="Blog highlights">
                <strong>{posts.length} posts</strong>
                <small>Strategy, UGC, reviews, creator selection, and campaign operations.</small>
                <div>
                  {categoryList.map((category) => <span key={category}>{category}</span>)}
                </div>
              </div>
            </section>

            {featuredPost && <BlogCard post={featuredPost} featured />}

            <section className="blog-grid-section">
              <div className="blog-section-heading">
                <span>Latest posts</span>
                <a href="/admin#blogs">Add from admin</a>
              </div>
              <div className="blog-page-grid">
                {remainingPosts.map((item) => <BlogCard key={item._id || item.slug || item.title} post={item} />)}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
