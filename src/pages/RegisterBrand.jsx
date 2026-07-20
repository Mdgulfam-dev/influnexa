import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import SuccessModal from "../components/SuccessModal";
import { submitRegistration } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema, SITE_URL } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";

const campaignTypes = [
  "Influencer Marketing",
  "Product Rating & Reviews",
  "UGC Content",
  "Product Seeding",
  "Campaign Management",
];

const platforms = ["Instagram", "TikTok", "YouTube", "LinkedIn", "X", "Blog"];
const budgetOptionsByCurrency = {
  USD: ["Under $2,500", "$2,500 - $8,000", "$8,000 - $25,000", "$25,000+"],
  EUR: ["Under EUR 2,300", "EUR 2,300 - 7,500", "EUR 7,500 - 23,000", "EUR 23,000+"],
  GBP: ["Under GBP 2,000", "GBP 2,000 - 6,500", "GBP 6,500 - 20,000", "GBP 20,000+"],
  INR: ["Under INR 2,00,000", "INR 2,00,000 - 6,50,000", "INR 6,50,000 - 20,00,000", "INR 20,00,000+"],
  AED: ["Under AED 9,000", "AED 9,000 - 30,000", "AED 30,000 - 92,000", "AED 92,000+"],
  AUD: ["Under AUD 3,800", "AUD 3,800 - 12,000", "AUD 12,000 - 38,000", "AUD 38,000+"],
  CAD: ["Under CAD 3,400", "CAD 3,400 - 11,000", "CAD 11,000 - 34,000", "CAD 34,000+"],
  SGD: ["Under SGD 3,300", "SGD 3,300 - 10,500", "SGD 10,500 - 32,500", "SGD 32,500+"],
};

const initialForm = {
  contactName: "",
  email: "",
  phone: "",
  companyName: "",
  website: "",
  country: "",
  industry: "",
  productName: "",
  productUrl: "",
  campaignTypes: [],
  campaignGoals: "",
  targetAudience: "",
  targetCountries: "",
  preferredPlatforms: [],
  creatorCount: "",
  budgetCurrency: "USD",
  budgetRange: "",
  timeline: "",
  productShippingReady: "",
  notes: "",
};

const brandDescription =
  "Register your brand with Influnexa to plan an agency-managed influencer marketing, UGC, product review, product seeding, or creator campaign.";

const brandBreadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Brand Registration", path: "/register/brand" },
];

const brandJsonLd = [
  pageSchema({
    path: "/register/brand",
    title: "Brand Registration",
    description: brandDescription,
    breadcrumbs: brandBreadcrumbs,
  }),
  breadcrumbSchema("/register/brand", brandBreadcrumbs),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Agency-managed influencer marketing campaign planning",
    description: brandDescription,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "India",
    serviceType: campaignTypes,
  },
];

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function RegisterBrand() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasValidationAttempt, setHasValidationAttempt] = useState(false);
  const budgetOptions = budgetOptionsByCurrency[form.budgetCurrency] || budgetOptionsByCurrency.USD;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "budgetCurrency" ? { budgetRange: "" } : {}),
    }));
  };

  const updateMulti = (field, value) => {
    setForm((current) => ({ ...current, [field]: toggleValue(current[field], value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Saving brand registration..." });

    try {
      await submitRegistration("brands", form);
      setStatus({ type: "idle", message: "" });
      setShowSuccessModal(true);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const closeSuccessModal = () => {
    setForm(initialForm);
    setHasValidationAttempt(false);
    setShowSuccessModal(false);
  };

  return (
    <div className={`site min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-950"}`}>
      <SEO
        title="Brand Registration | Influnexa"
        description={brandDescription}
        path="/register/brand"
        jsonLd={brandJsonLd}
      />
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
      <main className="registration-page px-4 pb-20 pt-32 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="registration-hero">
            <p>Brand registration</p>
            <h1>Launch an agency-managed influencer, UGC, or product review campaign.</h1>
            <span>Share the important details our strategy team needs to research creators, estimate budget, and prepare your campaign plan.</span>
          </div>

          <form className={`register-card registration-form ${hasValidationAttempt ? "has-validation-attempt" : ""}`} onSubmit={handleSubmit} onInvalidCapture={() => setHasValidationAttempt(true)}>
            <div className="form-section-title">Company and contact</div>
            <div className="form-grid">
              <label>Contact name *<input name="contactName" value={form.contactName} onChange={updateField} required /></label>
              <label>Work email *<input type="email" name="email" value={form.email} onChange={updateField} required /></label>
              <label>Phone / WhatsApp<input name="phone" value={form.phone} onChange={updateField} /></label>
              <label>Company name *<input name="companyName" value={form.companyName} onChange={updateField} required /></label>
              <label>Website<input type="url" name="website" value={form.website} onChange={updateField} /></label>
              <label>Country *<input name="country" value={form.country} onChange={updateField} required /></label>
              <label>Industry *<input name="industry" value={form.industry} onChange={updateField} required /></label>
              <label>Product name *<input name="productName" value={form.productName} onChange={updateField} required /></label>
              <label className="wide">Product URL<input type="url" name="productUrl" value={form.productUrl} onChange={updateField} /></label>
            </div>

            <div className="form-section-title">Campaign requirements</div>
            <fieldset className="choice-group">
              <legend>Campaign type</legend>
              {campaignTypes.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    checked={form.campaignTypes.includes(type)}
                    onChange={() => updateMulti("campaignTypes", type)}
                  />
                  {type}
                </label>
              ))}
            </fieldset>

            <fieldset className="choice-group">
              <legend>Preferred platforms</legend>
              {platforms.map((platform) => (
                <label key={platform}>
                  <input
                    type="checkbox"
                    checked={form.preferredPlatforms.includes(platform)}
                    onChange={() => updateMulti("preferredPlatforms", platform)}
                  />
                  {platform}
                </label>
              ))}
            </fieldset>

            <div className="form-grid">
              <label className="wide">Campaign goals *<textarea name="campaignGoals" value={form.campaignGoals} onChange={updateField} required rows="4" /></label>
              <label className="wide">Target audience *<textarea name="targetAudience" value={form.targetAudience} onChange={updateField} required rows="3" /></label>
              <label>Target countries<input name="targetCountries" value={form.targetCountries} onChange={updateField} /></label>
              <label>Expected creators<input name="creatorCount" value={form.creatorCount} onChange={updateField} placeholder="Example: 20-50" /></label>
              <label>Budget currency *<select name="budgetCurrency" value={form.budgetCurrency} onChange={updateField} required>
                {Object.keys(budgetOptionsByCurrency).map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select></label>
              <label>Budget range *<select name="budgetRange" value={form.budgetRange} onChange={updateField} required>
                <option value="">Select budget</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select></label>
              <label>Timeline<select name="timeline" value={form.timeline} onChange={updateField}>
                <option value="">Select timeline</option>
                <option>ASAP</option>
                <option>Within 2 weeks</option>
                <option>This month</option>
                <option>Next quarter</option>
              </select></label>
              <label>Product shipping ready<select name="productShippingReady" value={form.productShippingReady} onChange={updateField}>
                <option value="">Select status</option>
                <option>Ready now</option>
                <option>Ready in 1-2 weeks</option>
                <option>Digital product</option>
                <option>Not sure yet</option>
              </select></label>
              <label className="wide">Notes<textarea name="notes" value={form.notes} onChange={updateField} rows="4" /></label>
            </div>

            {status.message && <div className={`form-status ${status.type}`}>{status.message}</div>}
            <button className="form-submit" disabled={status.type === "loading"} type="submit">
              {status.type === "loading" ? "Saving..." : "Submit Brand Registration"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Button className="registration-switch-button" href="/register/influencer" variant="secondary">Register as Influencer Instead</Button>
          </div>
        </div>
      </main>
      <SuccessModal
        open={showSuccessModal}
        title="Brand registration submitted"
        message="Thank you for sharing your campaign requirements. Our team will contact you shortly."
        onClose={closeSuccessModal}
      />
    </div>
  );
}
