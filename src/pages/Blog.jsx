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

function BlogArticle({ post }) {
  const paragraphs = (post.content || post.excerpt || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

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
        </div>
        {post.coverImage ? (
          <img loading="eager" decoding="async" width="760" height="520" src={post.coverImage} alt={`${post.title} cover`} />
        ) : (
          <div className="blog-article-art" aria-hidden="true">
            <span>{post.category || "Insight"}</span>
          </div>
        )}
      </div>
      <div className="blog-content">
        {paragraphs.length > 0 ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
          <p>This post is being prepared by the Influnexa team.</p>
        )}
      </div>
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

    getBlogPosts("published")
      .then((nextPosts) => {
        if (active) {
          setPosts(nextPosts.length > 0 ? nextPosts : fallbackBlogPosts);
          setStatus({ type: "success", message: "" });
        }
      })
      .catch(() => {
        if (active) {
          setPosts(fallbackBlogPosts);
          setStatus({ type: "success", message: "" });
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const featuredPost = useMemo(() => posts[0], [posts]);
  const remainingPosts = useMemo(() => posts.slice(1), [posts]);
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
          post ? <BlogArticle post={post} /> : (
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
              <span>Influnexa blog</span>
              <h1>Influencer marketing insights for brands that need trust, content, and growth.</h1>
              <p>
                Read practical guidance on creator sourcing, product review campaigns, UGC production, and agency-managed influencer marketing.
              </p>
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
