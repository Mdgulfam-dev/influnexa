import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
  getAssignedCreators,
  getBrandTickets,
  saveAssignedCreatorDetails,
  deleteAssignedTicketCreator,
} from "../lib/api";
import { FcSearch } from "react-icons/fc";




const AssignedTicketCreators = () => {
const adminRole = (
  sessionStorage.getItem("adminRole") || ""
).trim().toLowerCase();

const isBrandRole = adminRole === "brand"

 const currentUserRole = (
  sessionStorage.getItem("adminRole") || ""
).trim().toLowerCase();
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteStatus, setDeleteStatus] = useState("Pending");
const [deleteCreatorId, setDeleteCreatorId] = useState("");
const [deletingCreator, setDeletingCreator] = useState(false);  
const [creatorActions, setCreatorActions] = useState({});
const [creatorCommercials, setCreatorCommercials] = useState({});
const [creatorQuoteCommercials, setCreatorQuoteCommercials] = useState({});
const [creatorReadyStatus, setCreatorReadyStatus] = useState({});


  const [ticket, setTicket] = useState(null);
  const [assignedCreators, setAssignedCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatorSearch, setCreatorSearch] = useState("");
  const [expandedCells, setExpandedCells] = useState({});
  const [selectedCreatorIds, setSelectedCreatorIds] = useState([]);

  const ticketId = new URLSearchParams(
    window.location.search
  ).get("ticket");

  useEffect(() => {
    loadData();
  }, [ticketId]);


useEffect(() => {
  if (!isBrandRole || !ticketId) return;

  let isMounted = true;
  let isFetching = false;

  const refreshCreatorDetails = async () => {
    if (isFetching) return;
    isFetching = true;

    try {
      const latestCreators = await getAssignedCreators(ticketId);

      if (!isMounted || !Array.isArray(latestCreators)) return;

      // Refresh Quote Commercial
      setCreatorQuoteCommercials((prev) => {
        const updated = { ...prev };

        latestCreators.forEach((creator) => {
          const id = String(creator._id);
          updated[id] = creator.quoteCommercial ?? "";
        });

        return updated;
      });

      // Refresh Status displayed in the table
setCreatorActions((prev) => {
  const updated = { ...prev };

  latestCreators.forEach((creator) => {
    const id = String(creator._id);

    updated[id] =
      creator.assignedStatus ??
      creator.status ??
      "Pending";
  });

  return updated;
});
    } catch (error) {
      console.error("Failed to refresh creator details:", error);
    } finally {
      isFetching = false;
    }
  };

  refreshCreatorDetails();

  const intervalId = setInterval(refreshCreatorDetails,2000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, [isBrandRole, ticketId]);


 const initialCreatorFilters = {
  instagramFollowersRange: [],
  youtubeSubscribersRange: [],
  categories: [],
  influencerType: [],
  gender: [],
  languages: [],
  age: [],
  state: [],
  city: [],
};

const [creatorFilters, setCreatorFilters] = useState(
  initialCreatorFilters
);

const updateCreatorFilter = (name, selectedOptions) => {
  setCreatorFilters((prev) => ({
    ...prev,
    [name]: (selectedOptions || []).map((option) => option.value),
  }));
};

const resetCreatorFilters = () => {
  setCreatorFilters(initialCreatorFilters);
};



const loadData = async () => {
  try {
    setLoading(true);

    if (!ticketId) {
      throw new Error("Brand ticket ID is missing.");
    }

    const [tickets, creators] = await Promise.all([
      getBrandTickets(),
      getAssignedCreators(ticketId),
    ]);

    const currentTicket = tickets.find(
      (item) => String(item._id) === String(ticketId)
    );

    setTicket(currentTicket || null);

    // Support either an array or the API response object.
    const creatorList = Array.isArray(creators)
      ? creators
      : creators?.assignment?.creatorIds || [];

    setAssignedCreators(creatorList);

    const actionMap = {};
    const commercialMap = {};
    const quoteCommercialMap = {};
    const readyMap = {};

    creatorList.forEach((creator) => {
      const id = String(creator._id);

     actionMap[id] =
  creator.assignedStatus ||
  creator.status ||
  "Pending";
      commercialMap[id] = creator.commercial || "";
      readyMap[id] = creator.readyToCampaign || "";
      quoteCommercialMap[id] = creator.quoteCommercial || "";
    });

    setCreatorActions(actionMap);
    setCreatorCommercials(commercialMap);
    setCreatorQuoteCommercials(quoteCommercialMap);
    setCreatorReadyStatus(readyMap);
  } catch (error) {
    console.error("GET ASSIGNED CREATORS ERROR:", error);

    alert(
      error.message || "Failed to load assigned creators."
    );
  } finally {
    setLoading(false);
  }
};




  const getInstagramFollowersRange = (followers) => {
  if (
    followers === null ||
    followers === undefined ||
    followers === "" ||
    Number(followers) <= 0
  ) {
    return "";
  }

  followers = Number(followers);

  if (followers < 1000) return "Under 1K";
  if (followers < 10000) return "1K - 10K";
  if (followers < 50000) return "10K - 50K";
  if (followers < 100000) return "50K - 100K";
  if (followers < 500000) return "100K - 500K";
  if (followers < 1000000) return "500K - 1M";
  if (followers < 5000000) return "1M - 5M";

  return "5M+";
};






const normalizeYoutubeSubscribersRange = (value) => {
  if (!value) return "";

  const text = String(value).trim().toUpperCase();

  const convertToNumber = (val) => {
    val = val.replace(/,/g, "").trim();

    if (val.endsWith("K")) {
      return parseFloat(val.replace("K", "")) * 1000;
    }

    if (val.endsWith("M")) {
      return parseFloat(val.replace("M", "")) * 1000000;
    }

    return parseFloat(val);
  };

  // Handle ranges like:
  // 10K - 50K
  // 10.6K - 50K
  // 50K-100K
  if (text.includes("-")) {
    const [minValue] = text.split("-");

    const min = convertToNumber(minValue);

    if (isNaN(min)) return "";

    if (min < 1000) return "Under 1K";
    if (min < 10000) return "1K - 10K";
    if (min < 50000) return "10K - 50K";
    if (min < 100000) return "50K - 100K";

    return "100K+";
  }

  // Handle:
  // 100K+
  // 500K+
  // 1M+
  if (text.includes("+")) {
    const numberPart = text.replace("+", "").trim();
    const number = convertToNumber(numberPart);

    if (isNaN(number)) return "";

    if (number < 1000) return "Under 1K";
    if (number < 10000) return "1K - 10K";
    if (number < 50000) return "10K - 50K";
    if (number < 100000) return "50K - 100K";

    return "100K+";
  }

  // Handle:
  // 103
  // 999
  // 1K
  // 10.6K
  // 50K
  // 100K
  // 1M
  const number = convertToNumber(text);

  if (isNaN(number)) return "";

  if (number < 1000) return "Under 1K";
  if (number < 10000) return "1K - 10K";
  if (number < 50000) return "10K - 50K";
  if (number < 100000) return "50K - 100K";

  return "100K+";
};



const getFilterValues = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim().toLowerCase());
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};


const getCreatorAgeRange = (dateOfBirth) => {
  if (!dateOfBirth) return "";

  const value = String(dateOfBirth).trim();
  let day, month, year;

  // YYYY-MM-DD or YYYY/MM/DD
  let match = value.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
  );

  if (match) {
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else {
    // DD/MM/YY, DD/MM/YYYY, DD-MM-YY, DD-MM-YYYY
    match = value.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/
    );

    if (!match) return "";

    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);

    if (year < 100) {
      year += year <= 29 ? 2000 : 1900;
    }
  }

  // Validate the date
  const dob = new Date(year, month - 1, day);

  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return "";
  }

  const today = new Date();

  let age = today.getFullYear() - year;

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() < dob.getDate())
  ) {
    age--;
  }

  if (age < 0) return "";
  if (age < 18) return "Under 18";
  if (age <= 24) return "18 - 24";
  if (age <= 34) return "25 - 34";
  if (age <= 44) return "35 - 44";
  if (age <= 54) return "45 - 54";

  return "55+";
};

const getCreatorFilterOptions = (field, fallback = null) => {
  const values = assignedCreators.flatMap((creator) => {
    const value = fallback
      ? fallback(creator)
      : creator[field];

    return Array.isArray(value) ? value : [value];
  });

  return [...new Set(
    values
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => String(value).trim())
      .filter(Boolean)
  )]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: value,
    }));
};

const creatorFilterSelectStyles = {
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

    // IMPORTANT
    overflow: "hidden",

    "&:hover": {
      borderColor: "#cbd5e1",
    },
  }),

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

    // IMPORTANT
    minWidth: 0,
    maxWidth: "100%",

    overflowX: "auto",
    overflowY: "hidden",

    flex: "1 1 0%",

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
    fontWeight: 550,

    whiteSpace: "nowrap",

    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  input: (base) => ({
    ...base,

    margin: "0",
    padding: "0",

    minWidth: "2px",
    width: "2px",

    height: "20px",

    flexShrink: 0,
  }),

  multiValue: (base) => ({
    ...base,

    backgroundColor: "#f1f5f9",

    borderRadius: "7px",

    margin: "2px 3px 2px 0",

    height: "30px",

    // IMPORTANT
    width: "max-content",
    minWidth: "max-content",
    maxWidth: "none",

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

  // DROPDOWN OPTIONS
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

    // IMPORTANT:
    // Options become vertically scrollable
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

  menuPortal: (base) => ({
    ...base,

    zIndex: 99999,
  }),
};

/* =========================================================
   CREATOR ACTION / COMMERCIAL / READY TO CAMPAIGN
========================================================= */
const handleCreatorAction = async (creatorId, value) => {
  const id = String(creatorId);
  const previousValue = creatorActions[id] || "";

  setCreatorActions((prev) => ({
    ...prev,
    [id]: value,
  }));

  try {
    await saveAssignedCreatorDetails(ticketId, creatorId, {
      status: value,
    });
  } catch (error) {
    setCreatorActions((prev) => ({
      ...prev,
      [id]: previousValue,
    }));

    console.error("Failed to save creator status:", error);
    alert(error.message || "Failed to save creator status.");
  }
};



const handleCreatorQuoteCommercial = async (creatorId, value) => {
  setCreatorQuoteCommercials((prev) => ({
    ...prev,
    [creatorId]: value,
  }));

  try {
    await saveAssignedCreatorDetails(ticketId, creatorId, {
      quoteCommercial: value,
    });
    
  } catch (error) {
    console.error("Failed to save quote commercial:", error);
  }
};

const handleCreatorCommercial = async (creatorId, value) => {
  const id = String(creatorId);
  const previousValue = creatorCommercials[id] || "";

  setCreatorCommercials((prev) => ({
    ...prev,
    [id]: value,
  }));

  try {
    await saveAssignedCreatorDetails(ticketId, creatorId, {
      commercial: value,
    });
    
    
  } catch (error) {
    setCreatorCommercials((prev) => ({
      ...prev,
      [id]: previousValue,
    }));

    console.error("Failed to save commercial:", error);
    alert(error.message || "Failed to save commercial.");
  }
};

const handleReadyToCampaign = async (creatorId, value) => {
  const id = String(creatorId);
  const previousValue = creatorReadyStatus[id] || "";

  setCreatorReadyStatus((prev) => ({
    ...prev,
    [id]: value,
  }));

  try {
    await saveAssignedCreatorDetails(ticketId, creatorId, {
      readyToCampaign: value,
    });
  } catch (error) {
    setCreatorReadyStatus((prev) => ({
      ...prev,
      [id]: previousValue,
    }));

    console.error("Failed to save campaign readiness:", error);
    alert(error.message || "Failed to save campaign readiness.");
  }
};



const handleDeleteAssignedCreator = async () => {
  if (!ticketId) {
    alert("Brand ticket ID is missing.");
    return;
  }

  // Find ALL creators matching the selected status
  const creatorsToDelete = assignedCreators.filter((item) => {
    const currentStatus =
      creatorActions[String(item._id)] ||
      item.assignedStatus ||
      item.status ||
      "Pending";

    return (
      currentStatus === deleteStatus &&
      currentStatus !== "Approved"
    );
  });

  if (creatorsToDelete.length === 0) {
    alert(`No creators found with status "${deleteStatus}".`);
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to remove all ${creatorsToDelete.length} creators with status "${deleteStatus}" from this brand ticket?`
  );

  if (!confirmed) return;

  try {
    setDeletingCreator(true);

    // Delete all matching creators using your existing API
    for (const creator of creatorsToDelete) {
      await deleteAssignedTicketCreator(ticketId, creator._id);
    }

    const deletedIds = new Set(
      creatorsToDelete.map((creator) => String(creator._id))
    );

    // Update the table
    setAssignedCreators((prev) =>
      prev.filter((item) => !deletedIds.has(String(item._id)))
    );

    // Clear selections for deleted creators
    setSelectedCreatorIds((prev) =>
      prev.filter((id) => !deletedIds.has(String(id)))
    );

    setCreatorActions((prev) => {
      const updated = { ...prev };
      deletedIds.forEach((id) => delete updated[id]);
      return updated;
    });

    setCreatorCommercials((prev) => {
      const updated = { ...prev };
      deletedIds.forEach((id) => delete updated[id]);
      return updated;
    });

    setCreatorReadyStatus((prev) => {
      const updated = { ...prev };
      deletedIds.forEach((id) => delete updated[id]);
      return updated;
    });

    setShowDeleteModal(false);

    alert(
      `${creatorsToDelete.length} creator(s) removed from this brand ticket.`
    );
  } catch (error) {
    console.error("Delete assigned creators error:", error);
    alert(
      error.message ||
      "Failed to delete all matching creators. Please refresh and check the remaining creators."
    );
  } finally {
    setDeletingCreator(false);
  }
};

  /* =========================================================
     SEE MORE / SEE LESS
  ========================================================= */

  const toggleCell = (creatorId, field) => {
    const key = `${creatorId}-${field}`;

    setExpandedCells((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


  const brandVisibleHeaders = [
  "SL.No.",
  "Full Name",
  "Instagram Username",
  "Instagram Profile Link",
  "Instagram Follower Range",
  "Exact Followers",
  "Categories",
  "Influencer Type",
  "Gender",
  "Date of Birth",
  "Languages",
  "State",
  "Country",
  "Youtube Username",
  "Youtube Channel Link",
  "Youtube Subscribers Range",
  "Platform",
  "Quote Commercial",
  "Status",
  "Action",
];

  const renderLongText = (
    creator,
    field,
    value,
    limit = 35
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const text = Array.isArray(value)
      ? value.join(", ")
      : String(value);

    if (text.length <= limit) {
      return text;
    }

    const key = `${creator._id}-${field}`;
    const expanded = expandedCells[key];



    return (
      <div className="max-w-[18.75vw] leading-[1.6]">
        <span
          className={
            expanded
              ? "whitespace-normal break-words"
              : "break-words"
          }
        >
          {expanded
            ? text
            : `${text.slice(0, limit)}...`}
        </span>

        <button
          type="button"
          onClick={() =>
            toggleCell(creator._id, field)
          }
          className="
            ml-[0.5vw]
            text-blue-500
            font-semibold
            hover:text-blue-400
            cursor-pointer
            whitespace-nowrap
            transition-colors
          "
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </div>
    );
  };

  /* =========================================================
     CLICKABLE LINK
  ========================================================= */

  const renderLink = (
    creator,
    field,
    value,
    limit = 35
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const url = String(value).trim();

    const href = /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;

    if (url.length <= limit) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            text-blue-600
            hover:text-blue-700
            hover:underline
            cursor-pointer
            break-all
          "
        >
          {url}
        </a>
      );
    }

    const key = `${creator._id}-${field}`;
    const expanded = expandedCells[key];

    return (
      <div className="max-w-[18.75vw] leading-[1.6]">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            text-blue-600
            hover:text-blue-700
            hover:underline
            cursor-pointer
            break-all
          "
        >
          {expanded
            ? url
            : `${url.slice(0, limit)}...`}
        </a>

        <button
          type="button"
          onClick={() =>
            toggleCell(creator._id, field)
          }
          className="
            ml-[0.5vw]
            text-blue-600
            font-semibold
            hover:text-blue-700
            hover:underline
            cursor-pointer
            whitespace-nowrap
            transition-colors
          "
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </div>
    );
  };

  /* =========================================================
     SEARCH
  ========================================================= */
const filteredCreators = useMemo(() => {
  const search = creatorSearch.trim().toLowerCase();

  return assignedCreators.filter((creator) => {
    // EXISTING SEARCH
    const matchesSearch =
      !search ||
      [
        creator.fullName,
        creator.instagramUsername,
        creator.instagramProfileLink,
        creator.email,
        creator.phoneNumber,
        creator.whatsappNumber,
        creator.categories,
        creator.campaignType,
        creator.influencerType,
        creator.gender,
        creator.languages,
        creator.fullAddress,
        creator.city,
        creator.state,
        creator.country,
        creator.youtubeUsername,
        creator.youtubeChannelLink,
        creator.bio,
        creator.InflunexaUserId,
        creator.influnexaUserId,
      ]
        .filter(Boolean)
        .some((value) =>
          (Array.isArray(value) ? value.join(", ") : String(value))
            .toLowerCase()
            .includes(search)
        );

    if (!matchesSearch) return false;

    const matchesMultiFilter = (selected, values) => {
      if (!selected.length) return true;

      const actualValues = getFilterValues(values);

      return selected.some((value) =>
        actualValues.includes(String(value).toLowerCase())
      );
    };

    // INSTAGRAM FOLLOWER RANGE
    const instagramRange =
      creator.instagramFollowerRange ||
      getInstagramFollowersRange(creator.exactFollowers);

    if (
      !matchesMultiFilter(
        creatorFilters.instagramFollowersRange,
        instagramRange
      )
    ) return false;

    // YOUTUBE SUBSCRIBER RANGE
    const youtubeRange =
      creator.youtubeSubscribersRange ||
      normalizeYoutubeSubscribersRange(creator.youtubeSubscribers);

    if (
      !matchesMultiFilter(
        creatorFilters.youtubeSubscribersRange,
        youtubeRange
      )
    ) return false;

    // CATEGORY
    if (
      !matchesMultiFilter(
        creatorFilters.categories,
        creator.categories
      )
    ) return false;

    // INFLUENCER TYPE
    if (
      !matchesMultiFilter(
        creatorFilters.influencerType,
        creator.influencerType
      )
    ) return false;

    // GENDER
    if (
      !matchesMultiFilter(
        creatorFilters.gender,
        creator.gender
      )
    ) return false;

    // LANGUAGE
    if (
      !matchesMultiFilter(
        creatorFilters.languages,
        creator.languages
      )
    ) return false;

    // AGE
    if (
      !matchesMultiFilter(
        creatorFilters.age,
        getCreatorAgeRange(creator.dateOfBirth)
      )
    ) return false;

    // STATE
    if (
      !matchesMultiFilter(
        creatorFilters.state,
        creator.state
      )
    ) return false;

    // CITY
    if (
      !matchesMultiFilter(
        creatorFilters.city,
        creator.city
      )
    ) return false;

    return true;
  });
}, [assignedCreators, creatorSearch, creatorFilters]);
  /* =========================================================
     CREATOR SELECTION
  ========================================================= */

  const toggleCreatorSelection = (creatorId) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredCreators.map(
      (creator) => creator._id
    );

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) =>
        selectedCreatorIds.includes(id)
      );

    if (allSelected) {
      setSelectedCreatorIds((prev) =>
        prev.filter(
          (id) => !filteredIds.includes(id)
        )
      );
    } else {
      setSelectedCreatorIds((prev) => [
        ...new Set([
          ...prev,
          ...filteredIds,
        ]),
      ]);
    }
  };

  /* =========================================================
     DOWNLOAD ALL ASSIGNED CREATORS CSV
  ========================================================= */

  const downloadCSV = () => {
    if (!filteredCreators.length) {
      alert("No creators available to download.");
      return;
    }

    // If creators are selected, download only selected creators.
    // If nothing is selected, existing filtered download behavior remains.
    const creatorsToDownload =
      selectedCreatorIds.length > 0
        ? assignedCreators.filter((creator) =>
            selectedCreatorIds.includes(
              creator._id
            )
          )
        : filteredCreators;

    if (!creatorsToDownload.length) {
      alert(
        "No selected creators available to download."
      );
      return;
    }

    const headers = isBrandRole
  ? [
      "SL.No.",
      "Full Name",
      "Instagram Username",
      "Instagram Profile Link",
      "Instagram Follower Range",
      "Exact Followers",
      "Categories",
      "Influencer Type",
      "Gender",
      "Date of Birth",
      "Languages",
      "State",
      "Country",
      "Youtube Username",
      "Youtube Channel Link",
      "Youtube Subscribers Range",
      "Platform",
      "Quote Commercial",
      "Status",
      "Action",
    ]
  : [
      "SL.No.",
      "Full Name",
      "Instagram Username",
      "Instagram Profile Link",
      "Instagram Follower Range",
      "Exact Followers",
      "Phone Number",
      "Whatsapp Number",
      "Email",
      "Categories",
      "Campaign Type",
      "Influencer Type",
      "Gender",
      "Date of Birth",
      "Languages",
      "Full Address",
      "Landmark",
      "City",
      "State",
      "Country",
      "Pincode",
      "Youtube Username",
      "Youtube Channel Link",
      "Youtube Subscribers Range",
      "Commercials For 1 Instagram Reel",
      "Photo Link",
      "Commercials For 1 Instagram Story",
      "Commercials For 1 Instagram Post",
      "Commercials For 1 Dedicated YouTube Video",
      "Commercials For 1 Integrated YouTube Video",
      "Commercials For 1 Dedicated YouTube Shorts Video",
      "Commercials For 1 Integrated YouTube Shorts Video",
      "What Kind Of Deal Do You Participate In",
      "Speaking Video Link",
      "Are you a TV/movies/OTT celebrity",
      "What all platforms are you avilable on",
      "Type Of Celebrity",
      "How many Amazon reviews you do per month",
      "Platform",
      "Commercial",
"Quote Commercial",
"Ready to Campaign",
      "Status",
      "Bio",
      "InflunexaUserId",
    ];

    const escapeCSV = (value) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "";
      }

      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      const text = String(value);

      return `"${text.replace(/"/g, '""')}"`;
    };

    // DOWNLOAD ONLY CURRENTLY SELECTED OR FILTERED CREATORS
const rows = creatorsToDownload.map((creator, index) => {
  const platform =
    creator.platform ||
    (() => {
      const hasInstagram = Boolean(
        creator.instagramProfileLink?.trim()
      );
      const hasYoutube = Boolean(
        creator.youtubeChannelLink?.trim()
      );

      if (hasInstagram && hasYoutube) return "Instagram, YouTube";
      if (hasInstagram) return "Instagram";
      if (hasYoutube) return "YouTube";

      return "-";
    })();

  const status =
    creatorActions[String(creator._id)] ||
    creator.assignedStatus ||
    creator.status ||
    "Pending";

  if (isBrandRole) {
    return [
      index + 1,
      creator.fullName,
      creator.instagramUsername,
      creator.instagramProfileLink,
      creator.instagramFollowerRange ||
        getInstagramFollowersRange(creator.exactFollowers),
      creator.exactFollowers,
      creator.categories,
      creator.influencerType,
      creator.gender,
      creator.dateOfBirth,
      creator.languages,
      creator.state,
      creator.country,
      creator.youtubeUsername,
      creator.youtubeChannelLink,
      creator.youtubeSubscribersRange ||
        normalizeYoutubeSubscribersRange(creator.youtubeSubscribers),
      platform,
      creatorCommercials[String(creator._id)] ?? creator.commercial ?? "",
      status,
      status,
    ]
      .map(escapeCSV)
      .join(",");
  }

  return [
    index + 1,
    creator.fullName,
    creator.instagramUsername,
    creator.instagramProfileLink,
    creator.instagramFollowerRange ||
      getInstagramFollowersRange(creator.exactFollowers),
    creator.exactFollowers,
    creator.phoneNumber,
    creator.whatsappNumber,
    creator.email,
    creator.categories,
    creator.campaignType,
    creator.influencerType,
    creator.gender,
    creator.dateOfBirth,
    creator.languages,
    creator.fullAddress,
    creator.landmark,
    creator.city,
    creator.state,
    creator.country,
    creator.pincode,
    creator.youtubeUsername,
    creator.youtubeChannelLink,
    creator.youtubeSubscribersRange ||
      normalizeYoutubeSubscribersRange(creator.youtubeSubscribers),
    creator.commercialsFor1InstagramReel,
    creator.photoLink,
    creator.commercialsFor1InstagramStory,
    creator.commercialsFor1InstagramPost,
    creator.commercialsFor1DedicatedYoutubeVideo,
    creator.commercialsFor1IntegratedYoutubeVideo,
    creator.commercialsFor1DedicatedYoutubeShortsVideo,
    creator.commercialsFor1IntegratedYoutubeShortsVideo,
    creator.whatKindOfDealDoYouParticipateIn,
    creator.speakingVideoLink,
    creator.isCelebrity !== undefined
      ? creator.isCelebrity
        ? "Yes"
        : "No"
      : "",
    creator.availablePlatforms,
    creator.typeOfCelebrity,
    creator.amazonReviewsPerMonth,
    platform,
    // Commercial
creatorCommercials[String(creator._id)] ??
  creator.commercial ??
  "",

// Quote Commercial
creatorQuoteCommercials[String(creator._id)] ??
  creator.quoteCommercial ??
  "",
creatorReadyStatus[creator._id] || "",
creatorActions[creator._id],
    creator.bio,
    creator.InflunexaUserId || creator.influnexaUserId,
  ]
    .map(escapeCSV)
    .join(",");
});

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const ticketName = (
      ticket?.ticketNumber ||
      ticket?.brandName ||
      "assigned-creators"
    )
      .toString()
      .replace(/[^a-z0-9-_]+/gi, "-");

    const link = document.createElement("a");

    link.href = url;

    link.download = `${ticketName}-assigned-creators.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };




  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-page">
        <div
          className="
            admin-panel
            mx-[1.75vw]
            mt-[1.25vw]
          "
        >
          <div
            className="
              flex
              items-center
              gap-[0.75vw]
              text-slate-600
            "
          >
            <div
              className="
                w-[1.25vw]
                h-[1.25vw]
                min-w-[18px]
                min-h-[18px]
                rounded-full
                border-[0.15vw]
                border-slate-200
                border-t-emerald-600
                animate-spin
              "
            />

            <span className="font-medium text-[0.9vw]">
              Loading assigned creators...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     TICKET NOT FOUND
  ========================================================= */

  if (!ticket) {
    return (
      <div className="admin-page">
        <div
          className="
            admin-panel
            mx-[1.75vw]
            mt-[1.25vw]
          "
        >
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin#tickets")
            }
            className="
              mb-[1.25vw]
              inline-flex
              items-center
              gap-[0.5vw]
              px-[1vw]
              py-[0.65vw]
              rounded-[0.75vw]
              bg-slate-900
              text-white
              text-[0.85vw]
              font-semibold
              hover:bg-slate-800
              transition-colors
              cursor-pointer
            "
          >
            ← Back to Tickets
          </button>

          <h2
            className="
              text-[1.25vw]
              font-bold
              text-slate-900
            "
          >
            Brand ticket not found.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        admin-page
        w-full
        min-h-screen
        pt-[1.5vw]
        pb-[2vw]
        overflow-visible
      "
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
        p-3
          mx-[1.75vw]
          mt-[1.25vw]
          mb-[1.25vw]
          bg-white
          border
          border-slate-200
          rounded-[1.5vw]
          shadow-sm
        "
      >
        {/* ===================================================
            HEADER TOP
        =================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-[1.5vw]
            flex-wrap
          "
        >
          {/* LEFT */}

          <div className="min-w-0">
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/admin#tickets")
              }
              className="
                mb-[1vw]
                inline-flex
                items-center
                gap-[0.45vw]
                text-[0.85vw]
                font-semibold
                text-slate-500
                hover:text-emerald-600
                transition-colors
                cursor-pointer
              "
            >
              ← Back to Tickets
            </button>

            <div
              className="
                text-[0.7vw]
                font-bold
                tracking-[0.18em]
                text-emerald-600
              "
            >
              ASSIGNED CREATORS
            </div>

            <h1
              className="
                mt-[0.5vw]
                text-[1.75vw]
                font-bold
                text-slate-900
                break-words
                leading-tight
              "
            >
              {ticket.ticketNumber} ·{" "}
              {ticket.brandName}
            </h1>

            <p
              className="
                mt-[0.35vw]
                text-[0.95vw]
                text-slate-500
                break-words
              "
            >
              {ticket.campaignName}
            </p>
          </div>

          {/* RIGHT — COUNT + DOWNLOAD */}

          <div
            className="
              shrink-0
              flex
              items-center
              gap-[0.75vw]
            "
          >
            {/* COUNT */}

           
{/* RESPONSIVE ASSIGNED CREATORS + ACTIONS */}
<div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">

  {/* ASSIGNED CREATORS */}
  <div
   className="
  col-span-2 flex w-full min-w-0 items-center justify-between gap-2
  rounded-xl border border-emerald-100 bg-emerald-50
  px-18 py-3 
  sm:col-span-1 sm:w-auto sm:min-w-[200px] sm:justify-start sm:gap-3 sm:px-4
"
  >
    <span
      className="
        min-w-0 text-xs font-semibold text-emerald-700
        whitespace-normal leading-tight
        sm:whitespace-nowrap sm:text-sm
      "
    >
      ASSIGNED CREATORS
    </span>

    <strong className="shrink-0 text-lg font-bold text-slate-900 sm:text-xl">
      {assignedCreators.length.toLocaleString()}
    </strong>
  </div>

  {/* DOWNLOAD CSV */}
  {currentUserRole !== "creator" && (
    <button
      type="button"
      onClick={downloadCSV}
      disabled={!assignedCreators.length}
      className="
        flex min-h-11 w-full min-w-0 items-center justify-center
        rounded-xl bg-emerald-600 px-3 py-3
        text-center text-sm font-semibold leading-snug text-white
        transition-colors hover:bg-emerald-700
        disabled:cursor-not-allowed disabled:bg-slate-300
        cursor-pointer
        sm:w-auto sm:min-w-[150px] sm:px-5
      "
    >
      <span className="break-words">
        {selectedCreatorIds.length > 0
          ? `Download Selected (${selectedCreatorIds.length})`
          : "Download CSV"}
      </span>
    </button>
  )}

  {/* DELETE CREATOR */}
  <button
    type="button"
    onClick={() => {
      setDeleteStatus("Pending");
      setDeleteCreatorId("");
      setShowDeleteModal(true);
    }}
    disabled={
      !assignedCreators.some((creator) => {
        const status =
          creatorActions[String(creator._id)] ||
          creator.assignedStatus ||
          creator.status ||
          "Pending";

        return status !== "Approved";
      })
    }
    className="
  flex min-h-11 w-full min-w-0 items-center justify-center
  rounded-xl bg-red-600 px-2 py-3
  text-center text-xs font-semibold leading-snug text-white
  transition-colors hover:bg-red-700
  disabled:cursor-not-allowed disabled:bg-slate-300
  cursor-pointer
  sm:w-auto sm:min-w-[150px] sm:px-5 sm:text-sm
"
  >
    Delete Creator
  </button>

</div>
</div>
        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mt-[1.5vw]">
          <div
            className="
              relative
              w-full
            "
          >
            <span
              className="
                absolute
                left-[1vw]
                top-1/2
                -translate-y-1/2
                text-[1vw]
                text-slate-400
                pointer-events-none
              "
            >
              <FcSearch />
            </span>

            <input
              type="text"
              value={creatorSearch}
              onChange={(e) =>
                setCreatorSearch(e.target.value)
              }
              placeholder="Search Creator By Name, Email, Instagram..."
              className="
                w-full
                h-[3vw]
                min-h-[42px]
                max-h-[52px]
                pl-[2.75vw]
                pr-[1vw]
                rounded-[0.8vw]
                border
                border-slate-200
                bg-white
                text-[0.85vw]
                text-slate-700
                placeholder:text-slate-400
                outline-none
                transition-all
                focus:border-gray-600
                focus:ring-[0.15vw]
                focus:ring-emerald-100
              "
            />
          </div>

          {creatorSearch && (
            <div
              className="
                mt-[0.5vw]
                text-[0.7vw]
                text-slate-500
              "
            >
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredCreators.length.toLocaleString()}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {assignedCreators.length.toLocaleString()}
              </span>{" "}
              assigned creators
            </div>
          )}
        </div>
      </div>

      {/* CREATOR FILTERS */}
<div className="p-3
          mx-[1.75vw]
          mt-[1.25vw]
          mb-[1.25vw]
          bg-white
          border
          border-slate-200
          rounded-[1.5vw]
          shadow-sm">
  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h3 className="text-sm font-bold text-slate-800">
        Filter Assigned Creators
      </h3>
    </div>

    <button
      type="button"
      onClick={resetCreatorFilters}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
    >
      Reset Filters
    </button>
  </div>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[
      {
        name: "instagramFollowersRange",
        label: "Instagram Follower Range",
        options: [
          "Under 1K",
          "1K - 10K",
          "10K - 50K",
          "50K - 100K",
          "100K - 500K",
          "500K - 1M",
          "1M - 5M",
          "5M+",
        ].map((value) => ({ value, label: value })),
      },
      {
        name: "youtubeSubscribersRange",
        label: "Youtube Subscriber Range",
        options: [
          "Under 1K",
          "1K - 10K",
          "10K - 50K",
          "50K - 100K",
          "100K+",
        ].map((value) => ({ value, label: value })),
      },
      {
        name: "categories",
        label: "Category",
        options: getCreatorFilterOptions("categories"),
      },
      {
        name: "influencerType",
        label: "Influencer Type",
        options: getCreatorFilterOptions("influencerType"),
      },
      {
        name: "gender",
        label: "Gender",
        options: getCreatorFilterOptions("gender"),
      },
      {
        name: "languages",
        label: "Language",
        options: getCreatorFilterOptions("languages"),
      },
      {
        name: "age",
        label: "Age",
        options: [
          "Under 18",
          "18 - 24",
          "25 - 34",
          "35 - 44",
          "45 - 54",
          "55+",
        ].map((value) => ({ value, label: value })),
      },
      {
        name: "state",
        label: "State",
        options: getCreatorFilterOptions("state"),
      },
      {
        name: "city",
        label: "City",
        options: getCreatorFilterOptions("city"),
      },
    ].map((filter) => (
      <label
        key={filter.name}
        className="min-w-0 text-xs font-semibold text-slate-600"
      >
        <span className="mb-1.5 block">{filter.label}</span>

        <Select
          isMulti
          isSearchable
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          options={filter.options}
          value={filter.options.filter((option) =>
            creatorFilters[filter.name].includes(option.value)
          )}
          onChange={(selected) =>
            updateCreatorFilter(filter.name, selected)
          }
          placeholder={filter.label}
          noOptionsMessage={() => "No options found"}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={creatorFilterSelectStyles}
        />
      </label>
    ))}
  </div>
</div>

      {/* =====================================================
          TABLE CONTAINER
      ===================================================== */}

      <div
        className="
          mx-[1.75vw]
          border
          border-slate-200
          rounded-[1.25vw]
          bg-white
          overflow-hidden
          shadow-sm
        "
      >
        <div
          className="
            relative
            isolate
            w-full
            overflow-x-auto
            overflow-y-auto
            max-h-[40.625vw]
            min-h-[20vw]
          "
        >
          <table
            className="
              min-w-[225vw]
              w-max
              text-[0.9vw]
              border-separate
              border-spacing-0
            "
          >
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead className="bg-slate-50">
              <tr>
   {[
  "SL.No.",
  "Full Name",
  "Instagram Username",
  "Instagram Profile Link",
  "Instagram Follower Range",
  "Exact Followers",
  "Phone Number",
  "Whatsapp Number",
  "Email",
  "Categories",
  "Campaign Type",
  "Influencer Type",
  "Gender",
  "Date of Birth",
  "Languages",
  "Full Address",
  "Landmark",
  "City",
  "State",
  "Country",
  "Pincode",
  "Youtube Username",
  "Youtube Channel Link",
  "Youtube Subscribers Range",
  "Commercials For 1 Instagram Reel",
  "Photo Link",
  "Commercials For 1 Instagram Story",
  "Commercials For 1 Instagram Post",
  "Commercials For 1 Dedicated YouTube Video",
  "Commercials For 1 Integrated YouTube Video",
  "Commercials For 1 Dedicated YouTube Shorts Video",
  "Commercials For 1 Integrated YouTube Shorts Video",
  "What Kind Of Deal Do You Participate In",
  "Speaking Video Link",
  "Are you a TV/movies/OTT celebrity",
  "What all platforms are you avilable on",
  "Type Of Celebrity",
  "How many Amazon reviews you do per month",
  "Platform",
  "Commercial",
 "Quote Commercial",
  "Ready to Campaign",
  "Status",
  "Action",
  "Bio",
  "InflunexaUserId",
].filter((header) =>
  !isBrandRole || brandVisibleHeaders.includes(header)
).map((header, index) => (
                  <th
                    key={header}
                    className={`
                      sticky
                      top-0
                      z-30
                      px-[1vw]
                      py-[0.9vw]
                      text-left
                      text-[1vw]
                      font-bold
                      tracking-[0.08em]
                      text-slate-500
                      bg-slate-50
                      border-b
                      border-slate-200
                      whitespace-nowrap
                      shadow-[0_1px_0_rgba(226,232,240,1)]

                      ${
                        index === 1
                          ? `
                            left-0
                            z-50
                            w-[13.75vw]
                            min-w-[13.75vw]
                            max-w-[13.75vw]
                            border-r
                            border-slate-200
                            bg-slate-50
                          `
                          : ""
                      }
                    `}
                  >
                    {index === 0 ? (
                      <div className="flex items-center gap-[0.5vw]">
                        <input
                          type="checkbox"
                          checked={
                            filteredCreators.length > 0 &&
                            filteredCreators.every((creator) =>
                              selectedCreatorIds.includes(
                                creator._id
                              )
                            )
                          }
                          onChange={toggleSelectAll}
                          className="
                            w-4
                            h-4
                            accent-emerald-600
                            cursor-pointer
                          "
                        />

                        <span>{header}</span>
                      </div>
                   ) : (
<span>{header}</span>
)}
                  </th>
                ))}
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {filteredCreators.length === 0 ? (
                <tr>
                  <td
                  colSpan={isBrandRole ? 21 : 45}
                    className="
                      px-[1.5vw]
                      py-[4vw]
                      text-center
                      border-b
                      border-slate-200
                    "
                  >
                    <div
                      className="
                        text-[2vw]
                        mb-[0.75vw]
                      "
                    >
                      🔍
                    </div>

                    <div
                      className="
                        text-[0.95vw]
                        font-semibold
                        text-slate-700
                      "
                    >
                      No creators found
                    </div>

                    <div
                      className="
                        mt-[0.25vw]
                        text-[0.8vw]
                        text-slate-400
                      "
                    >
                      Try changing your search.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCreators.map(
                  (creator, index) => (
                    <tr
                      key={creator._id}
                      className="
                        group
                        hover:bg-emerald-50/30
                        transition-colors
                      "
                    >
                      {/* 1. SL NO + CHECKBOX */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          text-slate-500
                          whitespace-nowrap
                          align-top
                        "
                      >
                        <div className="flex items-center gap-[0.5vw]">
                          <input
                            type="checkbox"
                            checked={selectedCreatorIds.includes(
                              creator._id
                            )}
                            onChange={() =>
                              toggleCreatorSelection(
                                creator._id
                              )
                            }
                            className="
                              w-4
                              h-4
                              accent-emerald-600
                              cursor-pointer
                            "
                          />

                          <span>{index + 1}</span>
                        </div>
                      </td>

                      {/* 2. FULL NAME */}

                      <td
                        className="
                          sticky
                          left-0
                          z-20
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-r
                          border-slate-200
                          bg-white
                          group-hover:bg-emerald-50
                          align-top
                          w-[13.75vw]
                          min-w-[13.75vw]
                          max-w-[13.75vw]
                          transition-colors
                        "
                      >
                        {renderLongText(
                          creator,
                          "fullName",
                          creator.fullName,
                          30
                        )}
                      </td>

                      {/* 3. INSTAGRAM USERNAME */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {renderLongText(
                          creator,
                          "instagramUsername",
                          creator.instagramUsername
                        )}
                      </td>

                      {/* 4. INSTAGRAM PROFILE LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          text-blue-500
                        "
                      >
                        {renderLink(
                          creator,
                          "instagramProfileLink",
                          creator.instagramProfileLink
                        )}
                      </td>

                      {/* 5. INSTAGRAM FOLLOWER RANGE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                       {creator.instagramFollowerRange ||
  getInstagramFollowersRange(creator.exactFollowers) ||
  "—"}
                      </td>

                      {/* 6. EXACT FOLLOWERS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {Number(
                          creator.exactFollowers || 0
                        ).toLocaleString()}
                      </td>

                      {/* 7. PHONE NUMBER */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.phoneNumber || "—"}
                      </td>

)}

                      {/* 8. WHATSAPP NUMBER */}
                {!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.whatsappNumber || "—"}
                      </td>
                )}

                      {/* 9. EMAIL */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "email",
                          creator.email
                        )}
                      </td>
)}

                      {/* 10. CATEGORIES */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "categories",
                          creator.categories
                        )}
                      </td>

                      {/* 11. CAMPAIGN TYPE */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "campaignType",
                          creator.campaignType
                        )||"-"}
                      </td>
)}

                      {/* 12. INFLUENCER TYPE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.influencerType || "—"}
                      </td>

                      {/* 13. GENDER */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.gender || "—"}
                      </td>

                      {/* 14. DATE OF BIRTH */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                         {creator.dateOfBirth || "-"}
                      </td>

                      {/* 15. LANGUAGES */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "languages",
                          creator.languages
                        )}
                      </td>

                      {/* 16. FULL ADDRESS */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "fullAddress",
                          creator.fullAddress,
                          45
                        )}
                      </td>
)}

                      {/* 17. LANDMARK */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "landmark",
                          creator.landmark
                        )}
                      </td>
)}

                      {/* 18. CITY */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.city || "—"}
                      </td>
)}

                      {/* 19. STATE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.state || "—"}
                      </td>

                      {/* 20. COUNTRY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.country || "—"}
                      </td>

                      {/* 21. PINCODE */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.pincode || "—"}
                      </td>
)}

                      {/* 22. YOUTUBE USERNAME */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "youtubeUsername",
                          creator.youtubeUsername
                        )}
                      </td>

                      {/* 23. YOUTUBE CHANNEL LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "youtubeChannelLink",
                          creator.youtubeChannelLink
                        )}
                      </td>

                      {/* 24. YOUTUBE SUBSCRIBERS RANGE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {
  creator.youtubeSubscribersRange ||
  normalizeYoutubeSubscribersRange(creator.youtubeSubscribers) ||
  "—"
}
                      </td>

                      {/* 25. COMMERCIALS INSTAGRAM REEL */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramReel ||
                          "—"}
                      </td>
)}

                      {/* 26. PHOTO LINK */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "photoLink",
                          creator.photoLink
                        )}
                      </td>
)}

                      {/* 27. COMMERCIALS INSTAGRAM STORY */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramStory ||
                          "—"}
                      </td>
)}

                      {/* 28. COMMERCIALS INSTAGRAM POST */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramPost ||
                          "—"}
                      </td>
)}

                      {/* 29. DEDICATED YOUTUBE VIDEO */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1DedicatedYoutubeVideo ||
                          "—"}
                      </td>
)}
                      {/* 30. INTEGRATED YOUTUBE VIDEO */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1IntegratedYoutubeVideo ||
                          "—"}
                      </td>
)}

                      {/* 31. DEDICATED YOUTUBE SHORTS */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1DedicatedYoutubeShortsVideo ||
                          "—"}
                      </td>
)}

                      {/* 32. INTEGRATED YOUTUBE SHORTS */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1IntegratedYoutubeShortsVideo ||
                          "—"}
                      </td>
)}
                      {/* 33. DEAL */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "deal",
                          creator.whatKindOfDealDoYouParticipateIn
                        )}
                      </td>
)}

                      {/* 34. SPEAKING VIDEO LINK */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "speakingVideoLink",
                          creator.speakingVideoLink
                        )}
                      </td>
)}

                      {/* 35. CELEBRITY */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.isCelebrity !==
                        undefined
                          ? creator.isCelebrity
                            ? "Yes"
                            : "No"
                          : "—"}
                      </td>
)}

                      {/* 36. AVAILABLE PLATFORMS */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "availablePlatforms",
                          creator.availablePlatforms
                        )}
                      </td>
)}

                      {/* 37. TYPE OF CELEBRITY */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.typeOfCelebrity ||
                          "—"}
                      </td>
)}

                      {/* 38. AMAZON REVIEWS */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.amazonReviewsPerMonth ||
                          "—"}
                      </td>
)}

                      {/* 39. PLATFORM */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                       {creator.platform ||
    (() => {
      const hasInstagram = Boolean(
        creator.instagramProfileLink?.trim()
      );

      const hasYoutube = Boolean(
        creator.youtubeChannelLink?.trim()
      );

      if (hasInstagram && hasYoutube) {
        return "Instagram, YouTube";
      }

      if (hasInstagram) {
        return "Instagram";
      }

      if (hasYoutube) {
        return "YouTube";
      }

      return "-";
    })()}
</td>
{/* 40. COMMERCIAL */}

{!isBrandRole && (
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[13vw]
  "
>
  <input
  type="number"
  min="0"
  step="1"
  value={creatorCommercials[creator._id] || ""}
  disabled={isBrandRole}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      handleCreatorCommercial(creator._id, value);
    }
  }}
  placeholder="Enter amount"
  inputMode="numeric"
  className={`
    w-full
    min-w-[11vw]
    h-[2.7vw]
    min-h-[40px]
    px-[0.7vw]
    rounded-[0.6vw]
    border
    border-slate-200
    text-[0.8vw]
    outline-none
    ${
      isBrandRole
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "bg-white text-slate-700 focus:border-gray-500 focus:ring-[0.15vw] focus:ring-gray-100"
    }
  `}
/>
</td>

  )}
{/* QUOTE COMMERCIAL */}

  <td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[13vw]
  "
>
  <input
  type="number"
  min="0"
  step="1"
  value={creatorQuoteCommercials[creator._id] || ""}
  disabled={isBrandRole}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      handleCreatorQuoteCommercial(creator._id, value);
    }
  }}
  placeholder="Enter amount"
  inputMode="numeric"
  className={`
    w-full
    min-w-[11vw]
    h-[2.7vw]
    min-h-[40px]
    px-[0.7vw]
    rounded-[0.6vw]
    border
    border-slate-200
    text-[0.8vw]
    outline-none
    ${
      isBrandRole
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "bg-white text-slate-700 focus:border-gray-500 focus:ring-[0.15vw] focus:ring-gray-100"
    }
  `}
/>
</td>

{/* 41. READY TO CAMPAIGN */}
{!isBrandRole && (
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[12vw]
  "
>
  <select
    value={creatorReadyStatus[creator._id] || ""}
    onChange={(e) =>
      handleReadyToCampaign(
        creator._id,
        e.target.value
      )
    }
    className="
      w-full
      min-w-[10vw]
      h-[2.7vw]
      min-h-[40px]
      px-[0.7vw]
      rounded-[0.6vw]
      border
      border-slate-200
      bg-white
      text-[0.8vw]
      text-slate-700
      outline-none
      focus:border-gray-500
      focus:ring-[0.15vw]
      focus:ring-gray-100
      cursor-pointer
    "
  >
    <option value="">Select</option>
    <option value="Agreed">Agreed</option>
    <option value="Disagreed">Disagreed</option>
  </select>
</td>
)}

{/* 42. STATUS */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    whitespace-nowrap
  "
>
  {creatorActions[creator._id] ? (
    <span
      className={`
        inline-flex
        items-center
        px-[0.7vw]
        py-[0.35vw]
        rounded-full
        text-[0.75vw]
        font-semibold
        ${
          creatorActions[creator._id] === "Approved"
            ? "bg-emerald-50 text-emerald-700"
            : creatorActions[creator._id] === "Rejected"
            ? "bg-red-50 text-red-700"
            : creatorActions[creator._id] === "Pending"
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-blue-700"
        }
      `}
    >
      {creatorActions[creator._id]}
    </span>
  ) : (
    <span className="text-slate-400">—</span>
  )}
</td>

{/* 43. ACTION */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[12vw]
  "
>
  <select
    value={creatorActions[creator._id] || ""}
    onChange={(e) =>
      handleCreatorAction(
        creator._id,
        e.target.value
      )
    }
    className="
      w-full
      min-w-[10vw]
      h-[2.7vw]
      min-h-[40px]
      px-[0.7vw]
      rounded-[0.6vw]
      border
      border-slate-200
      bg-white
      text-[0.8vw]
      text-slate-700
      outline-none
      focus:border-gray-500
      focus:ring-[0.15vw]
      focus:ring-gray-100
      cursor-pointer
    "
  >
    <option value="">Select Action</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
    <option value="Pending">Pending</option>
    <option value="On-Discussion">On-Discussion</option>
  </select>
</td>
                      
                      {/* 42. BIO */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "bio",
                          creator.bio,
                          60
                        )}
                      </td>
)}

                      {/* 43. INFLUNEXA USER ID */}
{!isBrandRole && (
                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                          font-semibold
                          text-slate-700
                        "
                      >
                        {creator.InflunexaUserId ||
                          creator.influnexaUserId ||
                          "—"}
                      </td>
)}
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>

{showDeleteModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Delete Assigned Creator
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select a status to remove an assigned creator from this brand ticket.
            Approved creators cannot be deleted.
          </p>
        </div>

        <button
          type="button"
          disabled={deletingCreator}
          onClick={() => setShowDeleteModal(false)}
          className="text-xl text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Creator Status
        </label>

        <select
          value={deleteStatus}
          onChange={(e) => setDeleteStatus(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-red-500"
        >
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="On-Discussion">On-Discussion</option>
        </select>

        {assignedCreators.filter((creator) => {
          const status =
            creatorActions[String(creator._id)] ||
            creator.assignedStatus ||
            creator.status ||
            "Pending";

          return status === deleteStatus && status !== "Approved";
        }).length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            No creators are available with this status.
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          disabled={deletingCreator}
          onClick={() => setShowDeleteModal(false)}
          className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={
            deletingCreator ||
            !assignedCreators.some((creator) => {
              const status =
                creatorActions[String(creator._id)] ||
                creator.assignedStatus ||
                creator.status ||
                "Pending";

              return status === deleteStatus && status !== "Approved";
            })
          }
          onClick={handleDeleteAssignedCreator}
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingCreator ? "Deleting..." : "Delete Creator"}
        </button>
      </div>
    </div>
  </div>
)} 
</div>
      </div>
    </div>
  );
};

export default AssignedTicketCreators;