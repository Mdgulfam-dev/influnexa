import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { getBlogPost, getBlogPosts } from "../lib/api";

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

function BlogCard({ post, featured = false }) {
  return (
    <article className={`blog-page-card ${featured ? "featured" : ""}`}>
      {post.coverImage ? (
        <img loading="lazy" src={post.coverImage} alt="" />
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
        <a href={articlePath(post)}>Read article</a>
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
          <img loading="lazy" src={post.coverImage} alt="" />
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
  const [theme, setTheme] = useState("light");
  const [posts, setPosts] = useState(fallbackBlogPosts);
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const slug = window.location.pathname.replace(/^\/blog\/?/, "").replace(/\/$/, "");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
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

  return (
    <div className={`site blog-page ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}>
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
