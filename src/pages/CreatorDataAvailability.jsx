import { useEffect, useState } from "react";
import Select from "react-select";
import "../dataavailable.css";

/* =========================================================
   API
========================================================= */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001/api"
).replace(/\/$/, "");


/* =========================================================
   INITIAL FILTERS
========================================================= */

const initialFilters = {
  fullName: "",
  email: "",
  phoneNumber: "",

  instagramFollowersRange: [],
  instagramUsername: "",

  categories: [],

  gender: [],

  city: "",
  state: [],
  country: [],

  platform: [],

  typeOfCeleb: [],

  languages: [],

  campaignType: [],

  influencerType: [],

  contactStatus: "",

  age: [],
};


/* =========================================================
   EMPTY OPTIONS
   THESE COME FROM DATABASE
========================================================= */

const emptyOptions = {
  gender: [],
  state: [],
  country: [],
  typeOfCeleb: [],
  platform: [],
  youtubeSubscribersRange: [],
  instagramFollowersRange: [],
  categories: [],
  languages: [],
  campaignType: [],
};


/* =========================================================
   EMPTY STATS
========================================================= */

const emptyStats = {
  total: 0,
  instagram: 0,
  youtube: 0,
  mixed: 0,
  cities: 0,
  regions: 0,
};


/* =========================================================
   INFLUENCER TYPE
   BACKEND LOGIC
========================================================= */

const influencerTypeOptions = [
  {
    value: "Nano Influencer",
    label: "Nano Influencer",
  },
  {
    value: "Micro Influencer",
    label: "Micro Influencer",
  },
  {
    value: "Macro Influencer",
    label: "Macro Influencer",
  },
  {
    value: "Mega Influencer",
    label: "Mega Influencer",
  },
];


/* =========================================================
   AGE
   BACKEND LOGIC
========================================================= */

const ageOptions = [
  {
    value: "Under 18",
    label: "Under 18",
  },
  {
    value: "18 - 24",
    label: "18 - 24",
  },
  {
    value: "25 - 34",
    label: "25 - 34",
  },
  {
    value: "35 - 44",
    label: "35 - 44",
  },
  {
    value: "45 - 54",
    label: "45 - 54",
  },
  {
    value: "55+",
    label: "55+",
  },
];





/* =========================================================
   CONTACT STATUS
========================================================= */

const contactStatusOptions = [
  {
    value: "Mobile Only",
    label: "Mobile Only",
  },
  {
    value: "Email Only",
    label: "Email Only",
  },
  {
    value: "Both Email & Mobile",
    label: "Both Email & Mobile",
  },
];


/* =========================================================
   REACT SELECT STYLES
========================================================= */
const selectStyles = {
  control: (base, state) => ({
    ...base,

    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",

    minHeight: "46px",
    height: "46px",
    maxHeight: "46px",

    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",

    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 850,

    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(226,232,240,0.55)"
      : "none",

    outline: "none",

    alignItems: "center",

    /* IMPORTANT */
    overflow: "hidden",

    "&:hover": {
      borderColor: "#cbd5e1",
    },
  }),

  /* =====================================================
     SELECTED VALUES
  ===================================================== */

  valueContainer: (base) => ({
    ...base,

    boxSizing: "border-box",

    height: "44px",
    minHeight: "44px",
    maxHeight: "44px",

    padding: "2px 9px",

    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",

    /* IMPORTANT */
    minWidth: 0,
    maxWidth: "100%",

    /*
      Do NOT use width: 100% here.
      React Select controls this flex area.
    */
    width: "auto",

    /*
      This makes selected options scroll
      INSIDE the select.
    */
    overflowX: "auto",
    overflowY: "hidden",

    flex: "1 1 auto",

    scrollbarWidth: "thin",

    "&::-webkit-scrollbar": {
      height: "4px",
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "#cbd5e1",
      borderRadius: "10px",
    },
  }),

  placeholder: (base) => ({
    ...base,

    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 850,

    whiteSpace: "nowrap",

    overflow: "hidden",
    textOverflow: "ellipsis",

    maxWidth: "100%",
  }),

  /* =====================================================
     INPUT
  ===================================================== */

  input: (base) => ({
    ...base,

    margin: "0",
    padding: "0",

    minWidth: "2px",
    width: "2px",

    height: "20px",

    flexShrink: 0,
  }),

  /* =====================================================
     SELECTED TAG
  ===================================================== */

  multiValue: (base) => ({
    ...base,

    backgroundColor: "#f1f5f9",

    borderRadius: "7px",

    margin: "2px 3px 2px 0",

    height: "30px",

    /*
      Never allow the tag to shrink.
    */
    width: "max-content",
    minWidth: "max-content",
    maxWidth: "none",

    flex: "0 0 auto",
    flexShrink: 0,

    display: "flex",
    alignItems: "center",
  }),

  multiValueLabel: (base) => ({
    ...base,

    color: "#475569",

    fontSize: "13px",

    padding: "5px 7px",

    whiteSpace: "nowrap",

    overflow: "visible",

    width: "max-content",
    maxWidth: "none",

    flexShrink: 0,
  }),

  multiValueRemove: (base) => ({
    ...base,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    width: "26px",
    height: "30px",

    padding: "0",

    color: "#64748b",

    cursor: "pointer",

    flexShrink: 0,

    "&:hover": {
      backgroundColor: "#e2e8f0",
      color: "#334155",
    },
  }),

  /* =====================================================
     INDICATORS
  ===================================================== */

  indicatorsContainer: (base) => ({
    ...base,

    height: "44px",

    display: "flex",
    alignItems: "center",

    flexShrink: 0,

    minWidth: "auto",

    backgroundColor: "#ffffff",
  }),

  clearIndicator: (base) => ({
    ...base,

    padding: "6px",

    color: "#94a3b8",

    flexShrink: 0,

    "&:hover": {
      color: "#64748b",
    },
  }),

  dropdownIndicator: (base) => ({
    ...base,

    padding: "8px",

    color: "#94a3b8",

    flexShrink: 0,

    "&:hover": {
      color: "#64748b",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  /* =====================================================
     DROPDOWN
  ===================================================== */

  menu: (base) => ({
    ...base,

    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",

    zIndex: 9999,

    borderRadius: "12px",

    border: "1px solid #e2e8f0",

    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",

    overflow: "hidden",
  }),

  menuList: (base) => ({
    ...base,

    maxHeight: "250px",

    overflowY: "auto",
    overflowX: "hidden",

    padding: "6px 0",

    scrollbarWidth: "thin",

    "&::-webkit-scrollbar": {
      width: "6px",
    },

    "&::-webkit-scrollbar-track": {
      background: "#f8fafc",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "#cbd5e1",
      borderRadius: "10px",
    },
  }),

  option: (base, state) => ({
    ...base,

    fontSize: "13px",
    fontWeight: 600,

    whiteSpace: "normal",
    wordBreak: "break-word",

    padding: "9px 12px",

    backgroundColor: state.isSelected
      ? "#f0fdf4"
      : state.isFocused
        ? "#f8fafc"
        : "#ffffff",

    color: state.isSelected
      ? "#047857"
      : "#334155",

    cursor: "pointer",

    "&:active": {
      backgroundColor: "#f0fdf4",
    },
  }),

  /* =====================================================
     PORTAL
  ===================================================== */

  menuPortal: (base) => ({
    ...base,

    zIndex: 99999,
  }),
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CreatorDataAvailability() {

  const [filters, setFilters] =
    useState(initialFilters);

  const [options, setOptions] =
    useState(emptyOptions);

  const [stats, setStats] =
    useState(emptyStats);

  const [matchingCreators, setMatchingCreators] =
    useState(0);

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasChecked, setHasChecked] =
    useState(false);


  /* =========================================================
     FETCH DATABASE FILTER OPTIONS
  ========================================================= */

  useEffect(() => {
    fetchFilterOptions();
  }, []);


  const fetchFilterOptions = async () => {

    try {

      setLoadingOptions(true);

      setError("");

      const response = await fetch(
        `${API_BASE_URL}/csv-creators/filter-options`
      );

      if (!response.ok) {

        throw new Error(
          `Failed to load filter options (${response.status})`
        );

      }

      const result =
        await response.json();

      console.log(
        "DATABASE FILTER OPTIONS:",
        result
      );

      if (
        result.success &&
        result.options
      ) {

        setOptions({

          gender:
            result.options.gender || [],

          state:
            result.options.state || [],

          country:
            result.options.country || [],

          typeOfCeleb:
            result.options.typeOfCeleb || [],

          platform:
            result.options.platform || [],

          youtubeSubscribersRange:
            result.options.youtubeSubscribersRange || [],

          /* =================================================
             INSTAGRAM FOLLOWERS RANGE
             COMES DIRECTLY FROM DATABASE
          ================================================= */

          instagramFollowersRange:
            result.options.instagramFollowersRange || [],

          categories:
            result.options.categories || [],

          languages:
            result.options.languages || [],

          campaignType:
            result.options.campaignType || [],

        });

      }

    } catch (error) {

      console.error(
        "FILTER OPTIONS ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load filter options."
      );

    } finally {

      setLoadingOptions(false);

    }

  };


  /* =========================================================
     SIMPLE INPUT
  ========================================================= */

  const updateFilter = (
    name,
    value
  ) => {

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  /* =========================================================
     REACT SELECT
  ========================================================= */

  const updateSelectFilter = (
    name,
    selectedOptions
  ) => {

    const values =
      selectedOptions
        ? selectedOptions.map(
            (item) => item.value
          )
        : [];

    updateFilter(
      name,
      values
    );

  };


  /* =========================================================
     CONVERT DATABASE VALUES TO REACT SELECT OPTIONS
  ========================================================= */

  const makeOptions = (
    values
  ) => {

    if (!Array.isArray(values)) {
      return [];
    }

    return values
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(
            typeof value === "object"
              ? value.value
              : value
          ).trim() !== ""
      )
      .map((value) => {

        /* =================================================
           SUPPORT BOTH DATABASE FORMATS

           "Under 1K"

           OR

           {
             value: "Under 1K",
             label: "Under 1K"
           }
        ================================================= */

        if (
          typeof value === "object" &&
          value !== null
        ) {

          return {
            value: String(
              value.value ?? value.label ?? ""
            ),

            label: String(
              value.label ?? value.value ?? ""
            ),
          };

        }

        return {
          value: String(value),
          label: String(value),
        };

      });

  };


  /* =========================================================
     BUILD QUERY
  ========================================================= */

  const buildQueryParams = () => {

    const params =
      new URLSearchParams();


    /* -------------------------------------------------------
       FULL NAME
    ------------------------------------------------------- */

    if (
      filters.fullName.trim()
    ) {

      params.set(
        "fullName",
        filters.fullName.trim()
      );

    }


    /* -------------------------------------------------------
       EMAIL
    ------------------------------------------------------- */

    if (
      filters.email.trim()
    ) {

      params.set(
        "email",
        filters.email.trim()
      );

    }


    /* -------------------------------------------------------
       PHONE
    ------------------------------------------------------- */

    if (
      filters.phoneNumber.trim()
    ) {

      params.set(
        "phoneNumber",
        filters.phoneNumber.trim()
      );

    }


    /* -------------------------------------------------------
       INSTAGRAM USERNAME
    ------------------------------------------------------- */

    if (
      filters.instagramUsername.trim()
    ) {

      params.set(
        "instagramUsername",
        filters.instagramUsername.trim()
      );

    }


    /* -------------------------------------------------------
       INSTAGRAM FOLLOWERS
    ------------------------------------------------------- */

    if (
      filters.instagramFollowersRange.length
    ) {

      params.set(
        "instagramFollowersRange",
        filters.instagramFollowersRange.join(",")
      );

    }


    /* -------------------------------------------------------
       CATEGORIES
    ------------------------------------------------------- */

    if (
      filters.categories.length
    ) {

      params.set(
        "categories",
        filters.categories.join(",")
      );

    }


    /* -------------------------------------------------------
       GENDER
    ------------------------------------------------------- */

    if (
      filters.gender.length
    ) {

      params.set(
        "gender",
        filters.gender.join(",")
      );

    }


    /* -------------------------------------------------------
       CITY
    ------------------------------------------------------- */

    if (
      filters.city.trim()
    ) {

      params.set(
        "city",
        filters.city.trim()
      );

    }


    /* -------------------------------------------------------
       STATE
    ------------------------------------------------------- */

    if (
      filters.state.length
    ) {

      params.set(
        "state",
        filters.state.join(",")
      );

    }


    /* -------------------------------------------------------
       COUNTRY
    ------------------------------------------------------- */

    if (
      filters.country.length
    ) {

      params.set(
        "country",
        filters.country.join(",")
      );

    }


    /* -------------------------------------------------------
       PLATFORM
    ------------------------------------------------------- */

    if (
      filters.platform.length
    ) {

      params.set(
        "platform",
        filters.platform.join(",")
      );

    }


    /* -------------------------------------------------------
       TYPE OF CELEBRITY
    ------------------------------------------------------- */

    if (
      filters.typeOfCeleb.length
    ) {

      params.set(
        "typeOfCeleb",
        filters.typeOfCeleb.join(",")
      );

    }


    /* -------------------------------------------------------
       LANGUAGES
    ------------------------------------------------------- */

    if (
      filters.languages.length
    ) {

      params.set(
        "languages",
        filters.languages.join(",")
      );

    }


    /* -------------------------------------------------------
       CAMPAIGN TYPE
    ------------------------------------------------------- */

    if (
      filters.campaignType.length
    ) {

      params.set(
        "campaignType",
        filters.campaignType.join(",")
      );

    }


    /* -------------------------------------------------------
       INFLUENCER TYPE
    ------------------------------------------------------- */

    if (
      filters.influencerType.length
    ) {

      params.set(
        "influencerType",
        filters.influencerType.join(",")
      );

    }


    /* -------------------------------------------------------
       CONTACT STATUS
    ------------------------------------------------------- */

    if (
      filters.contactStatus
    ) {

      params.set(
        "contactStatus",
        filters.contactStatus
      );

    }


    /* -------------------------------------------------------
       AGE
    ------------------------------------------------------- */

    if (
      filters.age.length
    ) {

      params.set(
        "age",
        filters.age.join(",")
      );

    }


    /* -------------------------------------------------------
       SMALL PAGE
       ONLY COUNT/STATS ARE NEEDED
    ------------------------------------------------------- */

    params.set(
      "page",
      "1"
    );

    params.set(
      "limit",
      "1"
    );

    return params;

  };


  /* =========================================================
     CHECK AVAILABILITY
  ========================================================= */

  const checkAvailability =
    async () => {

      try {

        setCheckingAvailability(
          true
        );

        setError("");

        const params =
          buildQueryParams();

        const url =
          `${API_BASE_URL}/csv-creators?${params.toString()}`;

        console.log(
          "AVAILABILITY REQUEST:",
          url
        );

        const response =
          await fetch(url);

        if (!response.ok) {

          throw new Error(
            `Availability request failed (${response.status})`
          );

        }

        const result =
          await response.json();

        console.log(
          "AVAILABILITY RESPONSE:",
          result
        );

        if (!result.success) {

          throw new Error(
            result.message ||
              "Unable to check availability."
          );

        }

        const backendStats =
          result.stats || {};


        /* =====================================================
           COUNT SECTION
           DATA COMES DIRECTLY FROM BACKEND
        ===================================================== */

        const newStats = {

          total:
            Number(
              result.total || 0
            ),

          instagram:
            Number(
              backendStats.instagram || 0
            ),

          youtube:
            Number(
              backendStats.youtube || 0
            ),

          mixed:
            Number(
              backendStats.mixed || 0
            ),

          cities:
            Number(
              backendStats.cities || 0
            ),

          regions:
            Number(
              backendStats.regions || 0
            ),

        };


        setStats(
          newStats
        );

        setMatchingCreators(
          newStats.total
        );

        setHasChecked(
          true
        );

      } catch (error) {

        console.error(
          "CHECK AVAILABILITY ERROR:",
          error
        );

        setError(
          error.message ||
            "Unable to check creator availability."
        );

        setStats(
          emptyStats
        );

        setMatchingCreators(
          0
        );

        setHasChecked(
          false
        );

      } finally {

        setCheckingAvailability(
          false
        );

      }

    };


  /* =========================================================
     INITIAL DATABASE COUNTS

     THIS IS THE ONLY NEW BEHAVIOUR:
     LOAD FULL DATABASE COUNTS WHEN PAGE OPENS.
  ========================================================= */

  useEffect(() => {

    checkAvailability();

  }, []);


  /* =========================================================
     RESET

     Reset filters AND reload full database counts.
  ========================================================= */

  /* =========================================================
   RESET

   Reset filters AND reload FULL DATABASE counts
========================================================= */

const resetFilters = async () => {

  // Reset UI filters immediately
  setFilters({
    ...initialFilters,
  });

  setError("");

  // Temporarily show loading state
  setCheckingAvailability(true);
  setHasChecked(false);

  try {

    // IMPORTANT:
    // Build a completely empty query so the
    // backend returns FULL database counts.
    const params = new URLSearchParams();

    params.set("page", "1");
    params.set("limit", "1");

    const url =
      `${API_BASE_URL}/csv-creators?${params.toString()}`;

    console.log(
      "RESET AVAILABILITY REQUEST:",
      url
    );

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Availability request failed (${response.status})`
      );
    }

    const result =
      await response.json();

    console.log(
      "RESET AVAILABILITY RESPONSE:",
      result
    );

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to reload creator availability."
      );
    }

    const backendStats =
      result.stats || {};

    const newStats = {

      total:
        Number(
          result.total || 0
        ),

      instagram:
        Number(
          backendStats.instagram || 0
        ),

      youtube:
        Number(
          backendStats.youtube || 0
        ),

      mixed:
        Number(
          backendStats.mixed || 0
        ),

      cities:
        Number(
          backendStats.cities || 0
        ),

      regions:
        Number(
          backendStats.regions || 0
        ),

    };

    // Update all count cards
    setStats(newStats);

    // Update matching creators
    setMatchingCreators(
      newStats.total
    );

    // Show counts
    setHasChecked(true);

  } catch (error) {

    console.error(
      "RESET AVAILABILITY ERROR:",
      error
    );

    setError(
      error.message ||
        "Unable to reload creator availability."
    );

    setStats(
      emptyStats
    );

    setMatchingCreators(0);

    setHasChecked(false);

  } finally {

    setCheckingAvailability(false);

  }

};


  /* =========================================================
     FORMAT NUMBER
  ========================================================= */

  const formatNumber =
    (number) => {

      return new Intl.NumberFormat(
        "en-IN"
      ).format(
        Number(number || 0)
      );

    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="creator-availability-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="availability-header">

        <div>

          <p className="availability-eyebrow">
            DATA AVAILABILITY
          </p>

          <h2>
            Check Creator Data Availability
          </h2>

        </div>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div
          style={{
            margin: "0 0 20px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>

      )}


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="availability-stats">


        {/* TOTAL */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.total)}
            </strong>

            <span>
              Total Creators
            </span>

          </div>

        </article>


        {/* INSTAGRAM */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            ◎
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.instagram)}
            </strong>

            <span>
              Instagram Creators
            </span>

          </div>

        </article>


        {/* YOUTUBE */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            ▶
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.youtube)}
            </strong>

            <span>
              YouTube Creators
            </span>

          </div>

        </article>


        {/* INSTAGRAM + YOUTUBE */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            IG
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.mixed)}
            </strong>

            <span>
              Instagram + YouTube
            </span>

          </div>

        </article>


        {/* CITIES */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            📍
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.cities)}
            </strong>

            <span>
              Cities
            </span>

          </div>

        </article>


        {/* REGIONS */}

        <article className="availability-stat-card">

          <div className="stat-icon">
            📍
          </div>

          <div>

            <strong>
              {checkingAvailability && !hasChecked
                ? "..."
                : formatNumber(stats.regions)}
            </strong>

            <span>
              Regions
            </span>

          </div>

        </article>

      </section>


      {/* =====================================================
          FILTER PANEL
      ===================================================== */}

      <section className="availability-filter-panel">


        {/* ===================================================
            FILTER HEADER
        =================================================== */}

        <div className="availability-filter-header">

          <div className="availability-filter-title">

            <div className="filter-big-icon">
              ▼
            </div>

            <div>

              <h3>
                Set Your Brand Requirements
              </h3>
            </div>

          </div>


          <div className="availability-actions">

            <button
              type="button"
              onClick={resetFilters}
              className="availability-reset"
              disabled={
                checkingAvailability
              }
            >
              ↻ Reset Filters
            </button>


            <button
              type="button"
              onClick={
                checkAvailability
              }
              className="availability-check"
              disabled={
                checkingAvailability ||
                loadingOptions
              }
            >

              {checkingAvailability
                ? "⏳ Checking..."
                : "🔍 Check Availability"}

            </button>

          </div>

        </div>


        {/* ===================================================
            FILTER GRID
        =================================================== */}

        <div className="availability-filter-grid">


       

{/* =================================================
    INSTAGRAM FOLLOWERS RANGE
================================================= */}

<label>
  Instagram Followers Range

  <Select
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    isSearchable={false}

    placeholder="Instagram Followers Range"

    styles={selectStyles}

    menuPortalTarget={document.body}
    menuPosition="fixed"

    options={[
      { value: "Under 1K", label: "Under 1K" },
      { value: "1K - 10K", label: "1K - 10K" },
      { value: "10K - 50K", label: "10K - 50K" },
      { value: "50K - 100K", label: "50K - 100K" },
      { value: "100K - 500K", label: "100K - 500K" },
      { value: "500K - 1M", label: "500K - 1M" },
      { value: "1M - 5M", label: "1M - 5M" },
      { value: "5M+", label: "5M+" },
    ]}

    value={
      (filters.instagramFollowersRange || []).map(
        (item) => ({
          value: item,
          label: item,
        })
      )
    }

    onChange={(selectedOptions) => {
      updateSelectFilter(
        "instagramFollowersRange",
        selectedOptions
      );
    }}
  />
</label>



          {/* CATEGORIES */}

          <label>

            Categories

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.categories
              )}
              value={makeOptions(
                filters.categories
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "categories",
                  selected
                )
              }
              placeholder="Categories"
              noOptionsMessage={() =>
                "No categories found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* GENDER */}

          <label>

            Gender

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.gender
              )}
              value={makeOptions(
                filters.gender
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "gender",
                  selected
                )
              }
              placeholder="Gender"
              noOptionsMessage={() =>
                "No gender found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* CITY */}

          <label>

            City

            <input
              type="text"
              value={
                filters.city
              }
              placeholder="City"
              onChange={(e) =>
                updateFilter(
                  "city",
                  e.target.value
                )
              }
            />

          </label>


          {/* STATE */}

          <label>

            State

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.state
              )}
              value={makeOptions(
                filters.state
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "state",
                  selected
                )
              }
              placeholder="State"
              noOptionsMessage={() =>
                "No states found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* COUNTRY */}

          <label>

            Country

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.country
              )}
              value={makeOptions(
                filters.country
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "country",
                  selected
                )
              }
              placeholder="Country"
              noOptionsMessage={() =>
                "No countries found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* PLATFORM */}

          <label>

            Platform

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.platform
              )}
              value={makeOptions(
                filters.platform
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "platform",
                  selected
                )
              }
              placeholder="Platform"
              noOptionsMessage={() =>
                "No platforms found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* TYPE OF CELEBRITY */}

          <label>

            Type Of Celebrity

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.typeOfCeleb
              )}
              value={makeOptions(
                filters.typeOfCeleb
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "typeOfCeleb",
                  selected
                )
              }
              placeholder="Type Of Celebrity"
              noOptionsMessage={() =>
                "No celebrity types found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* LANGUAGES */}

          <label>

            Languages

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.languages
              )}
              value={makeOptions(
                filters.languages
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "languages",
                  selected
                )
              }
              placeholder="Languages"
              noOptionsMessage={() =>
                "No languages found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* CAMPAIGN TYPE */}

          <label>

            Campaign Type

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isLoading={
                loadingOptions
              }
              options={makeOptions(
                options.campaignType
              )}
              value={makeOptions(
                filters.campaignType
              )}
              onChange={(selected) =>
                updateSelectFilter(
                  "campaignType",
                  selected
                )
              }
              placeholder="Campaign Type"
              noOptionsMessage={() =>
                "No campaign types found"
              }
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* INFLUENCER TYPE */}

          <label>

            Influencer Type

            <Select
              isMulti
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              options={
                influencerTypeOptions
              }
              value={
                influencerTypeOptions.filter(
                  (item) =>
                    filters.influencerType.includes(
                      item.value
                    )
                )
              }
              onChange={(selected) =>
                updateSelectFilter(
                  "influencerType",
                  selected
                )
              }
              placeholder="Influencer Type"
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* CONTACT STATUS */}

          <label>

            Contact Status

            <Select
              isSearchable={false}
              isClearable
              options={
                contactStatusOptions
              }
              value={
                contactStatusOptions.find(
                  (item) =>
                    item.value ===
                    filters.contactStatus
                ) || null
              }
              onChange={(selected) =>
                updateFilter(
                  "contactStatus",
                  selected
                    ? selected.value
                    : ""
                )
              }
              placeholder="Contact Status"
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>


          {/* AGE */}

          <label>

            Age

            <Select
              isMulti
              isSearchable={false}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              options={
                ageOptions
              }
              value={
                ageOptions.filter(
                  (item) =>
                    filters.age.includes(
                      item.value
                    )
                )
              }
              onChange={(selected) =>
                updateSelectFilter(
                  "age",
                  selected
                )
              }
              placeholder="Age"
              menuPortalTarget={
                document.body
              }
              menuPosition="fixed"
              styles={
                selectStyles
              }
            />

          </label>

        </div>

      </section>

    </div>

  );

}