import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import SuccessModal from "../components/SuccessModal";
import { submitRegistration } from "../lib/api";
import SEO, { breadcrumbSchema, pageSchema } from "../lib/seo";
import { applyTheme, getInitialTheme } from "../lib/theme";

const categories = [
  "Fashion",
  "Beauty and Makeup",
  "Personal Care",
  "UGC Creators",
  "Tech Reviews",
  "Body Care",
  "Skin Care",
  "LifeStyle",
  "Food",
  "Housewife",
  "Podcasters",
  "Cooking and Recipes",
  "Health & Wellness",
  "Gym",
  "Fitness",
  "Moms",
  "Pets",
  "Travel & Adventure",
  "Celebrity",
  "Film, OTT and TV Series",
  "Memes",
  "Models",
  "Yoga",
  "Hair Care",
  "Student",
  "Family/Parenting",
  "Home & Decor",
  "Baby Care",
  "Education",
  "Dogs",
  "Diet & Nutrition",
  "Dermatologist",
  "Doctors",
  "Crypto and NFTs",
  "Personal Finance",
  "Luxury Goods",
  "Motivation",
  "Working class",
  "Ethnic Wear",
  "Stock Market",
  "Comedy",
  "Forex",
  "Esports",
  "Finance",
  "Dance",
  "Cats",
  "Crypto & NFT",
  "Sports",
  "Software Development",
  "Vegan",
  "Dentists",
  "Gadgets",
  "Electronics and Technology",
  "Entertainment",
  "Higher Education",
  "Entrepreneurship",
  "DIY",
  "Footwear",
  "Gaming",
  "Home & Garden",
  "Home & Kitchen",
  "Athletes",
  "Automotive",
  "Mental Health Care",
  "Motorcycles",
  "Religious",
  "Seniority (Old Age)",
  "Sexual Wellness & Sensuality",
  "Sneakers",
  "Music",
  "Arts and Crafts",
  "Business/Making Money",
  "Coffee, Tea & Beverages",
  "Computer Software",
  "Nails",
  "Veterinary",
  "Fan Accounts",
  "Lingeries",
  "Architecture & Interior",
  "Banking",
  "Cars",
  "Hospitality",
  "Love & Romance",
  "Medical Practice",
  "Photography",
  "Plus Size Fashion",
  "Professional Training & Coaching",
  "Public Safety",
  "Wine and Spirits",
  "Farming",
  "Animals",
  "Automation & Robotics",
  "Quotes & Texts",
  "Politics",
  "Activism & Social Causes",
  "Books and Movies",
  "Gambling & Casinos",
  "Recreational Facilities and Services",
  "Alternative Medicine",
  "Tobacco",
  "Airlines/Aviation",
];
const languages = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Punjabi",
];

const availablePlatforms = [
  "Instagram",
  "YouTube",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "Snapchat",
  "Pinterest",
];

const dealTypes = [
"Sponsored Reel",
"Instagram Collab Post",
"Sponsored Post",
"Story Promotion",
"Product Review",
"Unboxing",
"Event Appearance",
"Brand Ambassador",
"Giveaway/Contest",
"Amazon Reviews",
"UGC Content",
];

const initialForm = {
  fullName: "",
  instagramUsername: "",
  instagramProfileLink: "",
  instagramFollowersRange: "",
  exactFollowers: "",

  phoneNumber: "",
  whatsappNumber: "",
  email: "",

  categories: [],
    engagementRate: "",

  campaignType: [],

  influencerType: "",

  gender: "",
  dateOfBirth: "",
  languages: [],
   audienceCountry: "",

  pastWorkWithBrands: "",

  fullAddress: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  youtubeUsername: "",
  youtubeChannelLink: "",
  youtubeSubscribersRange: "",

  commercialsFor1InstagramReel: "",
  photoLink: "",
  commercialsFor1InstagramStory: "",
  commercialsFor1InstagramPost: "",

  commercialsFor1DedicatedYouTubeVideo: "",
  commercialsFor1IntegratedYouTubeVideo: "",
  commercialsFor1DedicatedYouTubeShortsVideo: "",
  commercialsFor1IntegratedYouTubeShortsVideo: "",

  whatKindOfDealDoYouParticipateIn:[],
  speakingVideoLink: "",

  areYouATvMoviesOttCelebrity: "No",
  whatAllPlatformsAreYouAvailableOn: [],

  typeOfCeleb: "",
  howManyAmazonReviewsYouDoPerMonth: "",

  platform: "",
  timestamp: "",
  bio: "",
  
consentToContact: false,
};

const influencerDescription =
  "Join the Influnexa creator database for product reviews, UGC content, influencer marketing opportunities, unboxings, tutorials, and brand collaborations.";

const influencerBreadcrumbs = [
  { name: "Home", path: "/" },
  {
    name: "Influencer Registration",
    path: "/register/influencer",
  },
];

const influencerJsonLd = [
  pageSchema({
    path: "/register/influencer",
    title: "Influencer Registration",
    description: influencerDescription,
    breadcrumbs: influencerBreadcrumbs,
  }),

  breadcrumbSchema(
    "/register/influencer",
    influencerBreadcrumbs
  ),

  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Influnexa creator applicant",
    description:
      "Creator profile submitted for product review, UGC, and influencer marketing campaign consideration.",
    knowsAbout: categories,
  },
];

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function RegisterInfluencer() {

  const [theme, setTheme] = useState(getInitialTheme);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
const [otherLanguage, setOtherLanguage] = useState("");
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

  const [platforms, setPlatforms] = useState({
    yt: false,
    insta: false,
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
    }));
  };

  const updateMulti = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: toggleValue(
        current[field],
        value
      ),
    }));
  };

  const setStep = (step) => {
    setCurrentStep(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const togglePlatform = (platform) => {
    const isYouTube = platform === "yt";
    const platformName = isYouTube
      ? "YouTube"
      : "Instagram";

    const nextValue = !platforms[platform];

    setPlatforms((current) => ({
      ...current,
      [platform]: nextValue,
    }));

    setForm((current) => {
      const currentPlatforms =
        current.whatAllPlatformsAreYouAvailableOn;

      return {
        ...current,
        whatAllPlatformsAreYouAvailableOn:
          nextValue
            ? [
                ...new Set([
                  ...currentPlatforms,
                  platformName,
                ]),
              ]
            : currentPlatforms.filter(
                (item) => item !== platformName
              ),
      };
    });
  };

  const toggleAvailablePlatform = (platform) => {
    setForm((current) => {
      const nextPlatforms = toggleValue(
        current.whatAllPlatformsAreYouAvailableOn,
        platform
      );

      if (platform === "Instagram") {
        setPlatforms((currentPlatforms) => ({
          ...currentPlatforms,
          insta: nextPlatforms.includes(
            "Instagram"
          ),
        }));
      }

      if (platform === "YouTube") {
        setPlatforms((currentPlatforms) => ({
          ...currentPlatforms,
          yt: nextPlatforms.includes(
            "YouTube"
          ),
        }));
      }

      return {
        ...current,
        whatAllPlatformsAreYouAvailableOn:
          nextPlatforms,
      };
    });
  };
const isStepValid = (step) => {
  const requiredFieldsByStep = {
    1: [
      "fullName",
      "email",
      "phoneNumber",
      "dateOfBirth",
    ],

    2: [
      "fullAddress",
      "city",
      "state",
      "pincode",
      "country",
    ],

    3: [
      "categories",
       "engagementRate",
  "audienceCountry",
  "pastWorkWithBrands",
    ],

    4: [
      "whatAllPlatformsAreYouAvailableOn",
    ],

    5: ["campaignType"],

    6: [],

    7: [],
  };

  const requiredFields = requiredFieldsByStep[step] || [];

  // Check normal required fields
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

  // Step 1 - validate phone number
  if (step === 1) {
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      return false;
    }

    // If WhatsApp number is entered, it must also be 10 digits
    if (
      form.whatsappNumber &&
      !/^\d{10}$/.test(form.whatsappNumber)
    ) {
      return false;
    }

    // Email format
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return false;
    }
  }

  // Step 2 - pincode validation
  if (step === 2) {
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return false;
    }
  }

  // Step 4 - platform-specific validation
  if (step === 4) {
    const selectedPlatforms =
      form.whatAllPlatformsAreYouAvailableOn;

    // Instagram selected
    if (selectedPlatforms.includes("Instagram")) {
      if (
        !form.instagramUsername.trim() ||
        !form.instagramProfileLink.trim()
        
      ) {
        return false;
      }

      // Exact followers required if Instagram is selected
      if (
        form.exactFollowers === "" ||
        Number(form.exactFollowers) < 0
      ) {
        return false;
      }
    }

    // YouTube selected
    if (selectedPlatforms.includes("YouTube")) {
      if (
        !form.youtubeUsername.trim() ||
        !form.youtubeChannelLink.trim() ||
        !form.youtubeSubscribersRange.trim()
      ) {
        return false;
      }
    }
  }

  // Step 7 - consent required before submission
  if (step === 7) {
    if (form.consentToContact !== true) {
      return false;
    }
  }

  return true;
};

 const handleSubmit = async (event) => {
  event.preventDefault();

  // Browser required validation
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    setHasValidationAttempt(true);
    return;
  }

  // Extra required checks
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

  if (!form.country.trim()) {
    setStatus({
      type: "error",
      message: "Country is required.",
    });
    return;
  }

  if (form.consentToContact !== true) {
    setStatus({
      type: "error",
      message: "Please accept the consent before submitting.",
    });
    return;
  }

  setStatus({
    type: "loading",
    message: "Saving influencer registration...",
  });

  const numberOrZero = (value) => {
    if (value === "" || value === null || value === undefined) {
      return 0;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const text = (value) => String(value ?? "").trim();

  const array = (value) => {
    if (!Array.isArray(value)) return [];

    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  };

  const payload = {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================
    fullName: text(form.fullName),
    instagramUsername: text(form.instagramUsername),

    instagramProfileLink: text(form.instagramProfileLink),

    instagramFollowersRange: text(
      form.instagramFollowersRange
    ),

    exactFollowers: numberOrZero(
      form.exactFollowers
    ),

    // ==========================================
    // CONTACT
    // ==========================================
    phoneNumber: text(form.phoneNumber),

    whatsappNumber: text(form.whatsappNumber),

    email: text(form.email).toLowerCase(),

    // ==========================================
    // CATEGORIES
    // ==========================================
    categories: array(form.categories),
engagementRate: text(form.engagementRate),

audienceCountry: text(form.audienceCountry),

pastWorkWithBrands: text(form.pastWorkWithBrands),
    campaignType: array(form.campaignType),

    influencerType: text(
      form.influencerType
    ),

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================
    gender: text(form.gender),

    dateOfBirth: text(form.dateOfBirth),

    languages: array(form.languages),

    // ==========================================
    // ADDRESS
    // ==========================================
    fullAddress: text(form.fullAddress),

    landmark: text(form.landmark),

    city: text(form.city),

    state: text(form.state),

    country: text(form.country),

    pincode: text(form.pincode),

    // ==========================================
    // YOUTUBE
    // ==========================================
    youtubeUsername: text(
      form.youtubeUsername
    ),

    youtubeChannelLink: text(
      form.youtubeChannelLink
    ),

    youtubeSubscribersRange: text(
      form.youtubeSubscribersRange
    ),

    // ==========================================
    // COMMERCIALS
    // ==========================================
    commercialsFor1InstagramReel:
      numberOrZero(
        form.commercialsFor1InstagramReel
      ),

    photoLink: text(form.photoLink),

    commercialsFor1InstagramStory:
      numberOrZero(
        form.commercialsFor1InstagramStory
      ),

    commercialsFor1InstagramPost:
      numberOrZero(
        form.commercialsFor1InstagramPost
      ),

    commercialsFor1DedicatedYouTubeVideo:
      numberOrZero(
        form.commercialsFor1DedicatedYouTubeVideo
      ),

    commercialsFor1IntegratedYouTubeVideo:
      numberOrZero(
        form.commercialsFor1IntegratedYouTubeVideo
      ),

    commercialsFor1DedicatedYouTubeShortsVideo:
      numberOrZero(
        form.commercialsFor1DedicatedYouTubeShortsVideo
      ),

    commercialsFor1IntegratedYouTubeShortsVideo:
      numberOrZero(
        form.commercialsFor1IntegratedYouTubeShortsVideo
      ),

    // ==========================================
    // OTHER INFORMATION
    // ==========================================
    whatKindOfDealDoYouParticipateIn:
      array(
        form.whatKindOfDealDoYouParticipateIn
      ),

    speakingVideoLink: text(
      form.speakingVideoLink
    ),

    areYouATvMoviesOttCelebrity:
      text(
        form.areYouATvMoviesOttCelebrity
      ),

    whatAllPlatformsAreYouAvailableOn:
      array(
        form.whatAllPlatformsAreYouAvailableOn
      ),

    typeOfCeleb: text(
      form.typeOfCeleb
    ),

    howManyAmazonReviewsYouDoPerMonth:
      numberOrZero(
        form.howManyAmazonReviewsYouDoPerMonth
      ),

    platform: text(form.platform),

    timestamp: new Date().toLocaleString(),

    bio: text(form.bio),

    // ==========================================
    // CONSENT
    // ==========================================
    consentToContact:
      form.consentToContact === true,
  };

  console.log("SUBMIT PAYLOAD:", payload);

  try {
    await submitRegistration(
      "influencers",
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
        "Something went wrong while submitting the registration.",
    });
  }
};
  const closeSuccessModal = () => {
    setForm(initialForm);

    setPlatforms({
      yt: false,
      insta: false,
    });

    setCurrentStep(1);

    setHasValidationAttempt(false);

    setShowSuccessModal(false);
  };

const nextStep = (step) => {
  // Going backwards is always allowed
  if (step < currentStep) {
    setStep(step);
    return;
  }

  // Moving forward only when current step is valid
  if (step > currentStep) {
    if (!isStepValid(currentStep)) {
      return;
    }
  }

  setStep(step);
};
  return (
    <div
      className={`site min-h-screen ${
        theme === "dark"
          ? "dark bg-slate-950 text-white"
          : "bg-[#FAF8F4] text-[#17161C]"
      }`}
    >
      <SEO
        title="Influencer Registration | Influnexa"
        description={influencerDescription}
        path="/register/influencer"
        jsonLd={influencerJsonLd}
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

          {/* HEADER */}

          <header className="mb-8 border-b border-[#E7E3DA] pb-7">
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#C7842A]">
              Creator Onboarding
            </p>

            <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight">
              Influencer Registration
            </h1>

            <p className="max-w-[600px] text-[15px] leading-6 text-[#8A8578]">
              Fill in your details once — we'll only
              ask what applies to the platforms you
              actually work on. Matches your existing
              response sheet columns, so nothing needs
              remapping later.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr] lg:gap-12">

            {/* STEP RAIL */}

            <nav className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:block">
                {[
                  "Basic Details",
                  "Address",
                  "Profile",
                  "Platforms",
                  "Deals",
                  "Anything Else",
                  "Review & Submit",
                ].map((label, index) => {
                  const step = index + 1;

                  return (
                    <button
                      type="button"
                      key={step}
onClick={() => {
  // Going backward is always allowed
  if (step < currentStep) {
    setStep(step);
    return;
  }

  // Clicking the current step does nothing
  if (step === currentStep) {
    return;
  }

  // Validate each step exactly like Continue button
  for (let i = currentStep; i < step; i++) {
    if (!isStepValid(i)) {
      return;
    }
  }

  // All previous steps are valid
  setStep(step);
}}
                      className={`
                        flex shrink-0 items-center
                        gap-2 rounded-[10px] px-2 py-2.5
                        text-left transition
                        lg:w-full
                        ${
                          currentStep === step
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
                            step < currentStep
                              ? "border-[#1F7A6C] bg-[#1F7A6C] text-white"
                              : currentStep === step
                              ? "border-[#E8A33D] bg-[#FDF4E4] text-[#C7842A]"
                              : "border-[#E7E3DA] text-[#8A8578]"
                          }
                        `}
                      >
                        {step < currentStep
                          ? "✓"
                          : step}
                      </span>

                      <span
                        className={`
                          whitespace-nowrap text-[13.5px]
                          ${
                            currentStep === step
                              ? "font-semibold text-[#17161C]"
                              : "text-[#8A8578]"
                          }
                        `}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* FORM */}

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

              {/* STEP 1 */}

              {currentStep === 1 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <h2 className="text-[21px] font-semibold">
                    Basic Details
                  </h2>

                  <p className="mb-6 text-[13.5px] leading-6 text-[#8A8578]">
                    Your core contact information —
                    this is how brands and our team will
                    reach you.
                  </p>

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <Input
                      label="Full Name"
                      required
                      name="fullName"
                      value={form.fullName}
                      onChange={updateField}
                      placeholder="e.g. Aditi Sharma"
                    />

                    <Input
                      label="Email"
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      placeholder="you@example.com"
                    />

                    <Input
                      label="Phone Number"
                      required
                      type="tel"
                      inputMode="numeric"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={(e) => {
                        const value =
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                        setForm((current) => ({
                          ...current,
                          phoneNumber: value,
                        }));
                      }}
                      pattern="[0-9]{10}"
                      minLength={10}
                      maxLength={10}
                      placeholder="9876543210"
                    />

                    <Input
                      label="WhatsApp Number"
                      type="tel"
                      inputMode="numeric"
                      name="whatsappNumber"
                      value={form.whatsappNumber}
                      onChange={(e) => {
                        const value =
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                        setForm((current) => ({
                          ...current,
                          whatsappNumber: value,
                        }));
                      }}
                      pattern="[0-9]{10}"
                      minLength={10}
                      maxLength={10}
                      placeholder="Same as phone number? Leave blank if same"
                    />

                    <SelectInput
                      label="Gender"
                      name="gender"
                      value={form.gender}
                      onChange={updateField}
                      options={[
                         "Male",
                        "Female",
                        "Other",
                        
                      ]}
                    />

                    <Input
                      label="Date of Birth"
                      required
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={updateField}
                     
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Profile Photo URL"
                        type="url"
                        name="photoLink"
                        value={form.photoLink}
                        onChange={updateField}
                        placeholder="Paste a shareable photo link (Goggle Drive, Dropbox,etc.)"
                      />
                    </div>

                  </div>

                  <Navigation
                    onNext={() => nextStep(2)}
                     nextDisabled={!isStepValid(1)}
                  />
                </section>
              )}

              {/* STEP 2 */}

              {currentStep === 2 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Address"
                    hint="Used for shipping PR products and verifying your location."
                  />

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <div className="md:col-span-2">
                      <TextArea
                        label="Full Address"
                        required
                        name="fullAddress"
                        value={form.fullAddress}
                        onChange={updateField}
                        placeholder="House no., Street, Area"
                        rows={2}
                      />
                    </div>

                    <Input
                      label="Landmark"
                      name="landmark"
                      value={form.landmark}
                      onChange={updateField}
                      placeholder="Nearby Landmark"
                    />

                    <Input
                      label="City"
                      required
                      name="city"
                      value={form.city}
                      onChange={updateField}
                      placeholder="Enter City"
                    />

                    <Input
                      label="State"
                      required
                      name="state"
                      value={form.state}
                      onChange={updateField}
                      placeholder="Enter State"
                    />

                    <Input
                      label="Pincode"
                      required
                      name="pincode"
                      value={form.pincode}
                      onChange={updateField}
                      placeholder="6-Digit PIN Code"
                      inputMode="numeric"
                    />

                    <Input
                      label="Country"
                      required
                      name="country"
                      value={form.country}
                      onChange={updateField}
                      placeholder="Country"
                    />

                  </div>

                  <Navigation
                    onBack={() => nextStep(1)}
                    onNext={() => nextStep(3)}
                      nextDisabled={!isStepValid(2)}
                  />
                </section>
              )}

              {/* STEP 3 */}

              {currentStep === 3 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Profile"
                    hint="Tell brands what you create, in which languages, and who you are."
                  />

                  <div>
  <p className="mb-2.5 text-[13px] font-semibold">
    Categories{" "}
    <span className="text-red-500">*</span>
  </p>

  <div className="flex flex-wrap gap-2">
    {(showAllCategories
      ? categories
      : categories.slice(0, 15)
    ).map((category) => {
      const active =
        form.categories.includes(category);

      return (
        <button
          type="button"
          key={category}
          onClick={() =>
            updateMulti("categories", category)
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
          {category}
        </button>
      );
    })}
  </div>

  <button
    type="button"
    onClick={() =>
      setShowAllCategories(
        (current) => !current
      )
    }
    className="mt-3 rounded-lg border border-[#E7E3DA] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#17161C] transition hover:border-[#d8d2c4] hover:bg-[#FAF9F6]"
  >
    {showAllCategories
      ? "View Less"
      : "View More"}
  </button>
</div>
<div className="mt-6">
      <Input
        label="Engagement Rate"
        name="engagementRate"
        value={form.engagementRate}
        onChange={updateField}
        placeholder="e.g. 4.5%"
        required
      />
    </div>

               <div className="mt-6">
  <p className="mb-2.5 text-[13px] font-semibold">
    Languages
  </p>

  <div className="flex flex-wrap gap-2">
    {/* Default languages */}
    {languages.map((language) => {
      const active = form.languages.includes(language);

      return (
        <button
          type="button"
          key={language}
          onClick={() =>
            updateMulti("languages", language)
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
          {language}
        </button>
      );
    })}

    {/* Custom languages */}
    {form.languages
      .filter(
        (language) => !languages.includes(language)
      )
      .map((language) => (
        <button
          type="button"
          key={language}
          onClick={() =>
            updateMulti("languages", language)
          }
          className="rounded-full border-[1.5px] border-[#17161C] bg-[#17161C] px-3.5 py-2 text-[13.5px] text-white transition"
        >
          {language} <span className="ml-1">×</span>
        </button>
      ))}

    {/* Other */}
    <button
      type="button"
      onClick={() =>
        setShowOtherLanguage((current) => !current)
      }
      className={`
        rounded-full border-[1.5px]
        px-3.5 py-2 text-[13.5px]
        transition
        ${
          showOtherLanguage
            ? "border-[#17161C] bg-[#17161C] text-white"
            : "border-[#E7E3DA] bg-white text-[#17161C] hover:border-[#d8d2c4]"
        }
      `}
    >
      + Other
    </button>
  </div>

  {/* Other language input */}
  {showOtherLanguage && (
    <div className="mt-4">
      <input
        type="text"
        value={otherLanguage}
        onChange={(e) =>
          setOtherLanguage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;

          e.preventDefault();

          const language = otherLanguage.trim();

          if (!language) return;

          const alreadyExists = form.languages.some(
            (item) =>
              item.toLowerCase() === language.toLowerCase()
          );

          if (!alreadyExists) {
            setForm((current) => ({
              ...current,
              languages: [
                ...current.languages,
                language,
              ],
            }));
          }

          setOtherLanguage("");
        }}
        placeholder="Enter another language and press Enter"
        className="w-full rounded-[9px] border-[1.5px] border-[#E7E3DA] bg-white px-[13px] py-[11px] text-[14.5px] text-[#17161C] outline-none transition focus:border-[#E8A33D] focus:ring-4 focus:ring-[#E8A33D]/20"
      />
    </div>
  )}
</div>
<div className="mt-6">
      <Input
        label="Audience Country"
        name="audienceCountry"
        value={form.audienceCountry}
        onChange={updateField}
        placeholder="e.g. India, USA, UK"
        required
      />

      
    </div>

    {/* Past Work With Brands */}
    <div className="mt-6">
      <TextArea
        label="Past Work with Brands"
        name="pastWorkWithBrands"
        value={form.pastWorkWithBrands}
        onChange={updateField}
        placeholder="Mention some brands you have previously worked with"
        rows={3}
        required
      />
    </div>
                  <div className="mt-6">
                    <TextArea
                      label="Bio"
                      name="bio"
                      value={form.bio}
                      onChange={updateField}
                      placeholder="Write a short introduction that brands will see first."
                      rows={3}
                    />
                  </div>

                  <div className="mt-5 grid gap-[18px] md:grid-cols-2">

                    <SelectInput
                      label="Are you a TV/Film/OTT celebrity?"
                      name="areYouATvMoviesOttCelebrity"
                      value={
                        form.areYouATvMoviesOttCelebrity
                      }
                      onChange={updateField}
                      
                      options={[
                        "No",
                        "Yes",
                      ]}
                    />

                    {form.areYouATvMoviesOttCelebrity ===
                      "Yes" && (
                      <Input
                        label="Type of Celeb"
                        name="typeOfCeleb"
                        value={form.typeOfCeleb}
                        onChange={updateField}
                        placeholder="e.g. Actor, Singer, Athlete"
                      />
                    )}

                  </div>

                  <Navigation
                    onBack={() => nextStep(2)}
                    onNext={() => nextStep(4)}
                      nextDisabled={!isStepValid(3)}
                  />
                </section>
              )}

              {/* STEP 4 */}

              {currentStep === 4 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Your Platforms"
                    hint="Select every platform you create for — we'll only show the fields relevant to each."
                  />

                  <ChipField
                    label="What all platforms are you available on"
                    required
                    values={
                      form.whatAllPlatformsAreYouAvailableOn
                    }
                    options={availablePlatforms}
                    onToggle={
                      toggleAvailablePlatform
                    }
                  />

                  <div className="mt-6 grid gap-3.5 md:grid-cols-2">

                    <PlatformCard
                      type="yt"
                      title="Add YouTube rate card"
                      checked={platforms.yt}
                      onClick={() =>
                        togglePlatform("yt")
                      }
                    />

                    <PlatformCard
                      type="insta"
                      title="Add Instagram rate card"
                      checked={platforms.insta}
                      onClick={() =>
                        togglePlatform("insta")
                      }
                    />

                  </div>

                  {/* INSTAGRAM */}

                  {platforms.insta && (
                    <div className="mt-6 border-t border-dashed border-[#E7E3DA] pt-6">

                      <SubTitle
                        type="insta"
                        title="Instagram Details"
                      />

                      <div className="grid gap-[18px] md:grid-cols-2">

                        <Input
                          label="Instagram Username"
                          name="instagramUsername"
                          value={
                            form.instagramUsername
                          }
                          onChange={updateField}
                          placeholder="@username"
                          required
                        />

                        <Input
                          label="Instagram Profile Link"
                          type="url"
                          name="instagramProfileLink"
                          value={
                            form.instagramProfileLink
                          }
                          onChange={updateField}
                          placeholder="instagram.com/..."
                          required
                        />

                        <SelectInput
                          label="Instagram Followers Range"
                          name="instagramFollowersRange"
                          value={
                            form.instagramFollowersRange
                          }
                          onChange={updateField}
                          options={[
                             "Under 1K",
                              "1K - 10K",
                              "10K - 50K",
                               "50K - 100K",
                               "100K - 500K",
                                "500K - 1M",
                                 "1M - 5M",
                                    "5M+",
                          ]}
                        />

                        <Input
                          label="Exact Followers"
                          type="number"
                          min="0"
                          name="exactFollowers"
                          value={
                            form.exactFollowers
                          }
                          onChange={updateField}
                          placeholder="e.g. 84210"
                          required
                        />

                      </div>

                      <p className="mb-3 mt-6 text-[13px] font-semibold">
                        Commercials (₹)
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">

                        <PriceInput
                          label="Commercials For 1 Instagram Reel"
                          name="commercialsFor1InstagramReel"
                          value={
                            form.commercialsFor1InstagramReel
                          }
                          onChange={updateField}
                        />

                        <PriceInput
                          label="Commercials For 1 Instagram Story"
                          name="commercialsFor1InstagramStory"
                          value={
                            form.commercialsFor1InstagramStory
                          }
                          onChange={updateField}
                        />

                        <PriceInput
                          label="Commercials For 1 Instagram Post"
                          name="commercialsFor1InstagramPost"
                          value={
                            form.commercialsFor1InstagramPost
                          }
                          onChange={updateField}
                        />

                      </div>
                    </div>
                  )}

                  {/* YOUTUBE */}

                  {platforms.yt && (
                    <div className="mt-6 border-t border-dashed border-[#E7E3DA] pt-6">

                      <SubTitle
                        type="yt"
                        title="YouTube Details"
                      />

                      <div className="grid gap-[18px] md:grid-cols-2">

                        <Input
                          label="YouTube Username"
                          name="youtubeUsername"
                          value={
                            form.youtubeUsername
                          }
                          onChange={updateField}
                          placeholder="@handle"
                          required
                        />

                        <Input
                          label="YouTube Channel Link"
                          type="url"
                          name="youtubeChannelLink"
                          value={
                            form.youtubeChannelLink
                          }
                          onChange={updateField}
                          placeholder="youtube.com/..."
                          required
                        />

                        <SelectInput
                          label="YouTube Subscribers Range"
                          name="youtubeSubscribersRange"
                          value={
                            form.youtubeSubscribersRange
                          }
                          onChange={updateField}
                          options={[
                             "Under 1K",
                             "1K - 10K",
                               "10K - 50K",
                               "50K - 100K",
                                "100K - 500K",
                                  "500K - 1M",
                                   "1M - 5M",
                                       "5M+",
                          ]}
                          required
                        />

                      </div>

                      <p className="mb-3 mt-6 text-[13px] font-semibold">
                        Commercials (₹)
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">

                        <PriceInput
                          label="Commercials For 1 Dedicated YouTube Video"
                          name="commercialsFor1DedicatedYouTubeVideo"
                          value={
                            form.commercialsFor1DedicatedYouTubeVideo
                          }
                          onChange={updateField}
                        />

                        <PriceInput
                          label="Commercials For 1 Integrated YouTube Video"
                          name="commercialsFor1IntegratedYouTubeVideo"
                          value={
                            form.commercialsFor1IntegratedYouTubeVideo
                          }
                          onChange={updateField}
                        />

                        <PriceInput
                          label="Commercials For 1 Dedicated YouTube Shorts Video"
                          name="commercialsFor1DedicatedYouTubeShortsVideo"
                          value={
                            form.commercialsFor1DedicatedYouTubeShortsVideo
                          }
                          onChange={updateField}
                        />

                        <PriceInput
                          label="Commercials For 1 Integrated YouTube Shorts Video"
                          name="commercialsFor1IntegratedYouTubeShortsVideo"
                          value={
                            form.commercialsFor1IntegratedYouTubeShortsVideo
                          }
                          onChange={updateField}
                        />

                      </div>
                    </div>
                  )}

                  <Navigation
                    onBack={() => nextStep(3)}
                    onNext={() => nextStep(5)}
                      nextDisabled={!isStepValid(4)}
                  />
                </section>
              )}

              {/* STEP 5 */}

              {currentStep === 5 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Deals & Campaigns"
                    hint="How you like to work with brands."
                  />

                  <div className="grid gap-[18px] md:grid-cols-2">

                    <SelectInput
                      label="Campaign type"
                      name="campaignType"
                      value={
                        form.campaignType[0] || ""
                      }
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          campaignType: e.target.value
                            ? [e.target.value]
                            : [],
                        }))
                      }
                      options={[
                        "Paid Collaboration",
                        "Barter Collaboration",
                        "Paid Collaboration + Barter Collaboration",
                        "Affiliate",
                      ]}
                      required
                    />

                    <Input
                      label="How many Amazon reviews you do per month"
                      type="number"
                      min="0"
                      name="howManyAmazonReviewsYouDoPerMonth"
                      value={
                        form.howManyAmazonReviewsYouDoPerMonth
                      }
                      onChange={updateField}
                      placeholder="0"
                    />

                  </div>

                  <div className="mt-6">
                    <ChipField
                      label="What kind of deal do you participate in"
                      values={
                        form.whatKindOfDealDoYouParticipateIn
                      }
                      options={dealTypes}
                      onToggle={(value) =>
                        updateMulti(
                          "whatKindOfDealDoYouParticipateIn",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="mt-6">
                    <Input
                      label="Speaking Video Link"
                      type="url"
                      name="speakingVideoLink"
                      value={
                        form.speakingVideoLink
                      }
                      onChange={updateField}
                      placeholder="Link to a sample speaking/talking video"
                    />
                  </div>

                  <Navigation
                    onBack={() => nextStep(4)}
                    onNext={() => nextStep(6)}
                    nextDisabled={!isStepValid(5)}
                  />
                </section>
              )}

              {/* STEP 6 */}

              {currentStep === 6 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Anything Else"
                    hint="Optional — anything you'd like us to know."
                  />

                  <TextArea
                    label="Any message for us"
                    name="bio"
                    value={form.bio}
                    onChange={updateField}
                    placeholder="Type your message here"
                    rows={4}
                  />

                  <Navigation
                    onBack={() => nextStep(5)}
                    onNext={() => nextStep(7)}
                    nextText="Review My Details"
                    nextDisabled={!isStepValid(6)}
                  />
                </section>
              )}

              {/* STEP 7 */}

              {currentStep === 7 && (
                <section className="rounded-[14px] border border-[#E7E3DA] bg-white p-6 shadow-sm md:p-8">

                  <SectionTitle
                    title="Review & Submit"
                    hint="Double-check everything below before you submit."
                  />

                  <Review form={form} />
 {/* CONSENT */}
    <div className="mt-6 rounded-xl border border-[#E7E3DA] bg-[#FAF8F4] p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="consentToContact"
          checked={form.consentToContact}
          onChange={updateField}
          className="mt-1 h-4 w-4 cursor-pointer accent-[#17161C]"
        />

        <span className="text-sm leading-6 text-[#17161C]">
          I agree to be contacted by Influnexa regarding
          influencer marketing opportunities, brand
          collaborations, campaigns, and related
          communications.
          <span className="ml-1 text-red-500">*</span>
        </span>
      </label>

      {!form.consentToContact &&
        status.type === "error" &&
        status.message?.includes("consent") && (
          <p className="mt-2 text-sm text-red-600">
            Please accept the consent before submitting.
          </p>
        )}
    </div>
                  

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
                        status.type === "loading"
                      }
                      className="rounded-lg bg-[#17161C] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {status.type === "loading"
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

      <SuccessModal
        open={showSuccessModal}
        title="Influencer profile submitted"
        message="Thank you for joining the Influnexa creator database. Our team will review your profile for relevant opportunities."
        onClose={closeSuccessModal}
      />

      <div className="mt-8 text-center flex -translate-y-20 justify-center md:translate-x-31">
        <Button
          className="registration-switch-button"
          href="/register/brand"
          variant="secondary"
        >
          Register as Brand Instead
        </Button>
      </div>
    </div>
  );
}


/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionTitle({ title, hint }) {
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

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

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
        {options.map((option) => {
          const active =
            values.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() =>
                onToggle(option)
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
        })}
      </div>
    </div>
  );
}

function PriceInput({
  label,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </span>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#8A8578]">
          ₹
        </span>

        <input
          {...props}
          type="number"
          min="0"
          className="w-full rounded-[9px] border-[1.5px] border-[#E7E3DA] bg-white py-[11px] pl-[30px] pr-[13px] font-mono text-sm outline-none focus:border-[#E8A33D] focus:ring-4 focus:ring-[#E8A33D]/20"
        />
      </div>
    </label>
  );
}

function PlatformCard({
  type,
  title,
  checked,
  onClick,
}) {
  const isYouTube = type === "yt";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-xl
        border-[1.5px] p-[18px] text-left
        transition
        ${
          checked
            ? "border-[#E8A33D] bg-[#FEFAF2] ring-4 ring-[#E8A33D]/10"
            : "border-[#E7E3DA] bg-white"
        }
      `}
    >
      <span
        className={`
          flex h-[38px] w-[38px]
          shrink-0 items-center justify-center
          rounded-[9px] text-sm font-bold text-white
          ${
            isYouTube
              ? "bg-[#D64545]"
              : "bg-gradient-to-br from-[#C1447E] to-[#E8A33D]"
          }
        `}
      >
        {isYouTube ? "YT" : "IG"}
      </span>

      <span className="text-[15px] font-semibold">
        {title}
      </span>

      <span
        className={`
          ml-auto flex h-5 w-5 shrink-0
          items-center justify-center rounded-full
          border
          ${
            checked
              ? "border-[#E8A33D] bg-[#E8A33D]"
              : "border-[#E7E3DA]"
          }
        `}
      >
        {checked && (
          <span className="text-xs text-white">
            ✓
          </span>
        )}
      </span>
    </button>
  );
}

function SubTitle({ type, title }) {
  const isYouTube = type === "yt";

  return (
    <div className="mb-4 flex items-center gap-2">
      <span
        className={`
          flex h-[26px] w-[26px]
          items-center justify-center rounded-[7px]
          text-xs font-bold text-white
          ${
            isYouTube
              ? "bg-[#D64545]"
              : "bg-gradient-to-br from-[#C1447E] to-[#E8A33D]"
          }
        `}
      >
        {isYouTube ? "YT" : "IG"}
      </span>

      <h3 className="text-[15.5px] font-semibold">
        {title}
      </h3>
    </div>
  );
}

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
        className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${
          nextDisabled
            ? "cursor-not-allowed bg-slate-300"
            : "bg-[#17161C] hover:bg-[#2b2933]"
        }`}
      >
        {nextText}
      </button>
    </div>
  );
}


/* =========================================================
   REVIEW
========================================================= */

function Review({ form }) {
  const item = (label, value) => (
    <div className="flex justify-between gap-4 border-b border-[#F1EEE6] py-2.5 text-sm">
      <span className="text-[#8A8578]">
        {label}
      </span>

      <span className="text-right font-semibold">
        {Array.isArray(value)
          ? value.length
            ? value.join(", ")
            : "—"
          : value || "—"}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">

      <ReviewGroup title="Basic Details">
        {item("Full Name", form.fullName)}
        {item("Email", form.email)}
        {item("Phone Number", form.phoneNumber)}
        {item("Whatsapp Number", form.whatsappNumber)}
        {item("Gender", form.gender)}
        {item("Date of Birth", form.dateOfBirth)}
        {item("Photo Link", form.photoLink)}
      </ReviewGroup>

      <ReviewGroup title="Address">
        {item("Full Address", form.fullAddress)}
        {item("Landmark", form.landmark)}
        {item("City", form.city)}
        {item("State", form.state)}
        {item("Pincode", form.pincode)}
        {item("Country", form.country)}
      </ReviewGroup>

      <ReviewGroup title="Profile">
        {item("Categories", form.categories)}
        {item("Languages", form.languages)}
        {item(
          "TV/movies/OTT celebrity",
          form.areYouATvMoviesOttCelebrity
        )}

        {form.areYouATvMoviesOttCelebrity ===
          "Yes" &&
          item(
            "Type of Celeb",
            form.typeOfCeleb
          )}

        {item("Bio", form.bio)}
      </ReviewGroup>

      <ReviewGroup title="Platforms">
        {item(
          "Available on",
          form.whatAllPlatformsAreYouAvailableOn
        )}
      </ReviewGroup>

      {form.whatAllPlatformsAreYouAvailableOn.includes(
        "Instagram"
      ) && (
        <ReviewGroup title="Instagram">
          {item(
            "Username",
            form.instagramUsername
          )}
          {item(
            "Profile Link",
            form.instagramProfileLink
          )}
          {item(
            "Followers Range",
            form.instagramFollowersRange
          )}
          {item(
            "Exact Followers",
            form.exactFollowers
          )}
          {item(
            "Reel Price",
            form.commercialsFor1InstagramReel
              ? `₹${form.commercialsFor1InstagramReel}`
              : "₹0"
          )}
          {item(
            "Story Price",
            form.commercialsFor1InstagramStory
              ? `₹${form.commercialsFor1InstagramStory}`
              : "₹0"
          )}
          {item(
            "Post Price",
            form.commercialsFor1InstagramPost
              ? `₹${form.commercialsFor1InstagramPost}`
              : "₹0"
          )}
        </ReviewGroup>
      )}

      {form.whatAllPlatformsAreYouAvailableOn.includes(
        "YouTube"
      ) && (
        <ReviewGroup title="YouTube">
          {item(
            "Username",
            form.youtubeUsername
          )}
          {item(
            "Channel Link",
            form.youtubeChannelLink
          )}
          {item(
            "Subscribers Range",
            form.youtubeSubscribersRange
          )}
          {item(
            "Dedicated Video",
            form.commercialsFor1DedicatedYouTubeVideo
              ? `₹${form.commercialsFor1DedicatedYouTubeVideo}`
              : "₹0"
          )}
          {item(
            "Integrated Video",
            form.commercialsFor1IntegratedYouTubeVideo
              ? `₹${form.commercialsFor1IntegratedYouTubeVideo}`
              : "₹0"
          )}
          {item(
            "Dedicated Shorts",
            form.commercialsFor1DedicatedYouTubeShortsVideo
              ? `₹${form.commercialsFor1DedicatedYouTubeShortsVideo}`
              : "₹0"
          )}
          {item(
            "Integrated Shorts",
            form.commercialsFor1IntegratedYouTubeShortsVideo
              ? `₹${form.commercialsFor1IntegratedYouTubeShortsVideo}`
              : "₹0"
          )}
        </ReviewGroup>
      )}

      <ReviewGroup title="Deals">
        {item(
          "Campaign type",
          form.campaignType
        )}
        {item(
          "Deal types",
          form.whatKindOfDealDoYouParticipateIn
        )}
        {item(
          "Speaking Video Link",
          form.speakingVideoLink
        )}
        {item(
          "Amazon reviews/month",
          form.howManyAmazonReviewsYouDoPerMonth
        )}
      </ReviewGroup>

    </div>
  );
}

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