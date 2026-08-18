import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../config/Config";
import { FaEdit } from "react-icons/fa";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import Select from "react-select";

function CsvCreatorSection() {
const [copiedEmail, setCopiedEmail] = useState(null);
const [copiedPhone, setCopiedPhone] = useState(null);
  const [creators, setCreators] = useState([]);
  const [filterTimeout,setFilterTimeout] = useState(null);
  const [isFiltered,setIsFiltered] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
const [showEdit, setShowEdit] = useState(false);
const adminEmail = localStorage.getItem("adminEmail") || "";
const [expandedBios, setExpandedBios] = useState({});
const [copiedWhatsapp, setCopiedWhatsapp] = useState(null);
const [page, setPage] = useState(1);
const [limit] = useState(100);
const [totalPages, setTotalPages] = useState(1);
const [totalRecords, setTotalRecords] = useState(0);
const handleEdit = (creator) => {
  setSelectedCreator(creator);
  setShowEdit(true);
};

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({

   // Personal
  fullName: "",
  email: "",
  phoneNumber: "",

  // Instagram
  instagramUsername: "",
  instagramFollowersRange:[],

  exactFollowers:"",

  // Category
  categories: [],

  // Personal
  gender: [],

  dateOfBirth:"",
  pincode:"",

  // Location
  city: "",
  state: [],
  country: [],

  // YouTube
  youtubeUsername: "",
  youtubeSubscribersRange: [],

  // Celebrity
  typeOfCeleb: [],

  // Platform
  platform: [],

  // Languages
  languages: [],

  InflunexaUserId: "",
  campaignType:[],
  influencerType: [],
  contactStatus: [],
});

const [filterOptions, setFilterOptions] = useState({
  gender: [],
  state: [],
  country: [],
  categories: [],
  languages: [],
  campaignType: [],
  typeOfCeleb: [],
  platform: [],
  youtubeSubscribersRange: [],
  instagramFollowersRange: [
  { label: "Under 1K", value: "Under 1K" },
  { label: "1K - 10K", value: "1K - 10K" },
  { label: "10K - 50K", value: "10K - 50K" },
  { label: "50K - 100K", value: "50K - 100K" },
  { label: "100K - 500K", value: "100K - 500K" },
  { label: "500K - 1M", value: "500K - 1M" },
  { label: "1M - 5M", value: "1M - 5M" },
  { label: "5M+", value: "5M+" },
],
});


const fetchFilterOptions = async () => {
  try {
    const res = await axios.get(
      `${Config.API_URL}/csv-creators/filter-options`
    );

    setFilterOptions((prev) => ({
  ...prev,
  ...res.data.options,
}));

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchFilterOptions();
}, []);
const updateCsvCreator = async () => {
  try {
    const res = await axios.put(
      `${Config.API_URL}/csv-creators/${selectedCreator._id}`,
      {
      ...selectedCreator,
    updatedBy: adminEmail,
    updatedAt: new Date(),
  }
    );

    alert("Creator updated successfully");

    // update UI without refresh
    setCreators((prev) =>
      prev.map((creator) =>
        creator._id === selectedCreator._id
          ? res.data.creator
          : creator
      )
    );

    setShowEdit(false);

  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};

  // =========================
  // GET CSV CREATORS
  // =========================
  const fetchCreators = async (currentFilters = filters) => {
  try {
    setLoading(true);
 setCreators([]);
    // Remove empty filters
    // Remove empty filters and convert arrays to comma-separated strings
const params = {};

Object.entries(currentFilters).forEach(([key, value]) => {

  if (Array.isArray(value)) {

    if (value.length > 0) {
      params[key] = value.join(",");
    }

  } else if (
    value !== "" &&
    value !== null &&
    value !== undefined
  ) {

    params[key] = value;

  }

});

    const res = await axios.get(
      `${Config.API_URL}/csv-creators`,
      {
        params: {
      ...params,
      page,
      limit,
    },
      }
    );

    setCreators(res.data.data || []);
    setTotalPages(res.data.totalPages);
    setTotalRecords(res.data.total || 0);

  } catch (error) {
    console.log("CSV FETCH ERROR", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCreators();

}, [page]);

  useEffect(() => {

  const socket = io(Config.API_URL);

  socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);
  });

  // New CSV Creator Uploaded
  socket.on("new-csv-creator", () => {
    console.log("New CSV Creator");
    fetchCreators();
  });

  // CSV Creator Updated
  socket.on("update-csv-creator", () => {
    console.log("CSV Creator Updated");
    fetchCreators();
  });

  // Single CSV Creator Deleted
  socket.on("delete-csv-creator", () => {
    console.log("CSV Creator Deleted");
    fetchCreators();
  });

  // All CSV Creators Deleted
  socket.on("delete-all-csv-creators", () => {
    console.log("All CSV Creators Deleted");
    setCreators([]);
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });

  return () => {
    socket.disconnect();
  };
}, []);


  // =========================
  // DELETE CREATOR
  // =========================
  const deleteCreator = async(id)=>{

    const confirmDelete =
      window.confirm(
        "Delete this CSV creator?"
      );


    if(!confirmDelete)
      return;


    try{


      await axios.delete(
        `${Config.API_URL}/csv-creators/${id}`
      );


      fetchCreators();


    }
    catch(error){

      console.log(
        "DELETE ERROR",
        error
      );

    }

  };

// =========================
// DOWNLOAD FILTERED CSV
// =========================

const downloadCSV = async () => {
  try {

    const params = {};

    // Send all current filters
    Object.entries(filters).forEach(([key, value]) => {

      if (Array.isArray(value)) {

        if (value.length > 0) {
          params[key] = value.join(",");
        }

      } else if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {

        params[key] = value;

      }

    });

    // Tell backend to return ALL matching records
    params.download = true;

    const res = await axios.get(
      `${Config.API_URL}/csv-creators`,
      {
        params,
      }
    );

    const allCreators = res.data.data;

const formattedData = allCreators.map((creator) => ({
  "Timestamp": creator.timestamp || "",

  "Instagram Username": creator.instagramUsername || "",

  "Instagram Profile Link": creator.instagramProfileLink || "",

  "Instagram Followers Range": creator.instagramFollowersRange || "",

  "Exact Followers": creator.exactFollowers || "",

  "Categories": (creator.categories || []).join(","),

  "Phone Number": creator.phoneNumber || "",

  "Whatsapp Number": creator.whatsappNumber || "",

  "Full Name": creator.fullName || "",

  "Email": creator.email || "",

  "Gender": creator.gender || "",

  "Date of Birth": creator.dateOfBirth || "",

  "Campaign type": (creator.campaignType || []).join(","),

  "What kind of deal do you participate in":
    creator.whatKindOfDealDoYouParticipateIn || "",

  "Languages": (creator.languages || []).join(","),

  "Speaking Video Link": creator.speakingVideoLink || "",

  "Full Address": creator.fullAddress || "",

  "Landmark": creator.landmark || "",

  "City": creator.city || "",

  "State": creator.state || "",

  "Country": creator.country || "",

  "Pincode": creator.pincode || "",

  "Photo Link": creator.photoLink || "",

  "YouTube Username": creator.youtubeUsername || "",

  "YouTube Channel Link": creator.youtubeChannelLink || "",

  "YouTube Subscribers Range": creator.youtubeSubscribersRange || "",

  "Commercials For 1 Instagram Reel":
    creator.commercialsFor1InstagramReel || "",

  "Commercials For 1 Instagram Story":
    creator.commercialsFor1InstagramStory || "",

  "Commercials For 1 Instagram Post":
    creator.commercialsFor1InstagramPost || "",

  "Commercials For 1 Dedicated YouTube Video":
    creator.commercialsFor1DedicatedYouTubeVideo || "",

  "Commercials For 1 Integrated YouTube Video":
    creator.commercialsFor1IntegratedYouTubeVideo || "",

  "Commercials For 1 Dedicated YouTube Shorts Video":
    creator.commercialsFor1DedicatedYouTubeShortsVideo || "",

  "Commercials For 1 Integrated YouTube Shorts Video":
    creator.commercialsFor1IntegratedYouTubeShortsVideo || "",

  "Bio": creator.bio || "",

  "Are you a TV/movies/OTT celebrity":
    creator.areYouATvMoviesOttCelebrity || "",

  "Type of Celeb": creator.typeOfCeleb || "",

  "What all platforms are you avilable on":
    (creator.whatAllPlatformsAreYouAvailableOn || []).join(","),

  "How many Amazon reviews you do per month":
    creator.howManyAmazonReviewsYouDoPerMonth || "",

  "Fetched from Brand Page":
    creator.fetchedFromBrandPage || "",

  "Fetched For Brand":
    creator.fetchedForBrand || "",

  "Platform": creator.platform || "",

  "Fetched Date": creator.fetchedDate || "",

  "InflunexaUserId": creator.InflunexaUserId || "",
}));


    if (allCreators.length === 0) {
      alert("No filtered data available to download.");
      return;
    }

    const csv = Papa.unparse(formattedData, {
  header: true,
  skipEmptyLines: true,
});  



    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "Filtered_Creators.csv");

  } catch (error) {
    console.log(error);
    alert("Failed to download CSV");
  }
};



// =========================
// DOWNLOAD MASKED CSV
// =========================

const downloadMaskedCSV = async () => {
  try {

    const params = {};

    // Send all selected filters
    Object.entries(filters).forEach(([key, value]) => {

      if (Array.isArray(value)) {

        if (value.length > 0) {
          params[key] = value.join(",");
        }

      } else if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {

        params[key] = value;

      }

    });

    // Fetch all filtered records
    params.download = true;

    const res = await axios.get(
      `${Config.API_URL}/csv-creators`,
      {
        params,
      }
    );

    const allCreators = res.data.data;

    if (allCreators.length === 0) {
      alert("No filtered data available to download.");
      return;
    }

    const maskedCreators = allCreators.map((creator) => ({
      ...creator,

      email: creator.email
        ? creator.email.replace(/(.{2}).+(@.+)/, "$1****$2")
        : "",

      phoneNumber: creator.phoneNumber
        ? "******" + creator.phoneNumber.slice(-4)
        : "",

      whatsappNumber: creator.whatsappNumber
        ? "******" + creator.whatsappNumber.slice(-4)
        : "",

      fullAddress: creator.fullAddress
        ? "********"
        : "",

      pincode: creator.pincode
        ? "*****"
        : "",

      InflunexaUserId: creator.InflunexaUserId
        ? "******"
        : "",

    }));

    const csv = Papa.unparse(maskedCreators, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(blob, "filtered_masked_creators.csv");

  } catch (error) {

    console.log(error);
    alert("Failed to download masked CSV");

  }
};



const handleFilterChange = (e) => {
  const { name, value } = e.target;

  const updatedFilters = {
    ...filters,
    [name]: value,
  };

  setFilters(updatedFilters);

  const filtered = Object.values(updatedFilters).some(
    (v) => String(v).trim() !== ""
  );

  setIsFiltered(filtered);

  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }

  const timeout = setTimeout(() => {
    setPage(1);
    fetchCreators(updatedFilters);
  }, 500);

  setFilterTimeout(timeout);
};

// RESET FILTER
const resetFilters = () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }

  const emptyFilters = {
    fullName: "",
    email: "",
    phoneNumber: "",
    instagramUsername: "",
    instagramFollowersRange: [],
    exactFollowers: "",
    categories: [],
    gender: [],
    dateOfBirth: "",
    pincode: "",
    city: "",
    state: [],
    country: [],
    youtubeUsername: "",
    youtubeSubscribersRange: [],
    typeOfCeleb: [],
    platform: [],
    languages: [],
    InflunexaUserId: "",
    campaignType:[],
    influencerType: [],
    contactStatus: [],
  };

  setFilters(emptyFilters);
  setIsFiltered(false);
setPage(1);
  fetchCreators(emptyFilters);
};


const inputClass = `
  w-full
  h-14
  px-4
  bg-white
  border
  border-slate-300
  rounded-xl
  text-slate-700
  placeholder:text-slate-400
  outline-none
  transition
  focus:border-slate-500
  focus:ring-2
  focus:ring-slate-200
`;

const tableHeaderClass = `
  px-4
  py-4
  text-left
  text-xs
  font-bold
  tracking-wider
  uppercase
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
`;

const tableCellClass = `
  px-4
  py-5
  text-sm
  text-slate-700
  border-b
  border-slate-200
  whitespace-nowrap
  align-middle
`;

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    height: "44px",
    maxHeight: "44px",
    borderRadius: "12px",

    borderColor: state.isFocused
      ? "#cbd5e1"
      : "#e2e8f0",

    borderWidth: "1px",

    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(226, 232, 240, 0.6)"
      : "none",

    backgroundColor: "#ffffff",
    alignItems: "center",
    overflow: "hidden",

    "&:hover": {
      borderColor: "#cbd5e1",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    height: "44px",
    minHeight: "44px",
    maxHeight: "44px",
    padding: "2px 12px",

    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",

    overflowX: "auto",
    overflowY: "hidden",

    flex: "1 1 auto",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),

  placeholder: (base) => ({
    ...base,
    color: "#A3A3A3",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    
  }),

  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
    minWidth: "2px",
    width: "2px",
    height: "20px",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: "7px",
    margin: "2px 3px 2px 0",
    height: "30px",
    minWidth: "max-content",
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

    "&:hover": {
      backgroundColor: "#e2e8f0",
      color: "#334155",
    },
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "44px",

    display: "flex",
    alignItems: "center",

    flexShrink: 0,
    backgroundColor: "#ffffff",
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "6px",
    color: "#94a3b8",

    "&:hover": {
      color: "#64748b",
    },
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "8px",
    color: "#94a3b8",

    "&:hover": {
      color: "#64748b",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
};
  return (

<div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">

  {/* HEADER */}
  <div className="px-7 pt-7 pb-5">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          CSV Creators Data
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Find creators by name, email, Instagram, YouTube, category,
          location, platform, or status.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">

        <button
          onClick={resetFilters}
          className="
            h-11
            px-5
            rounded-xl
            border
            border-slate-300
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-50
            transition
          "
        >
          Reset Filters
        </button>

        {isFiltered && !loading && creators.length > 0 && (

          <div className="flex gap-3">

            <button
              onClick={downloadCSV}
              className="
                h-11
                px-5
                rounded-xl
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              Download CSV
            </button>

            <button
              onClick={downloadMaskedCSV}
              className="
                h-11
                px-5
                rounded-xl
                bg-slate-700
                hover:bg-slate-800
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              Download Masked CSV
            </button>

          </div>
        )}

      </div>

    </div>

  </div>
{/* =========================
CSV FILTER SECTION
========================= */}
<div className="px-7 pb-6">
 <div
    className="
    rounded-[22px]
    border
    border-slate-200
    bg-slate-50
    p-5
  "
>
  
    <div
      className="
  grid
    grid-cols-1
    gap-x-5
    gap-y-5
    sm:grid-cols-2
    lg:grid-cols-[1.5fr_1fr_1fr_1fr]
  "
    >
{
[
{
name:"fullName",
type:"text",
 label: "Full Name",
placeholder:"Full Name"
},

{
name:"email",
type:"text",
label: "Email",
placeholder:"Email"
},

{
name:"phoneNumber",
type:"text",
label:"Phone",
placeholder:"Phone"
},

// {
// name:"instagramUsername",
// type:"text",
// placeholder:"Instagram Username"
// },


{
name:"instagramFollowersRange",
type:"select",
label:"Followers Range",
placeholder:"Followers Range",
options:filterOptions.instagramFollowersRange
},

{
  name: "exactFollowers",
  type: "number",
  label:"Exact Followers",
  placeholder: "Exact Followers",
},
{
name:"categories",
type:"select",
placeholder:"Category",
label:"Category",
options:filterOptions.categories
},


{
name:"gender",
type:"select",
label:"Gender",
placeholder:"Gender",
options:filterOptions.gender,
},


{
  name: "dateOfBirth",
  type: "date",
  label:"Date of Birth",
  placeholder: "Date of Birth",
},


{
name:"city",
type:"text",
label:"City",
placeholder:"City"
},


{
name:"state",
type:"select",
placeholder:"State",
label:"State",
options:filterOptions.state
},


{
name:"country",
type:"select",
label:"Country",
placeholder:"Country",
options:filterOptions.country
},
{
  name: "pincode",
  type: "text",
  label:"Pincode",
  placeholder: "Pincode",
},

// {
// name:"youtubeUsername",
// type:"text",
// placeholder:"Youtube Username"
// },


{
name:"youtubeSubscribersRange",
type:"select",
label:"Youtube Subscribers",
placeholder:"Youtube Subscribers",
options:filterOptions.youtubeSubscribersRange
},


{
name:"platform",
type:"select",
label:"Platform",
placeholder:"Platform",
options:filterOptions.platform
},


{
name:"typeOfCeleb",
type:"select",
label:"Celebrity Type",
placeholder:"Celebrity Type",
options:filterOptions.typeOfCeleb

},


{
name:"languages",
type:"select",
label:"Language",
placeholder:"Language",
options:filterOptions.languages
},


{
  name: "InflunexaUserId",
  type: "text",
  label:"Influnexa User ID",
  placeholder: "Influnexa User ID",
},

{
  name: "campaignType",
  type: "select",
  label:"Campaign Type",
  placeholder: "Campaign Type",
  options: filterOptions.campaignType
},
{
  name: "influencerType",
  type: "select",
  label:"Influencer Type",
  placeholder: "Influencer Type",
  options: [
    "Nano Influencer",
    "Micro Influencer",
    "Macro Influencer",
    "Mega Influencer",
  ],
},

{
  name: "contactStatus",
  type: "select",
  label:"Contact Status",
  placeholder: "Contact Status",
  options: [
    "Mobile Only",
    "Email Only",
    "Both Email & Mobile",
  ]
},

].map((field) => (

  <div key={field.name}>

    <label className="mb-1 block text-[14px] font-bold text-slate-500 ">
      {field.label}
    </label>

    {field.type === "select" ? (

      <Select
    isMulti
    closeMenuOnSelect={false}
    placeholder={field.placeholder}
     styles={selectStyles}
      menuPortalTarget={document.body}
  menuPosition="fixed"
    options={
  field.name === "instagramFollowersRange"
    ? [
      { value: "Under 1K", label: "Under 1K" },
      { value: "1K - 10K", label: "1K - 10K" },
      { value: "10K - 50K", label: "10K - 50K" },
      { value: "50K - 100K", label: "50K - 100K" },
      { value: "100K - 500K", label: "100K - 500K" },
      { value: "500K - 1M", label: "500K - 1M" },
      { value: "1M - 5M", label: "1M - 5M" },
      { value: "5M+", label: "5M+" },
    ]
    : (field.options || []).map(option => ({
        value: option,
        label: option,
      }))
}
    value={
      (filters[field.name] || []).map((item) => ({
        value: item,
        label: item,
      }))
    }

    onChange={(selectedOptions) => {

      const values = selectedOptions
        ? selectedOptions.map(item => item.value)
        : [];

      const updatedFilters = {
        ...filters,
        [field.name]: values,
      };

      setFilters(updatedFilters);

      setIsFiltered(
        Object.values(updatedFilters).some((value) =>
          Array.isArray(value)
            ? value.length > 0
            : value !== ""
        )
      );

      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }

      const timeout = setTimeout(() => {
        fetchCreators(updatedFilters);
      }, 500);

      setFilterTimeout(timeout);
    }}
  />

) : (

  <input
    key={field.name}
    name={field.name}
    type={field.type}
    placeholder={field.placeholder}
    className="
  w-full
  h-11
  px-4
  bg-white
  border
  border-slate-200
  rounded-xl
  text-slate-700
  placeholder:text-neutral-400
  outline-none
  transition
  focus:border-slate-300
  focus:ring-2
  focus:ring-slate-100
  placeholder:text-[14px]
   placeholder:font-bold
"
    value={filters[field.name] || ""}

    onChange={(e) => {

      const value = e.target.value;

      const updatedFilters = {
        ...filters,
        [field.name]: value,
      };

      setFilters(updatedFilters);

      setIsFiltered(
        Object.values(updatedFilters).some((value) =>
          Array.isArray(value)
            ? value.length > 0
            : value !== ""
        )
      );

      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }

      const timeout = setTimeout(() => {
        fetchCreators(updatedFilters);
      }, 500);

      setFilterTimeout(timeout);
    }}
  />

)}
</div>
))}
</div>
</div>
</div>

<div className="px-7 mb-4">
  <div className="flex items-center justify-between">

    <div className="
      inline-flex
      items-center
      gap-3
      h-11
      px-5
      rounded-xl
      bg-slate-900
      text-white
      shadow-sm
    ">
      <span className="text-sm font-medium text-slate-300">
        {isFiltered ? "Filtered Records:" : "Total Records:"}
      </span>

      <span className="text-lg font-bold text-white">
        {totalRecords.toLocaleString()}
      </span>
    </div>

  </div>
</div>

{
loading ?
(
  <div className="
      flex
      flex-col
      items-center
      justify-center
      py-20
      rounded-[20px]
      border
      border-slate-200
      bg-white
    ">

      <div className="
        w-10
        h-10
        border-4
        border-slate-200
        border-t-slate-900
        rounded-full
        animate-spin
      " />

<p>
  
Loading CSV creators...
</p>
</div>
)


:


(

// TABLE

<div className="
  mx-7
  border
  border-slate-200
  rounded-[20px]
  bg-white
  overflow-hidden
  shadow-sm
">

   <div className="
    relative
    isolate
    w-full
    overflow-x-auto
    overflow-y-auto
    max-h-[650px]
  
  ">

    <table className="
      min-w-[3600px]
      w-max
      text-sm
      border-separate
      border-spacing-0
    ">

 <thead className="
        bg-slate-50
      
      ">


<tr>


<th  className="
    sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-r
    border-slate-200
    whitespace-nowrap
  ">
      S.No.
    </th>


<th
  className="
    sticky
    left-0
    top-0
    z-40
    w-[310px]
    min-w-[310px]
    max-w-[310px]
    px-4
    py-4
    text-left
    text-sm
    font-bold
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-r
    border-slate-200
    whitespace-nowrap
  "
>
  Full Name
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Instagram Username
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Instagram Link
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Followers Range
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Exact Followers
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Phone
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Whatsapp
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Email
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Categories
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Campaign Type
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Influencer Type
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Gender
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
DOB
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
  
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Languages
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
  
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Full Address
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Landmark
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
  
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
City
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
  
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
State
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Country
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Pincode
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Youtube Username
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Youtube Channel
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Youtube Subscribers
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Instagram Reel Price
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Photo Link
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Instagram Story Price
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Instagram Post Price
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Dedicated Youtube Video
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Integrated Youtube Video
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Dedicated Shorts
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Integrated Shorts
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Deal Type
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Speaking Video
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
TV/Movies Celebrity
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Available Platforms
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Celebrity Type
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Amazon Reviews
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Platform
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Fetched For Brand
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Fetched Date
</th>
<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Fetched From Brand
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Timestamp
</th>


<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Bio
</th>

<th  className="
sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
InflunexaUserId
</th>

 <th  className="
 sticky top-0 z-30
    px-4
    py-4
    text-left
    text-sm
    font-bold
    
    tracking-wider
    text-slate-500
    bg-slate-50
    border-b
    border-slate-200
    whitespace-nowrap
">
Action
</th>



</tr>

</thead>





<tbody>


{

creators.length===0 ?


(

<tr>

<td

colSpan={46}

className="
text-center
p-5
"

>

No CSV creators found

</td>

</tr>

)


:


creators.map((creator,index)=>(



<tr

key={creator._id}
 className="
    bg-white
    hover:bg-slate-50
    transition
"
>
 <td className="
    px-4
    py-5
    text-sm
    font-semibold
    text-slate-700
    bg-white
    border-b
    border-r
    border-slate-200
    whitespace-nowrap
    align-middle
  ">
    {(page - 1) * limit + index + 1}
  </td>

<td
  className="
    sticky
    left-0
    z-20
    w-[310px]
    min-w-[310px]
    max-w-[310px]
    px-4
    py-5
    text-sm
    text-slate-700
    bg-white
    border-b
    border-r
    border-slate-200
    whitespace-nowrap
    align-middle
  "
>
  {creator.fullName || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.instagramUsername || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
  text-blue-600
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
    hover:underline
">
  {creator.instagramProfileLink ? (
    <a
      href={
        creator.instagramProfileLink.startsWith("http")
          ? creator.instagramProfileLink
          : `https://${creator.instagramProfileLink}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="
  text-indigo-600
  font-semibold
  hover:underline
"
    >
      Instagram Profile link
    </a>
  ) : (
    "-"
  )}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.instagramFollowersRange || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.exactFollowers || "-"}
</td>
<td
  className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
  "
>
  {creator.phoneNumber ? (
    <div className="group flex items-center gap-2">
      <span>{creator.phoneNumber}</span>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(creator.phoneNumber);

          setCopiedPhone(creator._id);

          setTimeout(() => {
            setCopiedPhone(null);
          }, 1500);
        }}
        className="
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-200
          text-xs
          text-blue-600
          hover:text-blue-800
          font-medium
          cursor-pointer
        "
        title="Copy phone number"
      >
        {copiedPhone === creator._id ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    "-"
  )}
</td>

<td
  className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
  "
>
  {creator.whatsappNumber ? (
    <div className="group flex items-center gap-2">
      <span>{creator.whatsappNumber}</span>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(creator.whatsappNumber);

          setCopiedWhatsapp(creator._id);

          setTimeout(() => {
            setCopiedWhatsapp(null);
          }, 1500);
        }}
        className="
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-200
          text-xs
          text-blue-600
          hover:text-blue-800
          font-medium
          cursor-pointer
        "
        title="Copy WhatsApp number"
      >
        {copiedWhatsapp === creator._id ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    "-"
  )}
</td>
<td
  className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
  "
>
  {creator.email ? (
    <div className="group flex items-center gap-2">
      <span>{creator.email}</span>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(creator.email);

          setCopiedEmail(creator._id);

          setTimeout(() => {
            setCopiedEmail(null);
          }, 1500);
        }}
        className="
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-200
          text-xs
          text-blue-600
          hover:text-blue-800
          font-medium
          cursor-pointer
        "
        title="Copy email"
      >
        {copiedEmail === creator._id ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    "-"
  )}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.categories?.join(", ") || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.campaignType?.join(", ") || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.influencerType}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.gender || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.dateOfBirth || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.languages?.join(", ") || "-"}
</td>
<td className="
  px-4
  py-5
  text-sm
  text-slate-700
  border-b
  border-slate-200
  align-top
  w-[350px]
  max-w-[350px]
">
  <div className="
    max-w-[350px]
    whitespace-normal
    break-words
    leading-6
    line-clamp-3
    overflow-hidden
  ">
    {creator.fullAddress || "-"}
  </div>
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.landmark || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.city || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.state || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.country || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.pincode || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.youtubeUsername || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
  text-blue-600
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
    hover:underline
">
  {creator.youtubeChannelLink ? (
    <a
      href={
        creator.youtubeChannelLink.startsWith("http")
          ? creator.youtubeChannelLink
          : `https://${creator.youtubeChannelLink}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      YouTube Channel Link
    </a>
  ) : (
    "-"
  )}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.youtubeSubscribersRange || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1InstagramReel || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
  text-blue-600
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
    hover:underline
">
  {creator.photoLink ? (
    <a
      href={creator.photoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      View Photo
    </a>
  ) : (
    "-"
  )}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1InstagramStory || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1InstagramPost || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1DedicatedYouTubeVideo || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1IntegratedYouTubeVideo || "-"}
</td>
<td cclassName="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1DedicatedYouTubeShortsVideo || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.commercialsFor1IntegratedYouTubeShortsVideo || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.whatKindOfDealDoYouParticipateIn || "-"}
</td>



<td className="
    px-4
    py-5
    text-sm
  text-blue-600
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
    hover:underline
">
  {creator.speakingVideoLink ? (
    <a
      href={creator.speakingVideoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
    Speaking Video link
    </a>
  ) : (
    "-"
  )}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.areYouATvMoviesOttCelebrity || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.typeOfCeleb || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.whatAllPlatformsAreYouAvailableOn?.join(", ") || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.howManyAmazonReviewsYouDoPerMonth || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.platform || "-"}
</td>
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.fetchedForBrand || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.fetchedDate || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.fetchedFromBrandPage || "-"}
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.timestamp || "-"}
</td>
<td
  className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    align-top
    w-[350px]
    max-w-[350px]
  "
>
  <div className="max-w-[350px]">
    {creator.bio ? (
      <>
        <div
          className={`whitespace-normal break-words leading-6 ${
            expandedBios[creator._id]
              ? ""
              : "line-clamp-2 overflow-hidden"
          }`}
        >
          {creator.bio}
        </div>

        {creator.bio.length > 80 && (
          <button
            type="button"
            onClick={() =>
              setExpandedBios((prev) => ({
                ...prev,
                [creator._id]: !prev[creator._id],
              }))
            }
            className="mt-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
          >
            {expandedBios[creator._id] ? "See Less" : "See More"}
          </button>
        )}
      </>
    ) : (
      "-"
    )}
  </div>
</td>

<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  {creator.InflunexaUserId || "-"}
</td>


{/* Action */}
<td className="
    px-4
    py-5
    text-sm
    text-slate-700
    border-b
    border-slate-200
    whitespace-nowrap
    align-middle
">
  <div className="flex items-center justify-center gap-2">
    <button
    onClick={()=>handleEdit(creator)}
      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition"
      title="Edit"
    >
      <FaEdit />
    </button>

    
  </div>
</td>

</tr>


))


}



</tbody>


</table>


</div>
</div>
)}

<div className="
  flex
  items-center
  justify-center
  gap-3
  mt-6
  pb-2
">

  <button
    disabled={page <= 1}
    onClick={() => setPage(page - 1)}
    className="
      h-11
      px-5
      rounded-xl
      border
      border-slate-300
      bg-white
      text-sm
      font-semibold
      text-slate-600
      hover:bg-slate-50
      disabled:opacity-40
      disabled:cursor-not-allowed
      transition
    "
  >
    Previous
  </button>

  <div className="
    h-11
    px-5
    flex
    items-center
    justify-center
    rounded-xl
    bg-slate-900
    text-white
    text-sm
    font-semibold
    min-w-[120px]
  ">
    Page {page} of {totalPages}
  </div>

  <button
    disabled={creators.length === 0 || page >= totalPages}
    onClick={() => setPage(page + 1)}
    className="
      h-11
      px-5
      rounded-xl
      border
      border-slate-300
      bg-white
      text-sm
      font-semibold
      text-slate-600
      hover:bg-slate-50
      disabled:opacity-40
      disabled:cursor-not-allowed
      transition
    "
  >
    Next
  </button>

</div>

      {/* EDIT MODAL */}
   
    {showEdit && (
      <div className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-slate-900/50
    backdrop-blur-sm
    p-4
  ">

    <div className="
      bg-white
      w-full
      max-w-[700px]
      max-h-[90vh]
      overflow-y-auto
      rounded-[24px]
      shadow-2xl
      border
      border-slate-200
      p-7
    ">
          <h2 className="
  text-2xl
  font-bold
  text-slate-900
  mb-6
">
            Edit Creator
          </h2>
             
             <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
            Full Name:
          </label>
          <input
            className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-300
  bg-white
  text-slate-700
  outline-none
  focus:border-slate-500
  focus:ring-2
  focus:ring-slate-200
"
            value={selectedCreator?.fullName || ""}
            onChange={(e) =>
              setSelectedCreator({
                ...selectedCreator,
                fullName: e.target.value,
              })
            }
          />

         <div>
          <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
            Mobile Number:
          </label>
          <input
            type="text"
            className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-300
  bg-white
  text-slate-700
  outline-none
  focus:border-slate-500
  focus:ring-2
  focus:ring-slate-200
"
            value={selectedCreator?.phoneNumber || ""}
            onChange={(e) =>
              setSelectedCreator({
                ...selectedCreator,
                phoneNumber: e.target.value,
              })
            }
          />
        </div>

          {/* Email */}
        <div>
          <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
            Email:
          </label>
          <input
            type="email"
            className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-300
  bg-white
  text-slate-700
  outline-none
  focus:border-slate-500
  focus:ring-2
  focus:ring-slate-200
"
            value={selectedCreator?.email || ""}
            onChange={(e) =>
              setSelectedCreator({
                ...selectedCreator,
                email: e.target.value,
              })
            }
          />
        </div>


        {/* Instagram Username */}
        <div>
          <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
            Instagram Username:
          </label>
          <input
            type="text"
            className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-300
  bg-white
  text-slate-700
  outline-none
  focus:border-slate-500
  focus:ring-2
  focus:ring-slate-200
"
            value={selectedCreator?.instagramUsername || ""}
            onChange={(e) =>
              setSelectedCreator({
                ...selectedCreator,
                instagramUsername: e.target.value,
              })
            }
          />
        </div>

<div className="mt-4">
  <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
    Updated By:
  </label>

  <input
    type="text"
    value={adminEmail}
    readOnly
    className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-200
  bg-slate-100
  text-slate-500
  cursor-not-allowed
"
  />
</div>

<div className="mt-4">
  <label className="
  block
  text-xs
  font-bold
  uppercase
  tracking-wide
  text-slate-500
  mb-2
">
    Edited Manually
  </label>

  <input
    type="text"
    value={selectedCreator?.editStatus ||"Not Edited"}
    className="
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-200
  bg-slate-100
  text-slate-500
"
  />
</div>
          <div className="
  flex
  justify-end
  gap-3
  mt-7
  pt-5
  border-t
  border-slate-200
">
            <button
              onClick={() => setShowEdit(false)}
               className="
    h-11
    px-6
    rounded-xl
    border
    border-slate-300
    bg-white
    text-slate-600
    font-semibold
    hover:bg-slate-50
    transition
  "
            >
              Cancel
            </button>

            <button
            onClick={updateCsvCreator}
                className="
    h-11
    px-7
    rounded-xl
    bg-slate-900
    hover:bg-slate-800
    text-white
    font-semibold
    transition
    shadow-sm
  "
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}

  


</div>

);
}

export default CsvCreatorSection;