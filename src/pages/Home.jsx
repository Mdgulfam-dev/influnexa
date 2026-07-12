import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import influnexaLogo from "../assets/influnexa-logo.png";
import { getBlogPosts } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema, SITE_URL } from "../lib/seo";

const logos = ["NOVA", "LUMEN", "KIN", "APEX", "VERDANT", "ORBIT", "MONO", "RIFT"];

const stats = [
  ["10,000+", "Verified Creators"],
  ["500+", "Campaigns Delivered"],
  ["50+", "Countries Reached"],
  ["98%", "Client Satisfaction"],
  ["120M+", "Audience Reach"],
];

const services = [
  {
    code: "IM",
    title: "Influencer Marketing",
    copy: "Agency-led creator campaigns planned around your audience, product category, budget, and growth target.",
    points: ["Shortlist strategy", "Market-by-market creator fit", "Launch oversight"],
  },
  {
    code: "RR",
    title: "Rating & Review Campaigns",
    copy: "Structured product rating and review programs that create authentic trust signals for buyers.",
    points: ["Trust-building content", "Review proof collection", "Post-publish validation"],
  },
  {
    code: "UG",
    title: "UGC Content Production",
    copy: "Creator-shot photos, demos, reels, testimonials, and ad-ready assets for paid and organic channels.",
    points: ["Paid social assets", "Creative testing inputs", "Raw + edited delivery"],
  },
  {
    code: "CM",
    title: "Campaign Management",
    copy: "End-to-end briefing, creator outreach, negotiation, contracting, approvals, posting, and reporting.",
    points: ["Single point ownership", "Approval systems", "Timeline control"],
  },
  {
    code: "PS",
    title: "Product Seeding",
    copy: "Product dispatch planning, delivery tracking, creator guidance, review timelines, and proof collection.",
    points: ["Dispatch coordination", "Delivery tracking", "Creator follow-ups"],
  },
  {
    code: "AR",
    title: "Analytics & Reporting",
    copy: "Clear campaign reports covering content delivery, reach, engagement, review status, and business learnings.",
    points: ["Executive dashboards", "Performance summaries", "Next-step insight"],
  },
];

const workflowSteps = [
  {
    icon: "brief",
    title: "brief",
    copy: "We work with you to determine your goals, then make suggestions off of best practise and data.",
  },
  {
    icon: "search",
    title: "search",
    copy: "Using your brief and our unique, in-depth detailed, extensive, growing data points on our system, we'll find your perfect Real Influencers.",
  },
  {
    icon: "train",
    title: "train",
    copy: "Selected Real Influencers are trained thoroughly and have specific deliverables and targets.",
  },
  {
    icon: "manage",
    title: "manage",
    copy: "We manage the campaign on your behalf, ensuring that everything's on track and runs smoothly.",
  },
  {
    icon: "report",
    title: "report",
    copy: "We'll provide a detailed report on all outcomes, including statistical data and Q&A responses.",
  },
];

const reviewWorkflow = [
  "Product understanding",
  "Market and competitor research",
  "Creator shortlist",
  "Client approval",
  "Product dispatch",
  "Review content creation",
  "Publish and verify",
  "Report and optimize",
];

const industries = [
  "Fashion",
  "Beauty",
  "Fitness",
  "Technology",
  "Gaming",
  "Food",
  "Travel",
  "Finance",
  "Education",
  "Lifestyle",
  "Healthcare",
  "Automotive",
];

const influencers = [
  {
    name: "Khaby Lame",
    category: "Comedy",
    specialty: "Silent comedy and life-hack reaction content",
    country: "Senegal / Italy",
    languages: "Wordless global comedy",
    sourceUrl: "https://en.wikipedia.org/wiki/Khaby_Lame",
    metrics: [
      ["160.3M", "TikTok followers"],
      ["12.6M", "YouTube subscribers"],
      ["4.6B", "YouTube views"],
      ["Most-followed", "TikTok creator"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Khaby_Lame%2C_Nov_2025_%28cropped1%29.jpg/500px-Khaby_Lame%2C_Nov_2025_%28cropped1%29.jpg",
  },
  {
    name: "Marques Brownlee",
    category: "Technology",
    specialty: "Consumer electronics reviews and tech explainers",
    country: "United States",
    languages: "English",
    sourceUrl: "https://en.wikipedia.org/wiki/Marques_Brownlee",
    metrics: [
      ["20.9M", "YouTube subscribers"],
      ["5.374B", "Main-channel views"],
      ["2008", "YouTube start"],
      ["MKBHD", "Creator brand"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Marques_Brownlee_cropped.jpg/500px-Marques_Brownlee_cropped.jpg",
  },
  {
    name: "Zach King",
    category: "Visual Effects",
    specialty: "Digital sleight-of-hand short-form video",
    country: "United States",
    languages: "English",
    sourceUrl: "https://en.wikipedia.org/wiki/Zach_King",
    metrics: [
      ["84.4M", "TikTok followers"],
      ["43M", "YouTube subscribers"],
      ["23B", "YouTube views"],
      ["Filmmaker", "Creator type"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zach_King_Photo.jpg/500px-Zach_King_Photo.jpg",
  },
];

const heroSignals = ["Strategy-led", "Brand-safe", "Human-reviewed", "Ready to scale"];

const heroCampaignFlow = [
  ["Brief", "Audience, markets, product fit"],
  ["Match", "Creator style and trust signals"],
  ["Approve", "Brand review before outreach"],
  ["Launch", "Managed content and reporting"],
];

const reasons = [
  "Manual Market Research",
  "Verified Influencers",
  "Dedicated Campaign Managers",
  "Audience Quality Checks",
  "Clear Reporting",
  "Global Creator Network",
  "Product Review Expertise",
  "Transparent Budgets",
  "Fast Agency Execution",
  "End-to-End Support",
];

const brandSignals = [
  ["Creator Discovery", "Human-led sourcing across niche, language, market, and content style."],
  ["Campaign Systems", "Structured approvals, timelines, shipping, compliance, and reporting."],
  ["Content Quality", "UGC, review, and influencer output designed to look premium and perform."],
];

const caseStudies = [
  ["Skincare Launch", "Beauty", "86 creators", "18.4M reach", "8.7%", "4.8x", "Influnexa helped us turn creator trust into measurable first-month revenue."],
  ["Product Review Sprint", "Technology", "42 creators", "7.9M reach", "6.2%", "3.6x", "The creator fit, review quality, and final report were stronger than our previous agency work."],
  ["DTC Holiday Push", "Fashion", "118 creators", "24.1M reach", "9.1%", "5.2x", "Campaign setup, approvals, and content reuse all moved faster than expected."],
];

const testimonials = [
  ["Elena Brooks", "CMO, Lumen Beauty", "A premium campaign partner with the operational discipline of an enterprise agency team."],
  ["Jordan Lee", "Creator, Tech Reviews", "The briefs are clear, product expectations are realistic, and communication stays professional."],
  ["Priya Menon", "Founder, Orbit Home", "We launched in three countries without building a creator team from scratch."],
];

const faqs = [
  ["How does the campaign process work?", "You share your product, target audience, countries, budget, and goals. Influnexa researches creator options, shares a shortlist for approval, manages contracts and content, then reports results."],
  ["How is pricing structured?", "Pricing depends on creator volume, markets, deliverables, licensing, and management level. Fixed campaign packages and custom retainers are both supported."],
  ["How are creators selected?", "Our agency team researches creators manually using niche relevance, content quality, audience fit, engagement behavior, location, language, and previous brand suitability."],
  ["Do influencers apply for campaigns on this website?", "No. This website is not a marketplace where influencers apply to campaigns. Influnexa works as an agency and manages creator selection directly with the client."],
  ["How long does a campaign take?", "Most campaigns can start planning within a few days, with launch timing depending on creator approval, product shipping, content review, and publishing schedule."],
  ["Which countries are supported?", "Influnexa supports creator collaborations across North America, Europe, the Middle East, Asia-Pacific, Latin America, and Africa."],
  ["What reporting is included?", "Reports include creator list, content links, rating and review status, reach, impressions, engagement, audience response, proof of posting, and campaign learnings."],
  ["What support do we receive?", "Brands get strategy, market research, creator sourcing, brief support, negotiation, review coordination, posting checks, and final campaign analysis."],
];

const homeDescription =
  "Influnexa is a global influencer marketing agency for brands that need creator research, product review campaigns, UGC production, product seeding, campaign management, and clear reporting.";

const homeBreadcrumbs = [
  { name: "Home", path: "/" },
];

const homeJsonLd = [
  pageSchema({
    path: "/",
    title: "Influnexa Global Influencer Marketing Agency",
    description: homeDescription,
    breadcrumbs: homeBreadcrumbs,
  }),
  breadcrumbSchema("/", homeBreadcrumbs),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Influnexa influencer marketing services",
    itemListElement: services.map((service, index) => ({
      "@type": "Service",
      position: index + 1,
      name: service.title,
      description: service.copy,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "Worldwide",
      serviceType: service.title,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${SITE_URL}/#organization` },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: testimonials[0][0],
    },
    reviewBody: testimonials[0][2],
  },
];

const fallbackBlogPosts = [
  {
    title: "How Product Reviews Build Buyer Trust Before Paid Ads Scale",
    slug: "how-product-reviews-build-buyer-trust",
    category: "Reviews",
    readTime: "7 min read",
    excerpt: "A practical look at how review campaigns make paid growth more credible.",
  },
  {
    title: "The Agency Workflow Behind High-Quality UGC Campaigns",
    slug: "agency-workflow-high-quality-ugc-campaigns",
    category: "UGC",
    readTime: "5 min read",
    excerpt: "How briefs, approvals, production, and reporting create stronger creator assets.",
  },
  {
    title: "How to Choose Creators for Product Rating Campaigns",
    slug: "how-to-choose-creators-product-rating-campaigns",
    category: "Research",
    readTime: "6 min read",
    excerpt: "The audience, content, and trust signals that matter before creator selection.",
  },
];

function SectionHeader({ eyebrow, title, children, light = false }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className={`mb-3 text-sm font-bold uppercase tracking-[0.22em] ${light ? "text-cyan-200" : "text-primary"}`}>
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-black tracking-tight md:text-5xl ${light ? "text-white" : "text-slate-950 dark:text-white"}`}>
        {title}
      </h2>
      {children && (
        <p className={`mt-5 text-base leading-8 md:text-lg ${light ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
          {children}
        </p>
      )}
    </div>
  );
}

function WorkflowIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 4,
  };

  return (
    <svg className="workflow-icon" viewBox="0 0 120 120" aria-hidden="true">
      {type === "brief" && (
        <>
          <path {...common} d="M26 18h44l24 24v60H26z" />
          <path {...common} d="M70 18v24h24" />
          <path {...common} d="M40 46h30M40 61h24M40 76h18" />
          <path {...common} d="m67 86 26-26 13 13-26 26-18 5z" />
        </>
      )}
      {type === "search" && (
        <>
          <rect {...common} x="34" y="30" width="52" height="70" rx="8" />
          <path {...common} d="M54 42h12M56 89h8M48 20c7-7 17-7 24 0M40 12c12-12 28-12 40 0" />
          <circle cx="60" cy="63" r="14" fill="currentColor" />
        </>
      )}
      {type === "train" && (
        <>
          <path {...common} d="m60 22 30 17v34L60 90 30 73V39zM30 39l30 17 30-17M60 56v34" />
          <path {...common} d="M60 12v10M60 90v18M18 34h12M90 34h12M18 78h12M90 78h12M30 20l8 8M90 20l-8 8M30 92l8-8M90 92l-8-8" />
        </>
      )}
      {type === "manage" && (
        <>
          <circle {...common} cx="60" cy="60" r="36" />
          <circle {...common} cx="46" cy="52" r="8" />
          <circle {...common} cx="75" cy="48" r="6" />
          <path {...common} d="M42 76h28" />
        </>
      )}
      {type === "report" && (
        <>
          <rect {...common} x="20" y="28" width="80" height="54" rx="4" />
          <path {...common} d="M48 96h24M60 82v14M36 68V56M52 68V44M68 68V50M84 68V38M34 72h52" />
        </>
      )}
    </svg>
  );
}

function ContactIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };

  return (
    <span className="footer-contact-icon" aria-hidden="true">
      {type === "email" ? (
        <svg viewBox="0 0 24 24">
          <rect {...common} x="3" y="5" width="18" height="14" rx="3" />
          <path {...common} d="m4 7 8 6 8-6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path {...common} d="M7.4 19.5 3.8 20.6l1.1-3.5A8.5 8.5 0 1 1 7.4 19.5Z" />
          <path {...common} d="M9.2 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.8 1.4 1.9 2.4 3.4 3.1l.6-.7c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.6v.5c0 .3-.1.6-.5.8-.5.3-1.1.4-1.8.3-3-.4-6.5-3.7-7-6.7-.1-.5.1-1 .4-1.2Z" />
        </svg>
      )}
    </span>
  );
}

function Globe() {
  const points = [
    ["18%", "34%"],
    ["31%", "52%"],
    ["48%", "38%"],
    ["62%", "46%"],
    ["72%", "29%"],
    ["80%", "58%"],
  ];

  return (
    <div className="globe" aria-label="Animated global creator activity map">
      <div className="globe-orbit orbit-one" />
      <div className="globe-orbit orbit-two" />
      <div className="globe-grid" />
      {points.map(([left, top], index) => (
        <span key={`${left}-${top}`} className="globe-pin" style={{ left, top, animationDelay: `${index * 0.35}s` }} />
      ))}
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-panel mx-auto max-w-4xl divide-y divide-slate-200 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
      {faqs.map(([question, answer], index) => (
        <div className="faq-item" key={question}>
          <button
            className="faq-question-button flex w-full items-center justify-between gap-5 px-6 py-5 text-left text-base font-bold text-slate-950 dark:text-white"
            type="button"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span className="faq-question-text">{question}</span>
            <span className="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-primary dark:bg-white/10">
              {open === index ? "-" : "+"}
            </span>
          </button>
          {open === index && <p className="faq-answer px-6 pb-6 leading-7 text-slate-600 dark:text-slate-300">{answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [blogPosts, setBlogPosts] = useState(fallbackBlogPosts);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let active = true;

    getBlogPosts("published")
      .then((posts) => {
        if (active && posts.length > 0) {
          setBlogPosts(posts.slice(0, 3));
        }
      })
      .catch(() => {
        setBlogPosts(fallbackBlogPosts);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={`site ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}>
      <SEO
        title="Influnexa | Global Influencer Marketing Agency"
        description={homeDescription}
        path="/"
        jsonLd={homeJsonLd}
      />
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />

      <main>
        <section id="home" className="hero-shell relative overflow-hidden px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <div className="mb-6 inline-flex rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-bold text-primary shadow-lg shadow-indigo-100 backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-cyan-200">
                Global creator campaigns for serious brands
              </div>
              <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl dark:text-white">
                Premium Influencer Campaigns Built to Create{" "}
                <span className="animated-gradient-text">Measurable Trust</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl dark:text-slate-300">
                Influnexa operates as your external creator growth team: strategy, sourcing, briefing, product logistics, approvals, publishing checks, and board-ready reporting.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button className="hero-start-campaign-button" href="/register/brand">Start a Campaign</Button>
                <Button href="/register/influencer" variant="secondary">
                  Join as Creator
                </Button>
              </div>
              <div className="hero-signal-row mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {heroSignals.map((item) => (
                  <div key={item} className="rounded-3xl border border-white/70 bg-white/70 p-4 text-sm font-bold text-slate-700 shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 min-h-[520px]">
              <Globe />
              <div className="hero-dashboard">
                <div className="dashboard-top">
                  <span>Campaign studio</span>
                  <strong>Review + UGC launch plan</strong>
                </div>
                <div className="hero-flow-list">
                  {heroCampaignFlow.map(([title, copy]) => (
                    <div key={title}>
                      <strong>{title}</strong>
                      <span>{copy}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-approval-strip">
                  <span>Curated creator fit</span>
                  <span>Brand approval first</span>
                  <span>Proof-led reporting</span>
                </div>
              </div>
              <div className="creator-card creator-one">
                <img loading="lazy" decoding="async" width="96" height="96" src={influencers[0].image} alt="Creator profile for a product review campaign" />
                <div>
                  <strong>Review campaign</strong>
                  <span>Creator matched to product story</span>
                </div>
              </div>
              <div className="creator-card creator-two">
                <img loading="lazy" decoding="async" width="96" height="96" src={influencers[1].image} alt="Creator profile for a UGC production campaign" />
                <div>
                  <strong>UGC production</strong>
                  <span>Content brief ready for approval</span>
                </div>
              </div>
              <div className="floating-stat stat-one hero-note-card">
                <strong>Audience fit</strong>
                <span>Creators reviewed for niche, tone, and market relevance.</span>
              </div>
              <div className="floating-stat stat-two hero-note-card">
                <strong>Premium control</strong>
                <span>Briefs, approvals, logistics, and reporting stay managed.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/70 py-8 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto max-w-7xl overflow-hidden px-4">
            <div className="logo-track">
              {[...logos, ...logos].map((logo, index) => (
                <span key={`${logo}-${index}`}>{logo}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="section-spotlight">
              <span>Modern growth partner</span>
              <h2>Built for creator campaigns that need strategy, speed, and proof.</h2>
              <p>
                Influnexa combines hands-on campaign operations with a polished reporting layer, so brands can move from creator shortlist to verified outcomes without building an internal team.
              </p>
              <div className="section-spotlight-list">
                {brandSignals.map(([title, copy]) => (
                  <div key={title}>
                    <strong>{title}</strong>
                    <span>{copy}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="metrics-stage">
              <div className="metrics-stage-grid">
                {stats.map(([value, label]) => (
                  <div key={label} className="metric-card-modern">
                    <small>{label}</small>
                    <div className="counter text-3xl font-black text-primary md:text-4xl">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Services" title="A modern agency for influencer marketing and product reviews">
            From market research to final reporting, Influnexa runs campaigns for brands that need trust-building content, authentic product reviews, and high-quality creator assets.
          </SectionHeader>
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {services.map(({ code, title, copy, points }) => (
              <article key={title} className="service-card-modern group">
                <div className="service-card-head">
                  <span className="icon-tile">{code}</span>
                  <small>Agency service</small>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <div className="service-point-list">
                  {points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section px-4 py-24 lg:px-6" id="workflow">
          <SectionHeader eyebrow="Workflow" title="How it Works" light>
            From brief to report, each campaign follows a clear step flow built around real creator fit, campaign control, and measurable outcomes.
          </SectionHeader>
          <div className="workflow-road mx-auto max-w-7xl">
            {workflowSteps.map(({ icon, title, copy }, index) => (
              <article key={title} className="workflow-step" style={{ animationDelay: `${index * 0.07}s` }}>
                <WorkflowIcon type={icon} />
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="brands" className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Product review process" title="A sharper campaign system, presented like a modern operator">
            Product review campaigns need structure: market context, creator fit, product logistics, content quality, posting proof, and transparent reporting.
          </SectionHeader>
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="process-board">
              {reviewWorkflow.map((step, index) => (
                <article key={step} className="process-mini-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </article>
              ))}
            </div>
            <div className="process-aside">
              <small>Campaign discipline</small>
              <h3>From shortlist to shipping to proof-of-posting, every step is structured.</h3>
              <p>
                Instead of generic execution, Influnexa runs campaigns with clear decision checkpoints, polished content control, and a reporting layer clients can actually use.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Industries" title="Creator coverage for every growth category" />
          <div className="industry-cloud mx-auto max-w-7xl">
            {industries.map((industry) => (
              <div key={industry} className="industry-card">{industry}</div>
            ))}
          </div>
        </section>

        <section id="influencers" className="creator-network-section px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Creator network" title="Real public creator examples for brand-safe campaign planning">
            Explore source-backed influencer profiles across comedy, technology, and short-form visual storytelling. These are public examples for research quality, not partnership claims.
          </SectionHeader>
          <div className="creator-network-grid mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {influencers.map((creator) => (
              <article key={creator.name} className="influencer-card influencer-card-modern">
                <div className="creator-photo-wrap">
                  <img loading="lazy" decoding="async" width="480" height="480" src={creator.image} alt={`${creator.name}, ${creator.category} creator profile`} />
                  <div className="creator-photo-overlay">
                    <span>{creator.category}</span>
                    <strong>{creator.specialty}</strong>
                  </div>
                </div>
                <div className="p-6 creator-profile-body">
                  <div className="creator-profile-top">
                    <span>{creator.country}</span>
                    <small>{creator.languages}</small>
                  </div>
                  <h3 className="text-2xl font-black">{creator.name}</h3>
                  <div className="creator-metrics">
                    {creator.metrics.map(([value, label]) => (
                      <span key={label}><strong>{value}</strong><small>{label}</small></span>
                    ))}
                  </div>
                  <a className="creator-source-link" href={creator.sourceUrl} target="_blank" rel="noreferrer">
                    View public source
                  </a>
                  <p className="creator-disclaimer">Public data example</p>
                  <Button className="mt-4 w-full" href="#contact">Request Similar Creators</Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Why choose us" title="Built for serious brands, not random applications" />
          <div className="trust-grid mx-auto max-w-7xl gap-4">
            {reasons.map((reason) => (
              <div key={reason} className="reason-card">
                <span />
                {reason}
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden bg-slate-950 px-4 py-24 text-white lg:px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow="Global reach" title="Agency-managed creator sourcing across key markets" light>
                We research creators by market, language, product category, audience quality, and brand fit before sharing options with the client.
              </SectionHeader>
              <div className="trust-banner">
                <span>50+ countries activated</span>
                <span>Multi-language creator sourcing</span>
                <span>Local cultural fit review</span>
              </div>
            </div>
            <Globe />
          </div>
        </section>

        <section id="case-studies" className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Case studies" title="Campaigns engineered around business outcomes" />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {caseStudies.map(([objective, industry, creators, reach, engagement, roi, quote]) => (
              <article key={objective} className="case-card case-study-card">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{industry}</p>
                <h3>{objective}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Creators", creators],
                    ["Reach", reach],
                    ["Engagement", engagement],
                    ["ROI", roi],
                  ].map(([label, value]) => (
                    <span key={label}><strong>{value}</strong>{label}</span>
                  ))}
                </div>
                <p className="mt-6 text-slate-600 dark:text-slate-300">"{quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Testimonials" title="Loved by brands and creators" />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {testimonials.map(([name, role, quote], index) => (
              <article key={name} className="testimonial-card testimonial-card-modern">
                <div className="text-sm font-black uppercase tracking-[0.18em] text-cyan-500">5.0 rated partner</div>
                <p>"{quote}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <img loading="lazy" decoding="async" width="96" height="96" src={influencers[index % influencers.length].image} alt={`${name} profile`} />
                  <div>
                    <strong>{name}</strong>
                    <span>{role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="FAQ" title="Answers before you launch" />
          <FAQ />
        </section>

        <section id="blog" className="px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Blog" title="Influencer marketing insights and trends" />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post._id || post.title} className="blog-card insight-card">
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt || post.readTime}</p>
                <small>{post.readTime}</small>
                <a className="blog-card-link" href={`/blog/${post.slug || post._id}`}>Read article</a>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button className="blog-view-all-button" href="/blog" variant="secondary">View All Blog Posts</Button>
          </div>
        </section>

        <section id="register" className="register-section px-4 py-20 lg:px-6">
          <SectionHeader eyebrow="Register" title="Start as a brand or join as a creator">
            Brands can request an agency-managed campaign. Influencers can submit their profile to be considered for future product review, UGC, and influencer marketing opportunities.
          </SectionHeader>
          <div className="register-panel mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="register-choice-card">
              <span>Brand</span>
              <h3>Need influencer marketing or product reviews?</h3>
              <p>Share your product, audience, budget, campaign goals, review needs, and target markets.</p>
              <Button href="/register/brand">Register as Brand</Button>
            </article>
            <article className="register-choice-card creator">
              <span>Influencer</span>
              <h3>Want to join our creator database?</h3>
              <p>Submit your profile, audience details, platforms, categories, content rates, and shipping details.</p>
              <Button href="/register/influencer">Register as Influencer</Button>
            </article>
          </div>
        </section>

        <section id="contact" className="px-4 py-20 lg:px-6">
          <div className="final-cta mx-auto max-w-7xl rounded-[32px] p-8 text-center text-white md:p-16">
            <h2 className="mx-auto max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Ready to Grow Your Brand with Influencer Marketing?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">
              Build trust, collect authentic product reviews, produce better UGC, and launch agency-managed creator campaigns across the world.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="#register" variant="dark">Book Free Consultation</Button>
              <Button href="/register/brand">Launch Your Campaign</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-14 text-white lg:px-6">
        <div className="footer-panel mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <a className="footer-brand-lockup" href="/#home" aria-label="Influnexa home">
              <span className="footer-logo-frame">
                <img src={influnexaLogo} alt="Influnexa" />
              </span>
              <span className="footer-brand-copy">
                <strong>Influnexa</strong>
                <small>Influence, connect, grow</small>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Premium global influencer marketing for brands, agencies, startups, e-commerce teams, and creators.
            </p>
            <form className="mt-6 flex max-w-sm gap-2" aria-label="Join Influnexa email updates">
              <input className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none" placeholder="Email address" type="email" aria-label="Email address" />
              <button className="footer-join-button rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950" type="submit">Join</button>
            </form>
          </div>
          {[
            ["Services", ["Influencer Marketing", "#services"], ["UGC Content", "#services"], ["Reviews", "#services"], ["Analytics", "#services"]],
            ["Resources", ["Blog", "/blog"], ["Case Studies", "#case-studies"], ["Creator Guide", "/register/influencer"], ["Brand Guide", "/register/brand"]],
            ["Legal", ["Privacy", "#home"], ["Terms", "#home"], ["Compliance", "#home"], ["Security", "#home"]],
            [
              "Contact",
              ["info.influnexa@gmail.com", "mailto:info.influnexa@gmail.com", "email"],
              ["+91 90014 02531", "https://wa.me/919001402531", "whatsapp"],
              ["+91 94053 65870", "https://wa.me/919405365870", "whatsapp"],
            ],
          ].map(([heading, ...links]) => (
            <div key={heading}>
              <h3 className="font-bold">{heading}</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                {links.map(([label, href, icon]) => (
                  <a className={icon ? "footer-contact-link" : undefined} key={label} href={href}>
                    {icon && <ContactIcon type={icon} />}
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
