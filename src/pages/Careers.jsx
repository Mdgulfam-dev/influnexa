import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SEO, { breadcrumbSchema, pageSchema } from "../lib/seo";
import { getJobs } from "../lib/api";
import { applyTheme, getInitialTheme } from "../lib/theme";

export default function Careers() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => { getJobs().then((items) => setJobs(items.map((job) => ({ ...job, id: job.jobId })))).catch((error) => { setJobs([]); setLoadError(error.message || "Unable to load jobs."); }).finally(() => setLoading(false)); }, []);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? jobs.filter((job) => job.id.toLowerCase().includes(term)) : jobs;
  }, [jobs, query]);
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }];

  return <div className={`site min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-950"}`}>
    <SEO title="Careers" description="Explore current career opportunities at Influnexa." path="/careers" jsonLd={[pageSchema({ path: "/careers", title: "Careers", description: "Explore current career opportunities at Influnexa.", breadcrumbs }), breadcrumbSchema("/careers", breadcrumbs)]} />
    <Navbar theme={theme} onToggleTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} />
    <main className="career-page px-4 pb-20 pt-32 lg:px-6">
      <section className="career-hero mx-auto max-w-6xl">
        <p>Careers at Influnexa</p><h1>Build the future of creator marketing with us.</h1>
        <span>Explore open roles and find the one where your ideas can make an impact.</span>
      </section>
      <section className="mx-auto mt-10 max-w-6xl" aria-labelledby="open-roles">
        <div className="career-toolbar"><div><h2 id="open-roles">Open positions</h2><span>{matches.length} role{matches.length === 1 ? "" : "s"} found</span></div><label className="job-search"><span>Search by Job ID</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: INX-00001" aria-label="Search by job ID" /></label></div>
        <div className="job-list">{matches.map((job) => <a className="job-card" href={`/careers/${job.id}`} key={job.id}><div><div className="job-card-top"><span className="job-id">{job.id}</span><span className="job-type">{job.type}</span></div><h3>{job.title}</h3><p>{job.summary}</p><div className="job-meta"><span>{job.department}</span><span>{job.location}</span><span>{job.experience}</span></div></div><span className="job-arrow" aria-hidden="true">→</span></a>)}</div>
        {loading && <div className="job-empty">Loading open positions…</div>}
        {!loading && loadError && <div className="job-empty">We couldn’t load open positions: {loadError}. Please try again shortly.</div>}
        {!loading && !loadError && matches.length === 0 && <div className="job-empty">{query ? "No job matches that ID. Please check the ID and try again." : "There are no open positions right now. Please check back soon."}</div>}
      </section>
    </main>
  </div>;
}
