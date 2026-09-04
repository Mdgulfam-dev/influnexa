import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import SuccessModal from "../components/SuccessModal";
import { submitRegistration } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema, SITE_URL } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";

/* =========================================================
   OPTIONS
========================================================= */

const campaignTypes = [
  "Influencer Marketing",
  "Product Rating & Reviews",
  "UGC Content",
  "Product Seeding",
  "Campaign Management",
];

const platforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "X",
  "Blog",
];

const budgetOptionsByCurrency = {
  USD: [
    "Under $2,500",
    "$2,500 - $8,000",
    "$8,000 - $25,000",
    "$25,000+",
  ],

  EUR: [
    "Under EUR 2,300",
    "EUR 2,300 - 7,500",
    "EUR 7,500 - 23,000",
    "EUR 23,000+",
  ],

  GBP: [
    "Under GBP 2,000",
    "GBP 2,000 - 6,500",
    "GBP 6,500 - 20,000",
    "GBP 20,000+",
  ],

  INR: [
    "Under INR 2,00,000",
    "INR 2,00,000 - 6,50,000",
    "INR 6,50,000 - 20,00,000",
    "INR 20,00,000+",
  ],

  AED: [
    "Under AED 9,000",
    "AED 9,000 - 30,000",
    "AED 30,000 - 92,000",
    "AED 92,000+",
  ],

  AUD: [
    "Under AUD 3,800",
    "AUD 3,800 - 12,000",
    "AUD 12,000 - 38,000",
    "AUD 38,000+",
  ],

  CAD: [
    "Under CAD 3,400",
    "CAD 3,400 - 11,000",
    "CAD 11,000 - 34,000",
    "CAD 34,000+",
  ],

  SGD: [
    "Under SGD 3,300",
    "SGD 3,300 - 10,500",
    "SGD 10,500 - 32,500",
    "SGD 32,500+",
  ],
};

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  fullName: "",
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
  consentToContact: false,
};

/* =========================================================
   SEO
========================================================= */

const brandDescription =
  "Register your brand with Influnexa to plan an agency-managed influencer marketing, UGC, product review, product seeding, or creator campaign.";

const brandBreadcrumbs = [
  { name: "Home", path: "/" },
  {
    name: "Brand Registration",
    path: "/register/brand",
  },
];

const brandJsonLd = [
  pageSchema({
    path: "/register/brand",
    title: "Brand Registration",
    description: brandDescription,
    breadcrumbs: brandBreadcrumbs,
  }),

  breadcrumbSchema(
    "/register/brand",
    brandBreadcrumbs
  ),

  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Agency-managed influencer marketing campaign planning",
    description: brandDescription,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: "India",
    serviceType: campaignTypes,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function RegisterBrand() {
  const [theme, setTheme] = useState(getInitialTheme);

  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [hasValidationAttempt, setHasValidationAttempt] =
    useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const budgetOptions =
    budgetOptionsByCurrency[form.budgetCurrency] ||
    budgetOptionsByCurrency.USD;

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,

      ...(name === "budgetCurrency"
        ? {
            budgetRange: "",
          }
        : {}),
    }));
  };

  /* =========================================================
     UPDATE MULTI
  ========================================================= */

  const updateMulti = (field, value) => {
    setForm((current) => ({
      ...current,

      [field]: toggleValue(
        current[field],
        value
      ),
    }));
  };

  /* =========================================================
     SET STEP
  ========================================================= */

  const setStep = (step) => {
    setCurrentStep(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     STEP VALIDATION
  ========================================================= */

  const isStepValid = (step) => {
    const requiredFieldsByStep = {
      1: [
        "fullName",
        "email",
        "phone",
        "companyName",
        "country",
        "industry",
        "productName",
      ],

      2: [
        "campaignTypes",
        "campaignGoals",
        "targetAudience",
      ],

      3: [
        "targetCountries",
        "preferredPlatforms",
        "creatorCount",
      ],

      4: [
        "budgetCurrency",
        "budgetRange",
      ],

      5: [],

      6: [],

      7: [],
    };

    const requiredFields =
      requiredFieldsByStep[step] || [];

    /* -----------------------------------------
       NORMAL REQUIRED FIELDS
    ----------------------------------------- */

    for (const field of requiredFields) {
      const value = form[field];

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return false;
        }
      } else {
        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        ) {
          return false;
        }
      }
    }

    /* -----------------------------------------
       STEP 1 VALIDATION
    ----------------------------------------- */

    if (step === 1) {
      if (
        !/^\d{10}$/.test(
          form.phone.trim()
        )
      ) {
        return false;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim()
        )
      ) {
        return false;
      }

      /* Website URL if provided */

      if (form.website.trim()) {
        try {
          new URL(form.website.trim());
        } catch {
          return false;
        }
      }

      /* Product URL if provided */

      if (form.productUrl.trim()) {
        try {
          new URL(form.productUrl.trim());
        } catch {
          return false;
        }
      }
    }

    /* -----------------------------------------
       STEP 3 VALIDATION
    ----------------------------------------- */

    if (step === 3) {
      if (
        !form.targetCountries.trim()
      ) {
        return false;
      }

      if (
        form.preferredPlatforms.length === 0
      ) {
        return false;
      }

      if (
        !form.creatorCount.trim()
      ) {
        return false;
      }
    }

    /* -----------------------------------------
       STEP 4 VALIDATION
    ----------------------------------------- */

    if (step === 4) {
      if (
        !form.budgetCurrency.trim()
      ) {
        return false;
      }

      if (
        !form.budgetRange.trim()
      ) {
        return false;
      }
    }

    /* -----------------------------------------
       STEP 7 CONSENT
    ----------------------------------------- */

    if (step === 7) {
      if (
        form.consentToContact !== true
      ) {
        return false;
      }
    }

    return true;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* -----------------------------------------
       BROWSER VALIDATION
    ----------------------------------------- */

    if (
      !event.currentTarget.checkValidity()
    ) {
      event.currentTarget.reportValidity();

      setHasValidationAttempt(true);

      return;
    }

    /* -----------------------------------------
       EXTRA VALIDATION
    ----------------------------------------- */

    if (!form.fullName.trim()) {
      setStatus({
        type: "error",
        message: "Full Name is required.",
      });

      return;
    }

    if (!form.email.trim()) {
      setStatus({
        type: "error",
        message: "Email is required.",
      });

      return;
    }

    if (!form.phone.trim()) {
      setStatus({
        type: "error",
        message: "Phone Number is required.",
      });

      return;
    }

    if (
      !/^\d{10}$/.test(
        form.phone.trim()
      )
    ) {
      setStatus({
        type: "error",
        message:
          "Phone Number must contain exactly 10 digits.",
      });

      return;
    }

    if (!form.companyName.trim()) {
      setStatus({
        type: "error",
        message: "Company Name is required.",
      });

      return;
    }

    if (!form.country.trim()) {
      setStatus({
        type: "error",
        message: "Country is required.",
      });

      return;
    }

    if (!form.industry.trim()) {
      setStatus({
        type: "error",
        message: "Industry is required.",
      });

      return;
    }

    if (!form.productName.trim()) {
      setStatus({
        type: "error",
        message: "Product Name is required.",
      });

      return;
    }

    if (
      form.campaignTypes.length === 0
    ) {
      setStatus({
        type: "error",
        message:
          "Please select at least one campaign type.",
      });

      return;
    }

    if (!form.campaignGoals.trim()) {
      setStatus({
        type: "error",
        message:
          "Campaign Goals are required.",
      });

      return;
    }

    if (!form.targetAudience.trim()) {
      setStatus({
        type: "error",
        message:
          "Target Audience is required.",
      });

      return;
    }

    if (
      form.preferredPlatforms.length === 0
    ) {
      setStatus({
        type: "error",
        message:
          "Please select at least one preferred platform.",
      });

      return;
    }

    if (!form.budgetRange.trim()) {
      setStatus({
        type: "error",
        message:
          "Budget Range is required.",
      });

      return;
    }

    if (
      form.consentToContact !== true
    ) {
      setStatus({
        type: "error",
        message:
          "Please accept the consent before submitting",
      });

      return;
    }

    /* -----------------------------------------
       LOADING
    ----------------------------------------- */

    setStatus({
      type: "loading",
      message:
        "Saving brand registration...",
    });

    /* -----------------------------------------
       HELPERS
    ----------------------------------------- */

    const text = (value) =>
      String(value ?? "").trim();

    const array = (value) => {
      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    };

    /* -----------------------------------------
       PAYLOAD
    ----------------------------------------- */

    const payload = {
      /* =====================================
         COMPANY & CONTACT
      ===================================== */

      fullName: text(
        form.fullName
      ),

      email: text(
        form.email
      ).toLowerCase(),

      phone: text(
        form.phone
      ),

      companyName: text(
        form.companyName
      ),

      website: text(
        form.website
      ),

      /* =====================================
         COMPANY / PRODUCT
      ===================================== */

      country: text(
        form.country
      ),

      industry: text(
        form.industry
      ),

      productName: text(
        form.productName
      ),

      productUrl: text(
        form.productUrl
      ),

      /* =====================================
         CAMPAIGN
      ===================================== */

      campaignTypes: array(
        form.campaignTypes
      ),

      campaignGoals: text(
        form.campaignGoals
      ),

      targetAudience: text(
        form.targetAudience
      ),

      targetCountries: text(
        form.targetCountries
      ),

      preferredPlatforms: array(
        form.preferredPlatforms
      ),

      creatorCount: text(
        form.creatorCount
      ),

      /* =====================================
         BUDGET
      ===================================== */

      budgetCurrency: text(
        form.budgetCurrency
      ),

      budgetRange: text(
        form.budgetRange
      ),

      /* =====================================
         TIMELINE
      ===================================== */

      timeline: text(
        form.timeline
      ),

      /* =====================================
         PRODUCT SHIPPING
      ===================================== */

      productShippingReady: text(
        form.productShippingReady
      ),

      /* =====================================
         NOTES
      ===================================== */

      notes: text(
        form.notes
      ),

      /* =====================================
         CONSENT
      ===================================== */

      consentToContact:
        form.consentToContact === true,

      timestamp:
        new Date().toLocaleString(),
    };

    console.log(
      "BRAND SUBMIT PAYLOAD:",
      payload
    );

    /* -----------------------------------------
       API SUBMIT
    ----------------------------------------- */

    try {
      await submitRegistration(
        "brands",
        payload
      );

      setStatus({
        type: "idle",
        message: "",
      });

      setShowSuccessModal(true);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Something went wrong while submitting the brand registration.",
      });
    }
  };

  /* =========================================================
     CLOSE SUCCESS MODAL
  ========================================================= */

  const closeSuccessModal = () => {
    setForm(initialForm);

    setCurrentStep(1);

    setHasValidationAttempt(false);

    setStatus({
      type: "idle",
      message: "",
    });

    setShowSuccessModal(false);
  };

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const nextStep = (step) => {
    /* Going backward is always allowed */

    if (step < currentStep) {
      setStep(step);
      return;
    }

    /* Moving forward */

    if (step > currentStep) {
      if (
        !isStepValid(currentStep)
      ) {
        setHasValidationAttempt(true);
        return;
      }
    }

    setStep(step);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`site min-h-screen ${
        theme === "dark"
          ? "dark bg-slate-950 text-white"
          : "bg-[#FAF8F4] text-[#17161C]"
      }`}
    >
      <SEO
        title="Brand Registration | Influnexa"
        description={brandDescription}
        path="/register/brand"
        jsonLd={brandJsonLd}
      />

      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((value) =>
            value === "dark"
              ? "light"
              : "dark"
          )
        }
      />

      <main className="registration-page px-4 pb-20 pt-32 lg:px-6">
        <div className="mx-auto max-w-[1180px]">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="mb-8 border-b border-[#E7E3DA] pb-7">
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#C7842A]">
              Brand Onboarding
            </p>

            <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight">
              Brand Registration
            </h1>

            <p className="max-w-[650px] text-[15px] leading-6 text-[#8A8578]">
              Share your campaign requirements once —
              we'll use these details to research
              creators, estimate your budget, and
              prepare the right campaign plan.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr] lg:gap-12">

            {/* =================================================
                STEP RAIL
            ================================================= */}

            <nav className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:block">

                {[
                  "Basic Details",
                  "Campaign",
                  "Targeting",
                  "Budget",
                  "Product & Timeline",
                  "Anything Else",
                  "Review & Submit",
                ].map(
                  (label, index) => {
                    const step =
                      index + 1;

                    return (
                      <button
                        type="button"
                        key={step}
                        onClick={() => {
                          /* Backward */

                          if (
                            step <
                            currentStep
                          ) {
                            setStep(step);
                            return;
                          }

                          /* Current */

                          if (
                            step ===
                            currentStep
                          ) {
                            return;
                          }

                          /* Validate all
                             previous steps */

                          for (
                            let i =
                              currentStep;
                            i < step;
                            i++
                          ) {
                            if (
                              !isStepValid(i)
                            ) {
                              setHasValidationAttempt(
                                true
                              );

                              return;
                            }
                          }

                          setStep(step);
                        }}
                        className={`
                          flex shrink-0 items-center
                          gap-2 rounded-[10px] px-2 py-2.5
                          text-left transition
                          lg:w-full

                          ${
                            currentStep ===
                            step
                              ? "bg-[#FDF4E4]"
                              : "hover:bg-[#F0EDE5]"
                          }
                        `}
                      >
                        <span
                          className={`
                            flex h-[22px] w-[22px]
                            shrink-0 items-center
                            justify-center rounded-full
                            border-2 font-mono text-[11px]
                            font-semibold

                            ${
                              step <
                              currentStep
                                ? "border-[#1F7A6C] bg-[#1F7A6C] text-white"
                                : currentStep ===
                                  step
                                ? "border-[#E8A33D] bg-[#FDF4E4] text-[#C7842A]"
                                : "border-[#E7E3DA] text-[#8A8578]"
                            }
                          `}
                        >
                          {step <
                          currentStep
                            ? "✓"
                            : step}
                        </span>

                        <span
                          className={`
                            whitespace-nowrap text-[13.5px]

                            ${
                              currentStep ===
                              step
                                ? "font-semibold text-[#17161C]"
                                : "text-[#8A8578]"
                            }
                          `}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  }
                )}

              </div>
            </nav>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              onInvalidCapture={() =>
                setHasValidationAttempt(true)
              }
              className={`space-y-5 ${
                hasValidationAttempt
                  ? "has-validation-attempt"
                  : ""
              }`}
            >
{status.type === "error" && status.message && (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
      {status.message}
    </div>
  )}
              {/* =================================================
                  STEP 1
              ================================================= */}

              {currentStep === 1 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Basic Details"
                    hint="Your company and contact information — this is how our team will reach you."
                  />

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <Input
                      label="Full Name"
                      required
                      name="fullName"
                      value={
                        form.fullName
                      }
                      onChange={
                        updateField
                      }
                      placeholder="e.g. Aditi Sharma"
                    />

                    <Input
                      label="Work Email"
                      required
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        updateField
                      }
                      placeholder="you@company.com"
                    />

                    <Input
                      label="Phone Number"
                      required
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              10
                            );

                        setForm(
                          (current) => ({
                            ...current,
                            phone: value,
                          })
                        );
                      }}
                      pattern="[0-9]{10}"
                      minLength={10}
                      maxLength={10}
                      placeholder="9876543210"
                    />

                    <Input
                      label="Company Name"
                      required
                      name="companyName"
                      value={
                        form.companyName
                      }
                      onChange={
                        updateField
                      }
                      placeholder="Your company name"
                    />

                    <Input
                      label="Website"
                      type="url"
                      name="website"
                      value={
                        form.website
                      }
                      onChange={
                        updateField
                      }
                      placeholder="https://example.com"
                    />

                    <Input
                      label="Country"
                      required
                      name="country"
                      value={
                        form.country
                      }
                      onChange={
                        updateField
                      }
                      placeholder="India"
                    />

                    <Input
                      label="Industry"
                      required
                      name="industry"
                      value={
                        form.industry
                      }
                      onChange={
                        updateField
                      }
                      placeholder="e.g. Fashion, Beauty, Technology"
                    />

                    <Input
                      label="Product Name"
                      required
                      name="productName"
                      value={
                        form.productName
                      }
                      onChange={
                        updateField
                      }
                      placeholder="Product / service name"
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Product URL"
                        type="url"
                        name="productUrl"
                        value={
                          form.productUrl
                        }
                        onChange={
                          updateField
                        }
                        placeholder="https://example.com/product"
                      />
                    </div>

                  </div>

                  <Navigation
                    onNext={() =>
                      nextStep(2)
                    }
                    nextDisabled={
                      !isStepValid(1)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 2
              ================================================= */}

              {currentStep === 2 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Campaign Requirements"
                    hint="Tell us what kind of campaign you want to run and what you want to achieve."
                  />

                  <ChipField
                    label="Campaign Type"
                    required
                    values={
                      form.campaignTypes
                    }
                    options={
                      campaignTypes
                    }
                    onToggle={(value) =>
                      updateMulti(
                        "campaignTypes",
                        value
                      )
                    }
                  />

                  <div className="mt-6">

                    <TextArea
                      label="Campaign Goals"
                      required
                      name="campaignGoals"
                      value={
                        form.campaignGoals
                      }
                      onChange={
                        updateField
                      }
                      placeholder="e.g. Increase awareness, drive sales, launch a new product..."
                      rows={4}
                    />

                  </div>

                  <div className="mt-6">

                    <TextArea
                      label="Target Audience"
                      required
                      name="targetAudience"
                      value={
                        form.targetAudience
                      }
                      onChange={
                        updateField
                      }
                      placeholder="Describe your ideal audience, age group, interests, gender, etc."
                      rows={4}
                    />

                  </div>

                  <Navigation
                    onBack={() =>
                      nextStep(1)
                    }
                    onNext={() =>
                      nextStep(3)
                    }
                    nextDisabled={
                      !isStepValid(2)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 3
              ================================================= */}

              {currentStep === 3 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Targeting"
                    hint="Help us understand where you want to reach people and what creator mix you need."
                  />

                  <Input
                    label="Target Countries"
                    required
                    name="targetCountries"
                    value={
                      form.targetCountries
                    }
                    onChange={
                      updateField
                    }
                    placeholder="e.g. India, USA, UK"
                  />

                  <div className="mt-6">

                    <ChipField
                      label="Preferred Platforms"
                      required
                      values={
                        form.preferredPlatforms
                      }
                      options={
                        platforms
                      }
                      onToggle={(value) =>
                        updateMulti(
                          "preferredPlatforms",
                          value
                        )
                      }
                    />

                  </div>

                  <div className="mt-6">

                    <Input
                      label="Expected Creators"
                      required
                      name="creatorCount"
                      value={
                        form.creatorCount
                      }
                      onChange={
                        updateField
                      }
                      placeholder="Example: 20-50"
                    />

                  </div>

                  <Navigation
                    onBack={() =>
                      nextStep(2)
                    }
                    onNext={() =>
                      nextStep(4)
                    }
                    nextDisabled={
                      !isStepValid(3)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 4
              ================================================= */}

              {currentStep === 4 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Budget"
                    hint="Select the currency and approximate campaign budget you're comfortable with."
                  />

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <SelectInput
                      label="Budget Currency"
                      required
                      name="budgetCurrency"
                      value={
                        form.budgetCurrency
                      }
                      onChange={
                        updateField
                      }
                      options={Object.keys(
                        budgetOptionsByCurrency
                      )}
                    />

                    <SelectInput
                      label="Budget Range"
                      required
                      name="budgetRange"
                      value={
                        form.budgetRange
                      }
                      onChange={
                        updateField
                      }
                      options={
                        budgetOptions
                      }
                    />

                  </div>

                  <Navigation
                    onBack={() =>
                      nextStep(3)
                    }
                    onNext={() =>
                      nextStep(5)
                    }
                    nextDisabled={
                      !isStepValid(4)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 5
              ================================================= */}

              {currentStep === 5 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Product & Timeline"
                    hint="Tell us when you want the campaign to happen and whether your product is ready for creators."
                  />

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <SelectInput
                      label="Timeline"
                      name="timeline"
                      value={
                        form.timeline
                      }
                      onChange={
                        updateField
                      }
                      options={[
                        "ASAP",
                        "Within 2 weeks",
                        "This month",
                        "Next quarter",
                      ]}
                    />

                    <SelectInput
                      label="Product Shipping Ready"
                      name="productShippingReady"
                      value={
                        form.productShippingReady
                      }
                      onChange={
                        updateField
                      }
                      options={[
                        "Ready now",
                        "Ready in 1-2 weeks",
                        "Digital product",
                        "Not sure yet",
                      ]}
                    />

                  </div>

                  <Navigation
                    onBack={() =>
                      nextStep(4)
                    }
                    onNext={() =>
                      nextStep(6)
                    }
                    nextDisabled={
                      !isStepValid(5)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 6
              ================================================= */}

              {currentStep === 6 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Anything Else"
                    hint="Optional — add anything else you'd like our strategy team to know."
                  />

                  <TextArea
                    label="Notes"
                    name="notes"
                    value={
                      form.notes
                    }
                    onChange={
                      updateField
                    }
                    placeholder="Add campaign references, creator preferences, special requirements, deadlines, or anything else..."
                    rows={6}
                  />

                  <Navigation
                    onBack={() =>
                      nextStep(5)
                    }
                    onNext={() =>
                      nextStep(7)
                    }
                    nextText="Review My Details"
                    nextDisabled={
                      !isStepValid(6)
                    }
                  />

                </section>
              )}

              {/* =================================================
                  STEP 7
              ================================================= */}

              {currentStep === 7 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Review & Submit"
                    hint="Double-check everything below before you submit your brand registration."
                  />

                  <Review form={form} />

                  {/* =================================================
                      CONSENT
                  ================================================= */}

                  <div className="mt-6 rounded-xl border border-[#E7E3DA] bg-[#FAF8F4] p-4">

                    <label className="flex cursor-pointer items-start gap-3">

                      <input
                        type="checkbox"
                        name="consentToContact"
                        checked={
                          form.consentToContact
                        }
                        onChange={
                          updateField
                        }
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#17161C]"
                      />

                      <span className="text-sm leading-6 text-[#17161C]">

                        I agree to be contacted by
                        Influnexa regarding influencer
                        marketing campaigns, creator
                        collaborations, campaign
                        management, and related
                        communications.

                        <span className="ml-1 text-red-500">
                          *
                        </span>

                      </span>

                    </label>

                    {!form.consentToContact &&
                      status.type ===
                        "error" &&
                      status.message?.includes(
                        "consent"
                      ) && (
                        <p className="mt-2 text-sm text-red-600">
                          Please accept the
                          consent before
                          submitting.
                        </p>
                      )}

                  </div>

                  {/* =================================================
                      STATUS
                  ================================================= */}

                  

                  {/* =================================================
                      SUBMIT
                  ================================================= */}

                  <div className="mt-6 flex justify-between">

                    <button
                      type="button"
                      className="rounded-lg border border-[#E7E3DA] bg-white px-6 py-3 text-sm font-semibold"
                      onClick={() =>
                        nextStep(6)
                      }
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={
                        status.type ===
                        "loading"
                      }
                      className="rounded-lg bg-[#17161C] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {status.type ===
                      "loading"
                        ? "Saving..."
                        : "Submit Registration"}
                    </button>

                  </div>

                </section>
              )}

            </form>
          </div>
        </div>
      </main>

      {/* =================================================
          SUCCESS MODAL
      ================================================= */}

      <SuccessModal
        open={showSuccessModal}
        title="Brand registration submitted"
        message="Thank you for sharing your campaign requirements. Our team will contact you shortly."
        onClose={
          closeSuccessModal
        }
      />

      {/* =================================================
          SWITCH REGISTRATION
      ================================================= */}

      <div className="mt-8 flex -translate-y-20 justify-center text-center md:translate-x-31">

        <Button
          className="registration-switch-button"
          href="/register/influencer"
          variant="secondary"
        >
          Register as Influencer Instead
        </Button>

      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionTitle({
  title,
  hint,
}) {
  return (
    <>
      <h2 className="text-[21px] font-semibold">
        {title}
      </h2>

      <p className="mb-6 text-[13.5px] leading-6 text-[#8A8578]">
        {hint}
      </p>
    </>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  required,
  ...props
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[13px] font-semibold">

        {label}{" "}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </span>

      <input
        {...props}
        required={required}
        className="w-full rounded-[9px] border-[1.5px] border-[#E7E3DA] bg-white px-[13px] py-[11px] text-[14.5px] text-[#17161C] outline-none transition focus:border-[#E8A33D] focus:ring-4 focus:ring-[#E8A33D]/20"
      />

    </label>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextArea({
  label,
  required,
  ...props
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[13px] font-semibold">

        {label}{" "}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </span>

      <textarea
        {...props}
        required={required}
        className="w-full resize-y rounded-[9px] border-[1.5px] border-[#E7E3DA] bg-white px-[13px] py-[11px] text-[14.5px] text-[#17161C] outline-none transition focus:border-[#E8A33D] focus:ring-4 focus:ring-[#E8A33D]/20"
      />

    </label>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectInput({
  label,
  required,
  options,
  ...props
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[13px] font-semibold">

        {label}{" "}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </span>

      <select
        {...props}
        required={required}
        className="w-full rounded-[9px] border-[1.5px] border-[#E7E3DA] bg-white px-[13px] py-[11px] text-[14.5px] text-[#17161C] outline-none focus:border-[#E8A33D] focus:ring-4 focus:ring-[#E8A33D]/20"
      >

        <option value="">
          Select
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </label>
  );
}

/* =========================================================
   CHIP FIELD
========================================================= */

function ChipField({
  label,
  required,
  values,
  options,
  onToggle,
}) {
  return (
    <div>

      <p className="mb-2.5 text-[13px] font-semibold">

        {label}{" "}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </p>

      <div className="flex flex-wrap gap-2">

        {options.map(
          (option) => {
            const active =
              values.includes(
                option
              );

            return (
              <button
                type="button"
                key={option}
                onClick={() =>
                  onToggle(
                    option
                  )
                }
                className={`
                  rounded-full border-[1.5px]
                  px-3.5 py-2 text-[13.5px]
                  transition

                  ${
                    active
                      ? "border-[#17161C] bg-[#17161C] text-white"
                      : "border-[#E7E3DA] bg-white text-[#17161C] hover:border-[#d8d2c4]"
                  }
                `}
              >
                {option}
              </button>
            );
          }
        )}

      </div>
    </div>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function Navigation({
  onBack,
  onNext,
  nextText = "Continue",
  nextDisabled = false,
}) {
  return (
    <div className="mt-7 flex justify-between">

      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-[#E7E3DA] bg-white px-6 py-3 text-sm font-semibold"
        >
          Back
        </button>
      ) : (
        <span />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={`
          rounded-lg px-6 py-3
          text-sm font-semibold text-white
          transition

          ${
            nextDisabled
              ? "cursor-not-allowed bg-slate-300"
              : "bg-[#17161C] hover:bg-[#2b2933]"
          }
        `}
      >
        {nextText}
      </button>

    </div>
  );
}

/* =========================================================
   REVIEW
========================================================= */

function Review({
  form,
}) {
  const item = (
    label,
    value
  ) => (
    <div className="flex justify-between gap-4 border-b border-[#F1EEE6] py-2.5 text-sm">

      <span className="text-[#8A8578]">
        {label}
      </span>

      <span className="text-right font-semibold">

        {Array.isArray(
          value
        )
          ? value.length
            ? value.join(
                ", "
              )
            : "—"
          : value || "—"}

      </span>

    </div>
  );

  return (
    <div className="space-y-6">

      {/* =================================================
          COMPANY
      ================================================= */}

      <ReviewGroup title="Company & Contact">

        {item(
          "Full Name",
          form.fullName
        )}

        {item(
          "Work Email",
          form.email
        )}

        {item(
          "Phone / WhatsApp",
          form.phone
        )}

        {item(
          "Company Name",
          form.companyName
        )}

        {item(
          "Website",
          form.website
        )}

        {item(
          "Country",
          form.country
        )}

        {item(
          "Industry",
          form.industry
        )}

        {item(
          "Product Name",
          form.productName
        )}

        {item(
          "Product URL",
          form.productUrl
        )}

      </ReviewGroup>

      {/* =================================================
          CAMPAIGN
      ================================================= */}

      <ReviewGroup title="Campaign Requirements">

        {item(
          "Campaign Types",
          form.campaignTypes
        )}

        {item(
          "Campaign Goals",
          form.campaignGoals
        )}

        {item(
          "Target Audience",
          form.targetAudience
        )}

      </ReviewGroup>

      {/* =================================================
          TARGETING
      ================================================= */}

      <ReviewGroup title="Targeting">

        {item(
          "Target Countries",
          form.targetCountries
        )}

        {item(
          "Preferred Platforms",
          form.preferredPlatforms
        )}

        {item(
          "Expected Creators",
          form.creatorCount
        )}

      </ReviewGroup>

      {/* =================================================
          BUDGET
      ================================================= */}

      <ReviewGroup title="Budget">

        {item(
          "Currency",
          form.budgetCurrency
        )}

        {item(
          "Budget Range",
          form.budgetRange
        )}

      </ReviewGroup>

      {/* =================================================
          PRODUCT & TIMELINE
      ================================================= */}

      <ReviewGroup title="Product & Timeline">

        {item(
          "Timeline",
          form.timeline
        )}

        {item(
          "Product Shipping Ready",
          form.productShippingReady
        )}

      </ReviewGroup>

      {/* =================================================
          NOTES
      ================================================= */}

      <ReviewGroup title="Anything Else">

        {item(
          "Notes",
          form.notes
        )}

      </ReviewGroup>

    </div>
  );
}

/* =========================================================
   REVIEW GROUP
========================================================= */

function ReviewGroup({
  title,
  children,
}) {
  return (
    <div>

      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#8A8578]">
        {title}
      </h4>

      <div className="grid gap-x-6 md:grid-cols-2">
        {children}
      </div>

    </div>
  );
}