import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { submitRegistration } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema } from "../lib/seo";

const categories = ["Beauty", "Fashion", "Fitness", "Technology", "Gaming", "Food", "Travel", "Finance", "Education", "Lifestyle", "Healthcare", "Automotive"];
const contentTypes = ["Product Review", "UGC Video", "Reels/Shorts", "Stories", "Unboxing", "Tutorial", "Static Post", "Blog Review"];

const initialForm = {
  fullName: "",
  creatorName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  languages: "",
  categories: [],
  primaryPlatform: "",
  primaryProfile: "",
  otherProfiles: "",
  followers: "",
  engagementRate: "",
  averageViews: "",
  audienceCountries: "",
  contentTypes: [],
  pastBrandWork: "",
  rateCard: "",
  shippingAddress: "",
  portfolioUrl: "",
  notes: "",
  consentToContact: false,
};

const influencerDescription =
  "Join the Influnexa creator database for product reviews, UGC content, influencer marketing opportunities, unboxings, tutorials, and brand collaborations.";

const influencerBreadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Influencer Registration", path: "/register/influencer" },
];

const influencerJsonLd = [
  pageSchema({
    path: "/register/influencer",
    title: "Influencer Registration",
    description: influencerDescription,
    breadcrumbs: influencerBreadcrumbs,
  }),
  breadcrumbSchema("/register/influencer", influencerBreadcrumbs),
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Influnexa creator applicant",
    description: "Creator profile submitted for product review, UGC, and influencer marketing campaign consideration.",
    knowsAbout: categories,
  },
];

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function RegisterInfluencer() {
  const [theme, setTheme] = useState("light");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const updateMulti = (field, value) => {
    setForm((current) => ({ ...current, [field]: toggleValue(current[field], value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Saving influencer registration..." });

    try {
      await submitRegistration("influencers", form);
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Influencer profile saved. Our agency team will review your details.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className={`site min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}>
      <SEO
        title="Influencer Registration | Influnexa"
        description={influencerDescription}
        path="/register/influencer"
        jsonLd={influencerJsonLd}
      />
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
      <main className="registration-page px-4 pb-20 pt-32 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="registration-hero creator">
            <p>Influencer registration</p>
            <h1>Join the Influnexa creator database for product reviews and UGC work.</h1>
            <span>Submit your profile so our agency team can consider you for brand campaigns that match your niche, audience, and content style.</span>
          </div>

          <form className="register-card registration-form influencer-form" onSubmit={handleSubmit}>
            <div className="form-section-title">Profile details</div>
            <div className="form-grid">
              <label>Full name *<input name="fullName" value={form.fullName} onChange={updateField} required /></label>
              <label>Creator / public name *<input name="creatorName" value={form.creatorName} onChange={updateField} required /></label>
              <label>Email *<input type="email" name="email" value={form.email} onChange={updateField} required /></label>
              <label>Phone / WhatsApp<input name="phone" value={form.phone} onChange={updateField} /></label>
              <label>Country *<input name="country" value={form.country} onChange={updateField} required /></label>
              <label>City<input name="city" value={form.city} onChange={updateField} /></label>
              <label className="wide">Languages *<input name="languages" value={form.languages} onChange={updateField} required placeholder="Example: English, Hindi, Arabic" /></label>
            </div>

            <div className="form-section-title">Content and audience</div>
            <fieldset className="choice-group">
              <legend>Categories</legend>
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={form.categories.includes(category)}
                    onChange={() => updateMulti("categories", category)}
                  />
                  {category}
                </label>
              ))}
            </fieldset>
            <fieldset className="choice-group">
              <legend>Content types</legend>
              {contentTypes.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={form.contentTypes.includes(type)}
                    onChange={() => updateMulti("contentTypes", type)}
                  />
                  {type}
                </label>
              ))}
            </fieldset>

            <div className="form-grid">
              <label>Primary platform *<select name="primaryPlatform" value={form.primaryPlatform} onChange={updateField} required>
                <option value="">Select platform</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>LinkedIn</option>
                <option>Blog</option>
              </select></label>
              <label>Primary profile link *<input type="url" name="primaryProfile" value={form.primaryProfile} onChange={updateField} required /></label>
              <label className="wide">Other profile links<textarea name="otherProfiles" value={form.otherProfiles} onChange={updateField} rows="3" /></label>
              <label>Followers *<input name="followers" value={form.followers} onChange={updateField} required placeholder="Example: 85K" /></label>
              <label>Engagement rate<input name="engagementRate" value={form.engagementRate} onChange={updateField} placeholder="Example: 4.8%" /></label>
              <label>Average views<input name="averageViews" value={form.averageViews} onChange={updateField} /></label>
              <label>Audience countries<input name="audienceCountries" value={form.audienceCountries} onChange={updateField} /></label>
              <label className="wide">Past brand work<textarea name="pastBrandWork" value={form.pastBrandWork} onChange={updateField} rows="3" /></label>
              <label>Rate card<input name="rateCard" value={form.rateCard} onChange={updateField} placeholder="Example: $300/reel" /></label>
              <label>Portfolio / media kit URL<input type="url" name="portfolioUrl" value={form.portfolioUrl} onChange={updateField} /></label>
              <label className="wide">Shipping address for product review campaigns<textarea name="shippingAddress" value={form.shippingAddress} onChange={updateField} rows="3" /></label>
              <label className="wide">Notes<textarea name="notes" value={form.notes} onChange={updateField} rows="4" /></label>
            </div>

            <label className="consent-row">
              <input name="consentToContact" type="checkbox" checked={form.consentToContact} onChange={updateField} required />
              I agree that Influnexa can contact me about relevant product review, UGC, and influencer marketing opportunities.
            </label>

            {status.message && <div className={`form-status ${status.type}`}>{status.message}</div>}
            <button className="form-submit creator-submit" disabled={status.type === "loading"} type="submit">
              {status.type === "loading" ? "Saving..." : "Submit Influencer Registration"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Button href="/register/brand" variant="secondary">Register as Brand Instead</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
