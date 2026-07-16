import { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import SEO, { breadcrumbSchema, pageSchema } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";

const principles = [
  {
    number: "01",
    title: "Creator fit over vanity metrics",
    copy: "We look beyond follower counts to find creators with the right audience, content quality, category relevance, and trust.",
  },
  {
    number: "02",
    title: "Clear operations",
    copy: "Every campaign is guided by a practical process: a focused brief, thoughtful sourcing, straightforward approvals, and reliable follow-through.",
  },
  {
    number: "03",
    title: "Work that earns trust",
    copy: "From product reviews to UGC, we focus on authentic content that gives customers more confidence to choose your brand.",
  },
];

const capabilities = [
  "Influencer marketing",
  "UGC content production",
  "Rating and review campaigns",
  "Product seeding",
  "Campaign management",
  "Performance reporting",
];

const leadership = [
  {
    name: "Md Gulfam",
    role: "Founder & CEO",
    initials: "MG",
    profile: "https://www.linkedin.com/in/md-gulfam-364ab5212/",
    copy: "Md Gulfam leads Influnexa’s vision, partnerships, and campaign delivery—helping brands turn creator activity into focused, commercially useful marketing.",
  },
  {
    name: "Sana Kureshi",
    role: "Co-Founder & Chief Marketing Officer",
    initials: "SK",
    profile: "https://www.linkedin.com/in/sana-kureshi-4409a63b1/",
    copy: "Sana Kureshi leads marketing direction and brand storytelling, ensuring each campaign connects with the right audience in a clear, compelling way.",
  },
];

export default function About() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];

  const changeTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      return nextTheme;
    });
  };

  return (
    <div className={`site min-h-screen overflow-hidden ${isDark ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-950"}`}>
      <SEO
        title="About Us"
        description="Learn how Influnexa helps brands grow with creator partnerships, authentic product reviews, UGC production, and managed influencer campaigns."
        path="/about"
        jsonLd={[
          pageSchema({
            path: "/about",
            title: "About Us",
            description: "Influnexa is a global influencer marketing partner for creator campaigns, product reviews, UGC, and campaign management.",
            type: "AboutPage",
            breadcrumbs,
          }),
          breadcrumbSchema("/about", breadcrumbs),
        ]}
      />
      <Navbar theme={theme} onToggleTheme={changeTheme} />

      <main className="pt-28 sm:pt-36">
        <section className="relative px-4 pb-16 lg:px-6 lg:pb-24">
          <div className="absolute inset-x-0 top-0 -z-0 h-[32rem] bg-[radial-gradient(circle_at_18%_15%,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(139,92,246,0.2),transparent_35%)]" />
          <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">About Influnexa</p>
              <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Better creator partnerships, built around real business goals.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Influnexa is a global influencer marketing partner for brands that need credible content, stronger product trust, and campaigns that stay organised from brief to report. We connect thoughtful strategy with the right creators, clear production systems, and reporting that makes the next decision easier.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/register/brand">Start a Campaign</Button>
                <Button href="/register/influencer" variant="secondary">Join as a Creator</Button>
              </div>
            </div>
            <aside className="rounded-[2rem] border border-slate-200 bg-white/80 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">What we bring together</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {["Strategy", "Creators", "Content", "Reporting"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-100 px-4 py-5 text-center text-sm font-black text-slate-800 dark:bg-white/10 dark:text-white">{item}</div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">One accountable team to turn creator relationships into useful brand assets and measurable learning.</p>
            </aside>
          </div>
        </section>

        <section className="px-4 py-16 lg:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Our approach</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built for the work behind a great campaign.</h2>
            </div>
            <div className="grid gap-5">
              {principles.map((principle) => (
                <article key={principle.number} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[4rem_1fr] dark:border-white/10 dark:bg-slate-900">
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-300">{principle.number}</span>
                  <div>
                    <h3 className="text-xl font-black">{principle.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{principle.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 dark:border-white/10 dark:bg-slate-900/40 lg:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Our leadership</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A team focused on meaningful growth.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Influnexa is led by people who believe creator marketing works best when it is strategic, human, and accountable to the brand’s objectives.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {leadership.map((member) => (
                <article key={member.name} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-sm dark:border-white/10 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-5">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-lg font-black text-white shadow-lg shadow-cyan-500/20">{member.initials}</div>
                    <a className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-white/15 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-300" href={member.profile} target="_blank" rel="noreferrer">
                      LinkedIn
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <h3 className="mt-6 text-2xl font-black">{member.name}</h3>
                  <p className="mt-1 font-bold text-cyan-700 dark:text-cyan-300">{member.role}</p>
                  <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{member.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white lg:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">How we help</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The right support for every stage of creator marketing.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Whether you need a focused product review launch or ongoing creator operations, we shape the engagement around your team, markets, and goals.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div key={capability} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 font-bold text-slate-100">{capability}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 lg:px-6 lg:py-24">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 px-7 py-12 text-center text-white shadow-2xl shadow-cyan-500/20 sm:px-12 sm:py-16">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-100">Let’s work together</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Ready to build a creator campaign people trust?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Tell us about your product, audience, and campaign goals. We’ll help you map the right next step.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/register/brand" variant="dark">Talk to our team</Button>
              <Button href="/blog" variant="onBrand">
                Read our insights
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
