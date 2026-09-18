import { useEffect, useState,useRef } from "react";
import React from "react";

import Navbar from "../components/Navbar";
import Button from "../components/Button";
import influnexaLogo from "../assets/influnexa-logo.png";
import { getBlogPosts, getTestimonials, submitTestimonial } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema, SITE_URL } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";
import heroImage1 from "../assets/hero-image.png";
import heroImage2 from "../assets/hero-image-2.png";
import heroImage3 from "../assets/hero-image-3.png";
import service01 from "../assets/service-01-influencer.png";
import service02 from "../assets/service-02-campaign.png";
import service03 from "../assets/service-03-ugc.png";
import service04 from "../assets/service-04-seeding.png";
import service05 from "../assets/service-05-events.png";
import service06 from "../assets/service-06-analytics.png";
import campaignImpactImage from "../assets/campaign-impact-image.png";

import beautyIndustry from "../assets/beauty.png";
import fashionIndustry from "../assets/fashion.png";
import fitnessIndustry from "../assets/fitness.png";
import technologyIndustry from "../assets/technology.png";
import foodIndustry from "../assets/food.png";
import travelIndustry from "../assets/travel.png";
import financeIndustry from "../assets/finance.png";
import educationIndustry from "../assets/education.png";
import healthcareIndustry from "../assets/healthcare.png";
import gamingIndustry from "../assets/gaming.png";
import automotiveIndustry from "../assets/automotive.png";
import ecommerceIndustry from "../assets/ecommerce.png";
import creator1 from "../assets/creator1.jpg";
import creator2 from "../assets/creator2.jpg";
import creator3 from "../assets/creator3.jpg";

const logos = ["BEAUTY", "FASHION", "TECH", "DTC", "FITNESS", "LIFESTYLE", "FOOD", "FINANCE"];

const socialLinks = [
  { label: "Facebook", type: "facebook", status: "Pending" },
  {
    label: "LinkedIn",
    type: "linkedin",
    href: "https://www.linkedin.com/company/influnexa-the-best-influencer-and-creator-marketing-company-in-india/?viewAsMember=true",
  },
  {
    label: "Instagram",
    type: "instagram",
    href: "https://www.instagram.com/influnexa.ai?igsh=MWQza3owZXlhdzJsMA==",
  },
  { label: "X (Twitter)", type: "x", status: "Pending" },
];

const stats = [
  ["10,000+", "Creator Network"],
  ["50+", "Campaigns Delivered"],
  ["8+", "Countries Reached"],
  ["98%", "Client Satisfaction"],
  ["1.3M+", "Audience Reach"],
];
const services = [
  {
    code: "01",
    icon: "people",
    image: service01,
    title: "Influencer Marketing",
    copy:
      "Build data-driven campaigns with creators who fit your audience, category, and growth goals.",
    points: [
      "Creator Discovery",
      "Campaign Strategy",
      "Execution & Management",
    ],
  },
  {
    code: "02",
    icon: "campaign",
    image: service02,
    title: "Creator Campaign Management",
    copy:
      "From outreach to approvals, we handle the entire creator collaboration process for you.",
    points: [
      "Creator Outreach",
      "Negotiation & Coordination",
      "Content & Approval Management",
    ],
  },
  {
    code: "03",
    icon: "video",
    image:service03,
    title: "UGC Content Production",
    copy:
      "Get authentic, high-quality creator content for your social media, ads, website, and product storytelling.",
    points: [
      "Reels & Short Videos",
      "Product Demos",
      "Testimonials & Ad Creatives",
    ],
  },
  {
    code: "04",
    icon: "gift",
    image:service04,
    title: "Product Seeding",
    copy:
      "Put your products in the hands of the right creators to spark authentic reviews, unboxings, and organic buzz.",
    points: [
      "Creator Gifting",
      "Unboxing Content",
      "Organic Awareness",
    ],
  },
  {
    code: "05",
    icon: "calendar",
    image:service05,
    title: "Creator Events & Activations",
    copy:
      "Plan and execute creator meetups, product launches, and offline/online events to create real impact.",
    points: [
      "Influencer Meetups",
      "Product Launches",
      "Brand Collaborations",
    ],
  },
  {
    code: "06",
    icon: "analytics",
    image:service06,
    title: "Campaign Analytics & Reporting",
    copy:
      "Track real-time performance with detailed reports and insights to measure your ROI.",
    points: [
      "Reach & Engagement",
      "Creator Performance",
      "ROI & Insights",
    ],
  },
];
const seoCapabilities = [
  "Influencer Marketing Agency in India",
  "AI Influencer Marketing Platform",
  "Find Instagram Influencers",
  "Brand Collaboration Platform",
  "UGC Creator Platform",
  "Influencer Campaign Management",
  "Creator Marketing Agency",
  "YouTube Influencer Marketing",
  "LinkedIn Influencer Marketing",
  "Nano & Micro Influencer Marketing",
  "D2C Influencer Marketing",
  "E-commerce Influencer Marketing",
  "Best Influencer Marketing Company",
  "Influencer Discovery Platform",
  "Influencer Database India",
];

const workflowSteps = [
  {
    icon: "brief",
    title: "Brief",
    copy: "We define goals, audience, markets, product context, deliverables, budget, and success metrics before sourcing begins.",
  },
  {
    icon: "search",
   title: "Discover",
    copy: "Our team builds a creator shortlist around audience quality, content fit, language, category relevance, and brand safety.",
  },
  {
    icon: "approve",
     title: "Match & Approve",
    copy: "Approved creators receive a clear brief, content direction, usage requirements, timelines, and review expectations.",
  },
  {
    icon: "manage",
    title: "Manage",
    copy: "Influnexa handles outreach, coordination, product logistics, approvals, posting checks, and creator communication.",
  },
  {
    icon: "report",
    title: "Report",
    copy: "You receive clear reporting with deliverables, proof links, reach, engagement, review status, and next-step insight.",
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
  {
    name: "Beauty & Personal Care",
    description: "Product launches, reviews and UGC campaigns.",
    image: beautyIndustry,
  },
  {
    name: "Fashion & Lifestyle",
    description: "Style creators, trends and brand storytelling.",
    image: fashionIndustry,
  },
  {
    name: "Fitness & Wellness",
    description: "Workout, nutrition and healthy living content.",
    image: fitnessIndustry,
  },
  {
    name: "Technology & Gadgets",
    description: "Reviews, demos and tech-focused creators.",
    image: technologyIndustry,
  },
  {
    name: "Food & Beverage",
    description: "Taste, discovery and lifestyle content.",
    image: foodIndustry,
  },
  {
    name: "Travel & Hospitality",
    description: "Destinations, experiences and travel stories.",
    image: travelIndustry,
  },
  {
    name: "Finance & Investment",
    description: "Awareness, education and trust-building.",
    image: financeIndustry,
  },
  {
    name: "Education & EdTech",
    description: "Learning, courses and career growth.",
    image: educationIndustry,
  },
  {
    name: "Healthcare",
    description: "Wellness, healthcare and informed choices.",
    image: healthcareIndustry,
  },
  {
    name: "Gaming & Entertainment",
    description: "Gameplay, streaming and community engagement.",
    image: gamingIndustry,
  },
  {
    name: "Automotive",
    description: "Reviews, test drives and lifestyle content.",
    image: automotiveIndustry,
  },
  {
    name: "D2C & E-commerce",
    description: "Product showcases and conversion-focused content.",
    image: ecommerceIndustry,
  },
];
const influencers = [
  {
    name: "KL BRO Biju Rithvik",
    category: "Family Lifestyle",
    specialty: "Malayalam family vlogs and short-form organic reach",
    country: "Kerala, India",
    languages: "Malayalam",
    instagramUrl:"https://www.instagram.com/kl_bro_biju_rithvik/",
     youtubeUrl:"https://www.youtube.com/channel/UCL5nlHWXVLeOsSjKH2fhmsg",
    sourceUrl: "https://en.wikipedia.org/wiki/KL_Bro_Biju",
    metrics: [
      ["84.7M", "YouTube subscribers"],
      ["100.20B", "YouTube views"],
      ["#1", "India creator list 2025"],
      ["Family", "Lifestyle category"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Biju_klbro.jpg/500px-Biju_klbro.jpg",
  },
  {
    name: "Bhuvan Bam",
    category: "Comedy & Storytelling",
    specialty: "Character-led comedy, music, and long-form digital storytelling",
    country: "Delhi, India",
    languages: "Hindi, English",
    instagramUrl:"https://www.instagram.com/bhuvan.bam22",
     youtubeUrl:"https://www.youtube.com/@BBKiVines",
    sourceUrl: "https://en.wikipedia.org/wiki/Bhuvan_Bam",
    metrics: [
      ["26.5M", "YouTube subscribers"],
      ["5.34B", "YouTube views"],
      ["BB Ki Vines", "Creator brand"],
      ["Comedy", "Content category"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Bhuvan_Bam_at_Myntra%27s_Creator_Fest_2023_event_%28cropped%29.jpg",
  },
  {
    name: "Prajakta Koli",
    category: "Lifestyle & Comedy",
    specialty: "Relatable comedy, youth culture, social impact, and brand-safe storytelling",
    country: "Mumbai, India",
    languages: "Hindi, English",
    instagramUrl:"https://www.instagram.com/MostlySane",
     youtubeUrl:"https://www.youtube.com/@MostlySane",
    sourceUrl: "https://en.wikipedia.org/wiki/Prajakta_Koli",
    metrics: [
      ["7.25M", "YouTube subscribers"],
      ["1.97B", "YouTube views"],
      ["TIME100", "Creators list 2025"],
      ["MostlySane", "Creator brand"],
    ],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Prajakta_koli_in_2023.jpj.png/500px-Prajakta_koli_in_2023.jpj.png",
  },
];

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
  "India Creator Network",
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
  ["Skincare Launch Model", "Beauty", "86 creators", "18.4M planned reach", "8.7%", "4.8x", "Example framework for trust-led creator reviews, UGC reuse, and launch-week reporting."],
  ["Product Review Sprint", "Technology", "42 creators", "7.9M planned reach", "6.2%", "3.6x", "Example framework for reviewer selection, product education, content checks, and proof collection."],
  ["DTC Holiday Push", "Fashion", "118 creators", "24.1M planned reach", "9.1%", "5.2x", "Example framework for seasonal creator production, approvals, usage rights, and performance reporting."],
];

const faqs = [
  ["How does the campaign process work?", "You share your product, target audience, countries, budget, and goals. Influnexa researches creator options, shares a shortlist for approval, manages contracts and content, then reports results."],
  ["How is pricing structured?", "Pricing depends on creator volume, markets, deliverables, licensing, and management level. Fixed campaign packages and custom retainers are both supported."],
  ["How are creators selected?", "Our agency team researches creators manually using niche relevance, content quality, audience fit, engagement behavior, location, language, and previous brand suitability."],
  ["Do influencers apply for campaigns on this website?", "No. This website is not a marketplace where influencers apply to campaigns. Influnexa works as an agency and manages creator selection directly with the client."],
  ["How long does a campaign take?", "Most campaigns can start planning within a few days, with launch timing depending on creator approval, product shipping, content review, and publishing schedule."],
  ["Which regions are supported?", "Influnexa supports creator collaborations across India, with creator research shaped around your target region, language, audience, and campaign requirements."],
  ["What reporting is included?", "Reports include creator list, content links, rating and review status, reach, impressions, engagement, audience response, proof of posting, and campaign learnings."],
  ["What support do we receive?", "Brands get strategy, market research, creator sourcing, brief support, negotiation, review coordination, posting checks, and final campaign analysis."],
];

const homeDescription =
  "Influnexa is an AI-powered influencer and creator marketing company in India. We help brands discover the right creators, manage product review and UGC campaigns, and measure results with confidence.";

const homeBreadcrumbs = [
  { name: "Home", path: "/" },
];

const homeJsonLd = [
  {
    ...pageSchema({
      path: "/",
      title: "Influnexa | AI-Powered Influencer & Creator Marketing Company in India",
      description: homeDescription,
      breadcrumbs: homeBreadcrumbs,
    }),
    keywords: seoCapabilities.join(", "),
  },
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
      areaServed: "India",
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

const initialReviewForm = {
  name: "",
  role: "",
  email: "",
  quote: "",
    type: "Brand",
  rating: "5",
};

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
    <svg
      className="howitworks-icon"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >

      {/* =====================================================
          01 — BRIEF
          Document + Pencil
          ===================================================== */}
      {type === "brief" && (
        <>
          {/* Document */}
          <path
            {...common}
            d="M27 16h43l23 23v65H27z"
          />

          {/* Folded corner */}
          <path
            {...common}
            d="M70 16v24h23"
          />

          {/* Document lines */}
          <path
            {...common}
            strokeWidth="5"
            d="M40 47h27"
          />

          <path
            {...common}
            strokeWidth="5"
            d="M40 61h27"
          />

          <path
            {...common}
            strokeWidth="5"
            d="M40 75h18"
          />

          {/* Pencil */}
          <path
            {...common}
            d="m64 91 27-27 11 11-27 27-18 5z"
          />

          <path
            {...common}
            d="m85 68 11 11"
          />

          {/* Pencil tip */}
          <path
            {...common}
            d="m57 107 5-18 13 13z"
          />
        </>
      )}


      {/* =====================================================
          02 — DISCOVER
          Creators + Magnifying Glass
          ===================================================== */}
      {type === "search" && (
        <>
          {/* Back creator */}
          <circle
            cx="60"
            cy="36"
            r="11"
            fill="currentColor"
          />

          {/* Left creator */}
          <circle
            cx="39"
            cy="45"
            r="10"
            fill="currentColor"
          />

          {/* Right creator */}
          <circle
            cx="79"
            cy="46"
            r="10"
            fill="currentColor"
          />

          {/* Left body */}
          <path
            d="M21 79c2-16 10-24 19-24s17 8 19 24"
            fill="currentColor"
          />

          {/* Center body */}
          <path
            d="M42 76c2-18 9-27 18-27s17 9 19 27"
            fill="currentColor"
          />

          {/* Right body */}
          <path
            d="M67 79c2-15 9-23 18-23s16 8 18 23"
            fill="currentColor"
          />

          {/* Magnifying glass */}
          <circle
            cx="72"
            cy="65"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
          />

          <path
            d="m87 80 17 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </>
      )}


      {/* =====================================================
          03 — MATCH & APPROVE
          Person + Checkmark
          ===================================================== */}
      {type === "approve" && (
        <>
          {/* Person head */}
          <circle
            cx="52"
            cy="39"
            r="15"
            fill="currentColor"
          />

          {/* Person body */}
          <path
            d="M23 91c2-18 13-29 29-29s27 11 29 29"
            fill="currentColor"
          />

          {/* Approval circle */}
          <circle
            cx="80"
            cy="75"
            r="18"
            fill="#ffffff"
            stroke="currentColor"
            strokeWidth="5"
          />

          {/* Check */}
          <path
            d="m70 75 7 7 13-15"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}


      {/* =====================================================
          04 — MANAGE
          Megaphone
          ===================================================== */}
      {type === "manage" && (
        <>
          {/* Main megaphone body */}
          <path
            {...common}
            fill="currentColor"
            stroke="currentColor"
            d="M30 51
               L82 31
               L82 72
               L30 56
               Z"
          />

          {/* Megaphone opening */}
          <path
            {...common}
            d="M82 31v41"
          />

          {/* Handle */}
          <path
            {...common}
            fill="currentColor"
            d="M42 57l8 3-4 20-9-3z"
          />

          {/* Sound lines */}
          <path
            {...common}
            strokeWidth="5"
            d="M92 39l10-7"
          />

          <path
            {...common}
            strokeWidth="5"
            d="M94 52h13"
          />

          <path
            {...common}
            strokeWidth="5"
            d="M92 65l10 7"
          />
        </>
      )}


      {/* =====================================================
          05 — REPORT
          Bar Chart
          ===================================================== */}
      {type === "report" && (
        <>
          {/* Base */}
          <path
            {...common}
            strokeWidth="5"
            d="M25 96h75"
          />

          {/* Small bar */}
          <rect
            x="29"
            y="70"
            width="15"
            height="26"
            rx="4"
            fill="currentColor"
          />

          {/* Medium bar */}
          <rect
            x="52"
            y="51"
            width="15"
            height="45"
            rx="4"
            fill="currentColor"
          />

          {/* Tall bar */}
          <rect
            x="75"
            y="31"
            width="15"
            height="65"
            rx="4"
            fill="currentColor"
          />

          {/* Growth line */}
          <path
            {...common}
            strokeWidth="4"
            d="M30 64l18-14 16 3 20-24"
          />

          {/* Arrow */}
          <path
            {...common}
            strokeWidth="4"
            d="M76 29h8v8"
          />
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

function SocialIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      {type === "facebook" && <path fill="currentColor" d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2Z" />}
      {type === "linkedin" && <><rect {...common} x="4" y="9" width="4" height="11" rx=".5" /><path {...common} d="M6 5.5h.01" /><path {...common} d="M11 20v-6.2c0-2.6 1.4-4.3 3.7-4.3 2.3 0 3.3 1.6 3.3 4.3V20M11 14.2c0-2.9 1.4-4.7 4.1-4.7" /></>}
      {type === "instagram" && <><rect {...common} x="3.5" y="3.5" width="17" height="17" rx="5" /><circle {...common} cx="12" cy="12" r="4" /><path {...common} d="M17.5 6.7h.01" /></>}
      {type === "x" && <path {...common} d="M5 4.5 19 19.5M19 4.5 5 19.5" />}
    </svg>
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
    <div className="globe" aria-label="Animated creator activity map">
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
    <div className="faq-showcase-list">
      {faqs.map(([question, answer], index) => {
        const isOpen = open === index;

        return (
          <article
            className={`faq-showcase-item ${
              isOpen ? "faq-showcase-item-open" : ""
            }`}
            key={question}
          >
            <button
              className="faq-showcase-question"
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              {/* Number */}
              <span className="faq-showcase-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Question */}
              <span className="faq-showcase-question-text">
                {question}
              </span>

              {/* + / - */}
              <span className="faq-showcase-toggle">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {/* Answer */}
            <div
              className={`faq-showcase-answer ${
                isOpen
                  ? "faq-showcase-answer-visible"
                  : ""
              }`}
            >
              <p>{answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
const ServiceIcon = ({ type }) => {
  const common = {
    width: 29,
    height: 29,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3.5 19c.4-3.4 2.2-5 5.5-5s5.1 1.6 5.5 5" />
          <path d="M14 15c2.8-.2 5 1.2 5.5 4" />
        </svg>
      );

    case "campaign":
      return (
        <svg {...common}>
          <path d="M3 11.5 21 3l-6 18-4-7-8-2.5Z" />
          <path d="m11 14 4-4" />
        </svg>
      );

    case "video":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="13" height="14" rx="2" />
          <path d="m16 10 5-3v10l-5-3" />
        </svg>
      );

    case "gift":
      return (
        <svg {...common}>
          <rect x="3" y="9" width="18" height="12" rx="1.5" />
          <path d="M12 9v12M2 9h20" />
          <path d="M12 9H7.5a2.5 2.5 0 1 1 0-5c2.5 0 4.5 5 4.5 5Z" />
          <path d="M12 9h4.5a2.5 2.5 0 1 0 0-5c-2.5 0-4.5 5-4.5 5Z" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 20V10" />
          <path d="M10 20V5" />
          <path d="M16 20v-8" />
          <path d="M22 20V2" />
        </svg>
      );

    default:
      return null;
  }
};

export default function Home() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [blogPosts, setBlogPosts] = useState(fallbackBlogPosts);
  const [testimonials, setTestimonials] = useState([]);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewStatus, setReviewStatus] = useState({ type: "idle", message: "" });
    const [currentHeroImage, setCurrentHeroImage] = useState(0);
   
const heroImages = [
  heroImage1,
  heroImage2,
  heroImage3,
];

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
  }, 10000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    applyTheme(theme);
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

  useEffect(() => {
    let active = true;

    getTestimonials()
      .then((items) => {
        if (active) {
          setTestimonials(items);
        }
      })
      .catch(() => {
        if (active) {
          setTestimonials([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const updateReviewField = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewStatus({ type: "loading", message: "Submitting your review..." });

    try {
      await submitTestimonial({
        ...reviewForm,
         type: reviewForm.type, // Brand or Creator
        rating: Number(reviewForm.rating) || 5,
      });
      setReviewForm(initialReviewForm);
      setReviewStatus({ type: "success", message: "Thanks! Your review will appear after admin approval." });
    } catch (error) {
      setReviewStatus({ type: "error", message: error.message });
    }
  };


const creatorTrackRef = useRef(null);

const scrollCreators = (direction) => {
  if (!creatorTrackRef.current) return;

  const card = creatorTrackRef.current.querySelector(
    ".creator-profile-card"
  );

  if (!card) return;

  const cardWidth = card.getBoundingClientRect().width;

  const gap = 20;

  creatorTrackRef.current.scrollBy({
    left:
      direction === "next"
        ? cardWidth + gap
        : -(cardWidth + gap),
    behavior: "smooth",
  });
};
  return (
    <div
      className={`site ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}
    >
      <SEO
        title="Influnexa | AI-Powered Influencer & Creator Marketing Company in India"
        description={homeDescription}
        path="/"
        jsonLd={homeJsonLd}
      />
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((value) => (value === "dark" ? "light" : "dark"))
        }
      />

      <main>
        <section
          id="home"
          className="hero-shell production-hero relative overflow-hidden px-4 pb-20 pt-32 lg:px-6 lg:pb-28 lg:pt-40"
        >
          <div className="hero-layout mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="hero-copy relative z-10">
              <div className="hero-kicker">
                ✨ AI-POWERED INFLUENCER & CREATOR MARKETING
              </div>

              <h1>
              Turn Creator Influence Into Real Brand Growth.
              </h1>

              <p>
                Influnexa connects brands with the right Instagram, YouTube, LinkedIn, and UGC creators to build authentic campaigns that reach the right audience, drive engagement, and deliver measurable results.
              </p>

              <div className="hero-actions">
                <Button
                  className="hero-start-campaign-button"
                  href="/register/brand"
                >
                  Start Your Campaign
                </Button>

                <Button
                  className="hero-join-creator-button"
                  href="/register/influencer"
                  variant="secondary"
                >
                  Join as a Creator
                </Button>
              </div>

<div className="hero-proof-row">
  {[
    ["50+", "Campaigns Managed"],
    ["10000+", "Verified Creators"],
    ["98%", "Client Satisfaction"],
  ].map(([value, label]) => (
    <span key={label}>
      <strong>{value}</strong>

      <span
        className={
          label === "Verified Creators"
            ? "verified-creators-text"
            : ""
        }
      >
        {label}
      </span>
    </span>
  ))}
</div>

            {/* Brand Tagline */}
<div className="brand-tagline">
  <span className="brand-tagline-script">
    Creators
  </span>

  <span className="brand-tagline-main">
    Build Brighter Brands
  </span>

  <span className="brand-tagline-underline" />
</div>
            </div>

       <div className="hero-visual production-hero-visual relative z-10">
  <img
    key={currentHeroImage}
    src={heroImages[currentHeroImage]}
    alt="Influnexa campaign"
    className="production-hero-image hero-image-slider"
  />
</div>
          </div>
        </section>
<section className="feature-strip">
  <div className="feature-grid">

    <div className="feature-item">
      <span className="feature-icon">◎</span>
      <div>
        <strong>Right Creators</strong>
        <span>for Your Brand</span>
      </div>
    </div>

    <div className="feature-item">
      <span className="feature-icon">ϟ</span>
      <div>
        <strong>Faster Campaign</strong>
        <span>Execution</span>
      </div>
    </div>

    <div className="feature-item">
      <span className="feature-icon">▥</span>
      <div>
        <strong>Data-Driven</strong>
        <span>Decisions</span>
      </div>
    </div>

    <div className="feature-item">
      <span className="feature-icon">♢</span>
      <div>
        <strong>Safe & Verified</strong>
        <span>Creators</span>
      </div>
    </div>

    <div className="feature-item">
      <span className="feature-icon">♧</span>
      <div>
        <strong>Real Engagement</strong>
        <span>Real Growth</span>
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

    <section className="influnexa-advantage">
  <div className="advantage-container">

    {/* LEFT CONTENT */}
    <div className="advantage-left">

      <div className="advantage-badge">
        <span className="advantage-star">✦</span>
        THE INFLUNEXA ADVANTAGE
      </div>

      <h2 className="advantage-title">
        The Right Creators.
        <br />
        The Right Audience.
        <br />
        <span>The Right Results.</span>
      </h2>

      <div className="advantage-underline"></div>

      <p className="advantage-description">
        We combine AI-powered creator discovery with hands-on campaign
        management to help brands find the right voices, execute campaigns
        faster, and turn creator content into measurable growth.
      </p>

      <div className="advantage-features">

        <div className="advantage-feature">
          <div className="feature-icon">
            ✦
          </div>

          <div>
            <h3>AI-Powered Insights</h3>
            <p>Find the best creators using real data</p>
          </div>
        </div>

        <div className="advantage-feature">
          <div className="feature-icon people-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div>
            <h3>End-to-End Management</h3>
            <p>From outreach to reporting, we handle it all</p>
          </div>
        </div>

        <div className="advantage-feature">
          <div className="feature-icon chart-icon">
            <i></i>
            <i></i>
            <i></i>
          </div>

          <div>
            <h3>Measurable Growth</h3>
            <p>Track performance and get real ROI</p>
          </div>
        </div>

      </div>

      <div className="advantage-buttons">
        <Button
                  className="hero-start-campaign-button"
                  href="/register/brand"
                >
                  Start Your Campaign
                </Button>

        <Button
                  className="hero-join-creator-button"
                   href="#register"
                  variant="secondary"
                >
                  Talk With Our Team
                </Button>
      </div>

    </div>


    {/* RIGHT DASHBOARD */}
    <div className="advantage-right">


      <div className="workflow-panel">

        <div className="workflow-heading">
          <span>HOW IT WORKS</span>

          <h3>
            From Brief to Real Impact
          </h3>

          <p>
            A simple, streamlined process to launch successful
            influencer campaigns.
          </p>
        </div>


        {/* WORKFLOW */}
        <div className="workflow-wrapper">

          {/* DOTTED ARROWS */}
{/* DOTTED ARROWS */}
<svg
  className="workflow-arrows"
  viewBox="0 0 1000 120"
  preserveAspectRatio="none"
>
  {/* 01 → 02 */}
{/* 01 → 02 */}
<path
  d="M145 70 C165 18 210 18 230 68"
  fill="none"
  stroke="white"
  strokeWidth="2"
  strokeDasharray="2 8"
  strokeLinecap="round"
/>

<text
  x="214"
  y="79"
  fill="white"
  fontSize="15"
  fontWeight="bold"
  transform="rotate(78 230 74)"
>
  ➤
</text>


{/* 02 → 03 */}
<path
  d="M345 70 C365 18 410 18 430 68"
  fill="none"
  stroke="white"
  strokeWidth="2"
  strokeDasharray="2 8"
  strokeLinecap="round"
/>

<text
  x="415"
  y="79"
  fill="white"
  fontSize="15"
  fontWeight="bold"
  transform="rotate(78 430 74)"
>
  ➤
</text>


{/* 03 → 04 */}
<path
  d="M545 70 C565 18 610 18 630 68"
  fill="none"
  stroke="white"
  strokeWidth="2"
  strokeDasharray="2 8"
  strokeLinecap="round"
/>

<text
  x="615"
  y="79"
  fill="white"
  fontSize="15"
  fontWeight="bold"
  transform="rotate(78 630 74)"
>
  ➤
</text>


{/* 04 → 05 */}
<path
  d="M745 70 C765 18 810 18 830 68"
  fill="none"
  stroke="white"
  strokeWidth="2"
  strokeDasharray="2 8"
  strokeLinecap="round"
/>

<text
  x="815"
  y="79"
  fill="white"
  fontSize="15"
  fontWeight="bold"
  transform="rotate(78 830 74)"
>
  ➤
</text>
</svg>

          <div className="workflow-grid">

            {/* 01 */}
            <div className="workflow-card">
              <div className="workflow-number">01</div>

              <div className="workflow-icon">
                ▤
              </div>

              <h4>Share Your Brief</h4>

              <p>
                Tell us your goals, audience and product fit.
              </p>
            </div>


            {/* 02 */}
            <div className="workflow-card">
              <div className="workflow-number">02</div>

              <div className="workflow-icon">
                ♟
              </div>

              <h4>AI Creator Match</h4>

              <p>
                Get the best creator recommendations using AI & data.
              </p>
            </div>


            {/* 03 */}
            <div className="workflow-card">
              <div className="workflow-number">03</div>

              <div className="workflow-icon">
                ➤
              </div>

              <h4>Manage & Collaborate</h4>

              <p>
                We handle outreach, negotiations and approvals.
              </p>
            </div>


            {/* 04 */}
            <div className="workflow-card">
              <div className="workflow-number">04</div>

              <div className="workflow-icon">
                ▮
              </div>

              <h4>Content Creation</h4>

              <p>
                Creators produce authentic, on-brand content.
              </p>
            </div>


            {/* 05 */}
            <div className="workflow-card">
              <div className="workflow-number">05</div>

              <div className="workflow-icon">
                ▮▮▮
              </div>

              <h4>Track Results</h4>

              <p>
                Measure reach, engagement and real business impact.
              </p>
            </div>

          </div>
        </div>


        {/* LOWER DASHBOARD */}
        <div className="dashboard-bottom">

          {/* CREATOR CARDS */}
          <div className="creator-area">

            <div className="creator-card creator-one">
              <div className="social-badge instagram">◎</div>

              <div className="fake-person person-one">
                  <img src={creator1} alt="Creator" />
              </div>

              <div className="creator-likes">
                ♥ 124K
              </div>
            </div>


            <div className="creator-card creator-two">
              <div className="social-badge youtube">▶</div>

              <div className="fake-person person-two">
                  <img src={creator2} alt="Creator" />
              </div>

              <div className="creator-likes">
                ♥ 220K
              </div>
            </div>


            <div className="creator-card creator-three">
              <div className="social-badge tiktok">♪</div>

              <div className="fake-person person-three">
                <img src={creator3} alt="Creator" />
              </div>

              <div className="creator-likes">
                ♥ 96K
              </div>
            </div>


            <div className="verified-creators">
              <div className="mini-faces">
                <span>👩🏻</span>
                <span>👨🏻</span>
                <span>👩🏻</span>
              </div>

              <div>
                <b>✓</b>
                <strong>Verified</strong>
                <small>Creators</small>
              </div>
            </div>

          </div>


          {/* PERFORMANCE */}
          <div className="performance-card">

            <div className="performance-header">
              <h4>Campaign Performance</h4>

              <button>
                Last 30 Days
               
              </button>
            </div>

            <div className="performance-chart">

              <span style={{ height: "18%" }}></span>
              <span style={{ height: "25%" }}></span>
              <span style={{ height: "30%" }}></span>
              <span style={{ height: "34%" }}></span>
              <span style={{ height: "40%" }}></span>
              <span style={{ height: "45%" }}></span>
              <span style={{ height: "49%" }}></span>
              <span style={{ height: "55%" }}></span>
              <span style={{ height: "61%" }}></span>
              <span style={{ height: "68%" }}></span>
              <span style={{ height: "72%" }}></span>
              <span style={{ height: "80%" }}></span>
              <span style={{ height: "87%" }}></span>
              <span style={{ height: "94%" }}></span>
              <span style={{ height: "100%" }}></span>

            </div>

            <div className="performance-stats">

              <div>
                <strong>1.3M+</strong>
                <span>Total Reach</span>
              </div>

              <div>
                <strong>120K+</strong>
                <span>Engagement</span>
              </div>

              <div>
                <strong>4.8x</strong>
                <span>Avg. ROI</span>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* BOTTOM OUTCOMES */}
      <div className="outcomes">

        <div className="outcome-card">
          <div>◎</div>
          <span>
            Better Brand
            <br />
            Awareness
          </span>
        </div>

        <div className="outcome-card">
          <div>♟</div>
          <span>
            Stronger Customer
            <br />
            Trust
          </span>
        </div>

        <div className="outcome-card">
          <div>↗</div>
          <span>
            Higher ROI
            <br />
            Real Growth
          </span>
        </div>

      </div>
    </div>
  </div>
</section>

{/* SERVICE SECTION */}

<section id="services" className="services-section">
  <div className="services-container">

    <SectionHeader
      eyebrow="OUR SERVICES"
      title={
        <>
          Everything You Need for{" "}
          <span className="services-title-accent">
            Creator-Led Growth.
          </span>
        </>
      }
    >
      From strategy to execution, Influnexa helps brands discover the right
      creators, build authentic campaigns, and drive measurable results.
    </SectionHeader>

    <div className="services-grid">
      {services.map(
        ({ code, title, copy, points, icon, image }, index) => (
          <article
            key={title}
            className={`service-card-modern service-card-${index + 1}`}
          >

            {/* Number */}
            <div className="service-number">
              {code}
            </div>

            {/* Icon */}
            <div className="icon-tile">
              <ServiceIcon type={icon} />
            </div>

            {/* Text */}
            <div className="service-content">
              <h3>{title}</h3>

              <p>{copy}</p>

              <div className="service-point-list">
                {points.map((point) => (
                  <span key={point}>
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration */}
            {image && (
              <div className="service-image">
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            )}

          </article>
        )
      )}
    </div>

    <div className="services-actions">
      <Button
                  className="hero-start-campaign-button"
                  href="/register/brand"
                >
                  Start Your Campaign
                </Button>

        <Button
                  className="hero-join-creator-button"
                   href="#register"
                  variant="secondary"
                >
                  Talk With Our Team
                </Button>
    </div>

  </div>
</section>
{/* HOW IT WORKS SECTION */}
<section className="howitworks-section" id="workflow">

  <div className="howitworks-header">

    <div className="howitworks-eyebrow">
      <span></span>
      HOW IT WORKS
      <span></span>
    </div>

    <h2>
      From Brief to{" "}
      <span className="howitworks-highlight">
        Real Impact
        <i></i>
      </span>
    </h2>

    <p>
      A simple, transparent process to launch successful creator campaigns.
    </p>
  </div>

  <div className="howitworks-container">
    {workflowSteps.map(({ icon, title, copy }, index) => (
      <React.Fragment key={title}>

        <article
          className="howitworks-card"
          style={{ animationDelay: `${index * 0.07}s` }}
        >
          <div className="howitworks-number">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="howitworks-icon-box">
            <WorkflowIcon type={icon} />
          </div>

          <h3>{title}</h3>

          <p>{copy}</p>

          <div className="howitworks-tags">
            {index === 0 && (
              <>
                <span>Goals</span>
                <span>Audience</span>
                <span>Budget</span>
              </>
            )}

            {index === 1 && (
              <>
                <span>AI Matching</span>
                <span>Shortlist</span>
                <span>Insights</span>
              </>
            )}

            {index === 2 && (
              <>
                <span>Creator Selection</span>
                <span>Approvals</span>
              </>
            )}

            {index === 3 && (
              <>
                <span>End-to-End Support</span>
                <span>On-Time</span>
              </>
            )}

            {index === 4 && (
              <>
                <span>Performance</span>
                <span>Real Growth</span>
              </>
            )}
          </div>
        </article>

        {index < workflowSteps.length - 1 && (
          <div className="howitworks-connector">
            <span></span>
            <b>›</b>
          </div>
        )}

      </React.Fragment>
    ))}
  </div>

  <div className="howitworks-actions">
   <Button
                  className="hero-start-campaign-button"
                  href="/register/brand"
                >
                  Start Your Campaign
                </Button>

        <Button
                  className="hero-join-creator-button"
                   href="#register"
                  variant="secondary"
                >
                  Talk With Our Team
                </Button>
  </div>

</section>

{/* CAMPAIGN WORKFLOW */}
<section id="brands" className="px-4 py-20 lg:px-6">
  <div className="campaign-heading-wrap">

    <div className="campaign-heading-tag">
      <span className="campaign-heading-dot"></span>
      <span>CAMPAIGN WORKFLOW</span>
    </div>

    <h2 className="campaign-heading-title">
      Every Creator Campaign,
      <br />
      Managed From{" "}
      <span>Start to Finish.</span>
    </h2>

    <p className="campaign-heading-description">
      From creator discovery to campaign delivery, every step is
      carefully managed to turn influence into measurable growth.
    </p>

  </div>

  <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">

    {/* WORKFLOW CARDS */}

    <div className="campaign-workflow-grid">

        {/* 01 */}
  <article className="campaign-step-card">
    <span>01</span>

    <div className="campaign-step-icon">
      {/* Product / box icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 7.5L12 3L20 7.5V16.5L12 21L4 16.5V7.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M4 7.5L12 12L20 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 12V21"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 5.2L16 9.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <strong>
      Understand
      <br />
      the Product
    </strong>

    <p>
      We learn about your product, audience, goals and campaign
      requirements.
    </p>
  </article>


  {/* 02 */}
  <article className="campaign-step-card">
    <span>02</span>

    <div className="campaign-step-icon">
      {/* Market research / search icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="11"
          cy="11"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M16 16L21 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 11H13.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M11 8.5V13.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <strong>
      Research
      <br />
      the Market
    </strong>

    <p>
      We analyze your category, audience and competitors to find the best
      approach.
    </p>
  </article>


  {/* 03 */}
  <article className="campaign-step-card">
    <span>03</span>

    <div className="campaign-step-icon">
      {/* Creator / users icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="8"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 20C3.5 16.7 5.9 14.5 9 14.5C12.1 14.5 14.5 16.7 14.5 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle
          cx="17"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M15.5 14.7C16 14.55 16.5 14.5 17 14.5C19.4 14.5 21 16.2 21 18.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <strong>
      Shortlist
      <br />
      Creators
    </strong>

    <p>
      We identify and shortlist creators using real data, engagement and
      brand fit.
    </p>
  </article>


  {/* 04 */}
  <article className="campaign-step-card">
    <span>04</span>

    <div className="campaign-step-icon">
      {/* Approval / check icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 12.2L10.7 15L16.5 9"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <strong>
      Get Your
      <br />
      Approval
    </strong>

    <p>
      You review and approve the creators before outreach begins.
    </p>
  </article>


  {/* 05 */}
  <article className="campaign-step-card">
    <span>05</span>

    <div className="campaign-step-icon">
      {/* Product dispatch / delivery icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3.5 6.5H14.5V17.5H3.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 10H18L21 13.5V17.5H14.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle
          cx="7"
          cy="18"
          r="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="17.5"
          cy="18"
          r="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M6 9.5H11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <strong>
      Product
      <br />
      Dispatch
    </strong>

    <p>
      We coordinate product delivery, logistics and creator communication
      to ensure a smooth process.
    </p>
  </article>


  {/* 06 */}
  <article className="campaign-step-card">
    <span>06</span>

    <div className="campaign-step-icon">
      {/* Content creation / camera icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="6.5"
          width="17"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 6.5L9.5 4H14.5L16 6.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="13"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="17.5"
          cy="9.5"
          r="0.8"
          fill="currentColor"
        />
      </svg>
    </div>

    <strong>
      Content
      <br />
      Creation
    </strong>

    <p>
      Creators produce authentic content as per the approved brief, with
      quality checks and feedback.
    </p>
  </article>


  {/* 07 */}
  <article className="campaign-step-card">
    <span>07</span>

    <div className="campaign-step-icon">
      {/* Publish / verified document icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 3.5H14L19 8.5V20.5H6V3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.5V8.5H19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 14L11 16L15.5 11.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <strong>
      Publish &
      <br />
      Verify
    </strong>

    <p>
      We track publishing, collect proof of delivery and ensure all
      deliverables are completed.
    </p>
  </article>


  {/* 08 */}
  <article className="campaign-step-card">
    <span>08</span>

    <div className="campaign-step-icon">
      {/* Report / analytics icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 19.5V4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M4 19.5H20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7 15L10 12L13 14L18.5 8.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 8.5H18.5V11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <strong>
      Report &
      <br />
      Optimize
    </strong>

    <p>
      You receive detailed results, insights and recommendations to drive
      better performance.
    </p>
  </article>

    </div>


    {/* RIGHT FEATURE PANEL */}

    <div className="campaign-impact-panel">

      <small>
        Built for real impact
      </small>

      <h3>
        From shortlist to
        shipping to
        proof-of-posting,
        every step is{" "}
        <span>structured.</span>
      </h3>
 <div className="campaign-impact-visual">
    <img
  src={campaignImpactImage}
  alt="Creator campaign performance"
/>
  </div>
      <p>
        A transparent campaign system with clear decision checkpoints, polished
        content control, and real-time reporting — so you always know what’s
        happening and what’s next.
      </p>

    </div>
     {/* Reference image */}
 

  </div>
</section>


{/* INDUSTRY WE SERVE SECTION */}
        <section id="industires" className="industry-showcase-section">
  <div className="industry-showcase-container">

    {/* Eyebrow */}
    <div className="industry-showcase-eyebrow">
      <span></span>
      <p>INDUSTRIES WE SERVE</p>
      <span></span>
    </div>

    {/* Heading */}
    <h2 className="industry-showcase-title">
      Creator Campaigns Built for{" "}
      <span>Every Industry.</span>
    </h2>

    {/* Description */}
    <p className="industry-showcase-subtitle">
      From beauty and fashion to technology, finance and beyond, we connect
      brands with creators who understand their audience and drive real
      results.
    </p>

    {/* Industry cards */}
    <div className="industry-showcase-grid">

      {industries.map((industry) => (
        <article
          key={industry.name || industry}
          className="industry-showcase-card"
        >

          {/* Image */}
          <div className="industry-showcase-image">
            <img
              src={industry.image}
              alt={industry.name || industry}
            />
          </div>

          {/* Content */}
          <div className="industry-showcase-content">

            <h3>
              {industry.name || industry}
            </h3>

            <p>
              {industry.description ||
                "Connect with relevant creators and audiences."}
            </p>

           

          </div>
        </article>
      ))}

    </div>

    {/* Bottom CTA */}
    <div className="industry-showcase-cta-wrap">
      <a
        href="/industries"
        className="industry-showcase-cta"
      >
        <span>Explore All Industries</span>
        <span className="text-2xl font-normal leading-none">→</span>
      </a>
    </div>

  </div>
</section>

{/* =========================================================
    CREATOR NETWORK
   ========================================================= */}
<section id="influencers" className="creator-showcase">

  {/* HEADER */}
  <div className="creator-showcase-header">

    <div className="creator-showcase-eyebrow">
      <span className="creator-eyebrow-line"></span>

      <span className="creator-eyebrow-label">
        CREATOR NETWORK
      </span>

      <span className="creator-eyebrow-line"></span>
    </div>


    <div className="creator-heading-row">

      <div className="creator-heading-content">

        <h2>
          Creators Who Connect With{" "}
          <span>Real Audiences.</span>
        </h2>

        <p>
          Explore creators across niches, platforms and audience
          segments to find the right fit for your next campaign.
        </p>

      </div>

    </div>

  </div>


  {/* CREATOR CARDS */}
  <div className="creator-slider-area">

    {/* PREVIOUS */}
<button
  type="button"
  className="creator-slider-arrow creator-slider-prev"
  aria-label="Previous creators"
  onClick={() => scrollCreators("prev")}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 12H5" />
    <path d="M11 18l-6-6 6-6" />
  </svg>
</button>


    
    <div className="creator-showcase-track"
    ref={creatorTrackRef}>

      {influencers.map((creator) => {

        const subscribers =
          creator.metrics?.[0]?.[0] || "—";

        const views =
          creator.metrics?.[1]?.[0] || "—";

        return (
          <article
            key={creator.name}
            className="creator-profile-card"
          >

            {/* IMAGE */}
            <div className="creator-card-image">

              <img
                loading="lazy"
                decoding="async"
                src={creator.image}
                alt={`${creator.name}, ${creator.category} creator`}
              />


              {/* CATEGORY */}
              <div className="creator-category-badge">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
                  <path d="M9.5 12l1.7 1.7 3.5-3.5" />
                </svg>

                <span>
                  {creator.category}
                </span>

              </div>

            </div>


            {/* BODY */}
            <div className="creator-card-body">

              {/* NAME */}
              <div className="creator-name-block">

                <h3>
                  {creator.name}
                </h3>

                <p>
                  {creator.specialty}
                </p>

              </div>


           {/* PLATFORM + METRICS */}
<div className="creator-stats-row">

  {/* PLATFORM ICONS */}
  <div className="creator-platforms">

    {/* Instagram */}
    <a
      href={creator.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="creator-platform-icon instagram-icon"
      aria-label={`${creator.name} Instagram`}
    >
      <img
        src="https://cdn.simpleicons.org/instagram"
        alt="Instagram"
      />
    </a>


    {/* YouTube */}
    <a
      href={creator.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="creator-platform-icon youtube-icon"
      aria-label={`${creator.name} YouTube`}
    >
      <img
        src="https://cdn.simpleicons.org/youtube"
        alt="YouTube"
      />
    </a>


  </div>


                {/* FOLLOWERS */}
                <div className="creator-metric">

                  <strong>
                    {subscribers}
                  </strong>

                  <span>
                    Followers
                  </span>

                </div>


                {/* VIEWS */}
                <div className="creator-metric">

                  <strong>
                    {views}
                  </strong>

                  <span>
                    Views
                  </span>

                </div>

              </div>


              {/* BOTTOM */}
              <div className="creator-card-bottom">

                {/* LOCATION */}
                <div className="creator-location">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />

                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>

                  <span>
                    {creator.country}
                  </span>

                </div>


                {/* PROFILE */}
                <a
                  href={creator.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="creator-profile-btn"
                >

                  <span>
                    View Profile
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>

                </a>

              </div>

            </div>

          </article>
        );
      })}

    </div>


{/* NEXT */}
<button
  type="button"
  className="creator-slider-arrow creator-slider-next"
  aria-label="Next creators"
  onClick={() => scrollCreators("next")}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
</button>

  </div>

</section>


{/* WHY CHOOSE US SECTION */}
       <section id="about" className="why-choose-section-v2">

 

  <div className="why-choose-inner-v2">

    {/* Eyebrow */}
    <div className="why-eyebrow-v2">
      <span></span>
      <p>WHY CHOOSE INFLUNEXA</p>
      <span></span>
    </div>

    {/* Heading */}
    <div className="why-heading-v2">
      <h2>
        Built for brands that expect more
        <br />
        from <strong>creator marketing.</strong>
      </h2>

      <p>
        We combine data, creativity, and on-ground expertise to deliver
        meaningful
        <br className="why-desktop-break" />
        creator campaigns that drive real business results.
      </p>
    </div>

    {/* Cards */}
    <div className="why-grid-v2">

      {/* 01 */}
      <article className="why-card-v2 why-card-teal">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="18" r="8" />
            <circle cx="15" cy="26" r="7" />
            <circle cx="49" cy="26" r="7" />
            <path d="M19 48c0-9 6-14 13-14s13 5 13 14" />
            <path d="M4 46c0-7 4-11 10-11 3 0 6 1 8 4" />
            <path d="M60 46c0-7-4-11-10-11-3 0-6 1-8 4" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">01</span>
          <h3>AI + Human Creator<br />Discovery</h3>
          <p>
            Find the right creators using audience data, niche, location,
            engagement and content-fit signals.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

      {/* 02 */}
      <article className="why-card-v2 why-card-blue">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M32 7L52 15V29C52 42 44 51 32 57C20 51 12 42 12 29V15L32 7Z" />
            <path d="M22 31L29 38L43 23" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">02</span>
          <h3>Verified Creator Network</h3>
          <p>
            Work with authentic creators screened for audience quality,
            relevance and brand safety.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

      {/* 03 */}
      <article className="why-card-v2 why-card-orange">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <circle cx="30" cy="20" r="9" />
            <path d="M14 48c0-10 7-16 16-16s16 6 16 16" />
            <circle cx="49" cy="45" r="7" />
            <path d="M49 41V49M45 45H53" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">03</span>
          <h3>Dedicated Campaign<br />Management</h3>
          <p>
            A single team handles outreach, coordination, approvals,
            logistics and on-time delivery.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

      {/* 04 */}
      <article className="why-card-v2 why-card-red">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M12 50V37" />
            <path d="M26 50V28" />
            <path d="M40 50V19" />
            <path d="M54 50V10" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">04</span>
          <h3>Audience &amp; Content Quality</h3>
          <p>
            We evaluate audience authenticity, engagement rates and content
            quality before campaigns go live.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

      {/* 05 */}
      <article className="why-card-v2 why-card-purple">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <rect x="15" y="9" width="34" height="46" rx="4" />
            <path d="M24 20H40" />
            <path d="M24 29H40" />
            <path d="M24 38H34" />
            <path d="M24 47H30" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">05</span>
          <h3>Transparent Campaign Reporting</h3>
          <p>
            Track deliverables, posting proof, reach, engagement and real
            outcomes with clear, easy-to-understand reports.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

      {/* 06 */}
      <article className="why-card-v2 why-card-location">
        <div className="why-icon-v2">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M32 56S48 40 48 27C48 18 41 11 32 11S16 18 16 27C16 40 32 56 32 56Z" />
            <circle cx="32" cy="27" r="5" />
          </svg>
        </div>

        <div className="why-card-content-v2">
          <span className="why-number-v2">06</span>
          <h3>India-Wide Creator Reach</h3>
          <p>
            Access creators across cities, languages, categories and
            audience segments — from metro to tier 3.
          </p>
        </div>

        <div className="why-arrow-v2">→</div>
      </article>

    </div>

    {/* Bottom trust bar */}
    <div className="why-trust-bar-v2">

      <div className="why-trust-icon-v2">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M13 27L21 31L27 22L32 30L39 22L45 31L52 27L48 49H16L13 27Z" />
          <path d="M16 49H48" />
        </svg>
      </div>

      <div className="why-trust-copy-v2">
        <h3>Trusted by growing brands across India</h3>
        <p>
          From D2C startups to established businesses, Influnexa helps
          brands turn creator influence into measurable growth.
        </p>
      </div>

      <div className="why-trust-divider-v2"></div>

      <a href="/register/brand" className="why-trust-button-v2">
        Start Your Campaign
        <span>→</span>
      </a>

    </div>

  </div>
</section>

        <section id="case-studies" className="px-4 py-20 lg:px-6">
          <SectionHeader
            eyebrow="Case studies"
            title="Campaigns engineered around business outcomes"
          />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {caseStudies.map(
              ([
                objective,
                industry,
                creators,
                reach,
                engagement,
                roi,
                quote,
              ]) => (
                <article key={objective} className="case-card case-study-card">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    {industry}
                  </p>
                  <h3>{objective}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Creators", creators],
                      ["Reach", reach],
                      ["Engagement", engagement],
                      ["ROI", roi],
                    ].map(([label, value]) => (
                      <span key={label}>
                        <strong>{value}</strong>
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-slate-600 dark:text-slate-300">
                    {quote}
                  </p>
                </article>
              ),
            )}
          </div>
        </section>
{/* TESMONIAL SECTION */}
        <section className="px-4 py-20 lg:px-6">
         <section className="nx-testimonials-section" id="testimonials">
  <div className="nx-testimonials-wrapper">

    {/* Header */}
    <div className="nx-testimonials-header">

      <div className="nx-testimonials-eyebrow">
        <span></span>
        <strong>TESTIMONIALS</strong>
        <span></span>
      </div>

      <h2 className="nx-testimonials-title">
        Loved by <em>brands and creators</em>
      </h2>

      <p className="nx-testimonials-subtitle">
        Real experiences from brands and creators who have worked with Influnexa.
      </p>

    </div>


    {/* Cards */}
    <div className="nx-testimonials-content">

      {/* Previous */}
      <button
        type="button"
        className="nx-testimonials-arrow nx-testimonials-prev"
        aria-label="Previous testimonials"
      >
        ←
      </button>


      <div className="nx-testimonials-grid">

        {testimonials.map((testimonial) => (
          <article
            key={testimonial._id || testimonial.name}
            className="nx-testimonial-card"
          >

            {/* Top row */}
            <div className="nx-testimonial-top">

              <div className="nx-testimonial-profile">

                <div className="nx-testimonial-avatar">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  ) : (
                    <span>
                      {testimonial.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <div className="nx-testimonial-meta">

                <div className="nx-testimonial-type">
  <span className="nx-testimonial-type-icon">
    {testimonial.type === "Creator" ? "●" : "♧"}
  </span>

  <span className="nx-testimonial-type-label">
    {testimonial.type || "Brand"}
  </span>
</div>

                  <span className="nx-testimonial-category">
                    {testimonial.category || testimonial.role || "Partner"}
                  </span>

                </div>

              </div>


             {/* Stars */}
<div className="nx-testimonial-stars">
  {Array.from({
    length: Math.min(Math.max(Number(testimonial.rating) || 0, 0), 5)
  }).map((_, index) => (
    <span key={index}>★</span>
  ))}
</div>

            </div>


            {/* Quote */}
            <p className="nx-testimonial-quote">
              “{testimonial.quote}”
            </p>


            {/* Bottom author */}
            <div className="nx-testimonial-author">

              <div className="nx-testimonial-author-avatar">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                ) : (
                  <span>
                    {testimonial.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <div>
                <strong>{testimonial.name}</strong>
              </div>

            </div>

          </article>
        ))}


        {/* Empty state */}
        {testimonials.length === 0 && (
          <article className="nx-testimonial-card nx-testimonial-empty">
            <p className="nx-testimonial-quote">
               ✨More reviews from brands and creators will appear here as they share
  their experiences with Influnexa.
            </p>

          </article>
        )}

      </div>


      {/* Next */}
      <button
        type="button"
        className="nx-testimonials-arrow nx-testimonials-next"
        aria-label="Next testimonials"
      >
        →
      </button>

    </div>

  </div> 

  {/* Add Review Button */}
<button
  type="button"
  className="testimonial-toggle-btn"
  onClick={() => {
    window.location.href = "/share-experience";
  }}
>
  Share Your Experience
</button>
        </section>
</section>


{/* FAQ SECTION */}

<section className="faq-showcase-section">
  <div className="faq-showcase-inner">

 

    {/* Heading */}
    <div className="faq-showcase-heading">

      <div className="faq-eyebrow">
        <span></span>
        <b>FAQ</b>
        <span></span>
      </div>

      <h2>
        Questions? <strong>We’ve Got Answers.</strong>
      </h2>

      <p>
        Find clear answers to the most common questions
        about working with Influnexa.
      </p>

    </div>

    {/* FAQ panel */}
    <div className="faq-showcase-box">
      <FAQ />
    </div>

  </div>
</section>



        <section id="blog" className="px-4 py-20 lg:px-6">
          <SectionHeader
            eyebrow="Blog"
            title="Influencer marketing insights and trends"
          />
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post._id || post.title}
                className="blog-card insight-card"
              >
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt || post.readTime}</p>
                <small>{post.readTime}</small>
                <a
                  className="blog-card-link"
                  href={`/blog/${post.slug || post._id}`}
                >
                  Read article
                </a>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              className="blog-view-all-button"
              href="/blog"
              variant="secondary"
            >
              View All Blog Posts
            </Button>
          </div>
        </section>

        <section id="register" className="register-section px-4 py-20 lg:px-6">
          <SectionHeader
            eyebrow="Register"
            title="Start as a brand or join as a creator"
          >
            Brands can request an agency-managed campaign. Influencers can
            submit their profile to be considered for future product review,
            UGC, and influencer marketing opportunities.
          </SectionHeader>
          <div className="register-panel mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="register-choice-card">
              <span>Brand</span>
              <h3>Need influencer marketing or product reviews?</h3>
              <p>
                Share your product, audience, budget, campaign goals, review
                needs, and target markets.
              </p>
              <Button href="/register/brand">Register as Brand</Button>
            </article>
            <article className="register-choice-card creator">
              <span>Influencer</span>
              <h3>Want to join our creator database?</h3>
              <p>
                Submit your profile, audience details, platforms, categories,
                content rates, and shipping details.
              </p>
              <Button href="/register/influencer">
                Register as Influencer
              </Button>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-14 text-white lg:px-6">
        <div className="footer-panel mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <a
              className="footer-brand-lockup"
              href="/#home"
              aria-label="Influnexa home"
            >
              <span className="footer-logo-frame">
                <img src={influnexaLogo} alt="Influnexa" />
              </span>
              <span className="footer-brand-copy">
                <strong>Influnexa</strong>
                <small>Influence, connect, grow</small>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              AI-powered influencer and creator marketing for brands, agencies,
              startups, e-commerce teams, and creators across India.
            </p>
            <div className="mt-6" aria-label="Influnexa social media">
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) =>
                  social.href ? (
                    <a
                      key={social.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-white/10 hover:text-cyan-300"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Follow Influnexa on ${social.label}`}
                    >
                      <SocialIcon type={social.type} />
                    </a>
                  ) : (
                    <span
                      key={social.label}
                      className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-600"
                      title={`${social.label} profile pending`}
                      aria-label={`${social.label} profile pending`}
                    >
                      <SocialIcon type={social.type} />
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          {[
            [
              "Services",
              ["Influencer Marketing", "#services"],
              ["UGC Content", "#services"],
              ["Reviews", "#services"],
              ["Analytics", "#services"],
            ],
            [
              "Resources",
              ["About Us", "/about"],
              ["Blog", "/blog"],
              ["Case Studies", "#case-studies"],
              ["Creator Guide", "/register/influencer"],
              ["Brand Guide", "/register/brand"],
            ],
            [
              "Legal",
              ["Privacy", "#home"],
              ["Terms", "#home"],
              ["Compliance", "#home"],
              ["Security", "#home"],
            ],
            [
              "Contact",
              [
                "support.influnexa@gmail.com",
                "mailto:support.influnexa@gmail.com",
                "email",
              ],
              ["+91 90014 02531", "https://wa.me/919001402531", "whatsapp"],
              ["+91 94053 65870", "https://wa.me/919405365870", "whatsapp"],
            ],
          ].map(([heading, ...links]) => (
            <div key={heading}>
              <h3 className="font-bold">{heading}</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                {links.map(([label, href, icon]) => (
                  <a
                    className={icon ? "footer-contact-link" : undefined}
                    key={label}
                    href={href}
                  >
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
