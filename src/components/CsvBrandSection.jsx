import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../config/Config";
import Papa from "papaparse";
import { saveAs } from "file-saver";
function MultiSelectDropdown({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
}) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option) => {
    const exists = value.includes(option);

    if (exists) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option) => {
    onChange(value.filter((item) => item !== option));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`relative ${open ? "z-[999999]" : "z-10"}`}>
      <label className="
        block
        mb-2
        text-sm
        font-bold
        
        tracking-wide
        text-slate-500
        
      ">
        {label}
      </label>

      {/* SELECT BOX */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          min-h-[44px]
          px-3
          py-2
          rounded-xl
          border
          border-slate-300
          bg-white
          text-sm
          text-left
          outline-none
          focus:border-slate-500
          focus:ring-2
          focus:ring-slate-200
          flex
          items-center
          justify-between
          gap-2
          
          
        "
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {value.length === 0 ? (
            <span className="text-neutral-500 font-semibold ">
              {placeholder}
            </span>
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="
                  inline-flex
                  items-center
                  gap-1
                  px-2
                  py-1
                  rounded-lg
                  bg-slate-100
                  text-slate-700
                  text-xs
                  font-medium
                  
                "
              >
                {item}

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(item);
                  }}
                  className="
                    cursor-pointer
                    text-slate-500
                    hover:text-red-500
                    font-bold
                  "
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>

        <span className="text-slate-500 text-xs">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute
             left-0
      top-full
            z-[999999]
            mt-2
            w-full
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-xl
            overflow-visible
            
          "
        >
          {/* HEADER */}
          <div className="
            flex
            items-center
            justify-between
            px-4
            py-3
            border-b
            border-slate-100
            bg-slate-50
            
          ">
            <span className="
              text-xs
              font-semibold
              text-slate-600
            ">
              {value.length} selected
            </span>

            {value.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="
                  text-xs
                  font-semibold
                  text-red-500
                  hover:text-red-700
                "
              >
                Clear All
              </button>
            )}
          </div>

          {/* OPTIONS */}
          <div className="
            max-h-[220px]
            overflow-y-auto
            p-2
          ">
            {options.length === 0 ? (
              <div className="
                px-3
                py-4
                text-center
                text-sm
                text-slate-400
              ">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const selected = value.includes(option);

                return (
                  <label
                    key={option}
                    className={`
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-lg
                      cursor-pointer
                      text-sm
                      transition
                      ${
                        selected
                          ? "bg-slate-100 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleOption(option)}
                      className="
                        w-4
                        h-4
                        rounded
                        border-slate-300
                        text-slate-900
                        focus:ring-slate-400
                      "
                    />

                    <span className="flex-1">
                      {option}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function CsvBrandSection() {
const [filterOptions, setFilterOptions] = useState({
    prospects: [],
    ageOfCompany: [],
    dataType: [],
    status: [],
  });
  const [csvBrands, setCsvBrands] = useState([]);
const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
const [copiedOfficialEmail, setCopiedOfficialEmail] = useState(null);
const [copiedMobile, setCopiedMobile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  const recordsPerPage = 100;

const [filters, setFilters] = useState({
  companyName: "",
  fullName: "",
  prospects: [],
  email: "",
  officialEmail: "",
  mobileNumber: "",
  linkedinProfile: "",
  city: "",
  address: "",
  directors: "",
  ageOfCompany: [],
  websiteUrl: "",
  dataType: [],
  status: [],
});
  // ========================================
  // FETCH BRANDS
  // ========================================
useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/csv-brands/filter-options`
      );

      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error(
        "FILTER OPTIONS ERROR:",
        error
      );
    }
  };


  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000);

  return () => clearInterval(timer);
}, []);
  const fetchCSVBrands = async () => {

  try {

    setLoading(true);

    const response = await axios.get(
      `${Config.API_URL}/csv-brands`,
      {
        params: {
  page: currentPage,
  limit: recordsPerPage,

  companyName: filters.companyName,
  fullName: filters.fullName,

  prospects: filters.prospects.join(","),

  email: filters.email,
  officialEmail: filters.officialEmail,
  mobileNumber: filters.mobileNumber,
  linkedinProfile: filters.linkedinProfile,
  city: filters.city,
  address: filters.address,
  directors: filters.directors,

  ageOfCompany: filters.ageOfCompany.join(","),

  websiteUrl: filters.websiteUrl,

  dataType: filters.dataType.join(","),

  status: filters.status.join(","),
},
      }
    );

    if (response.data.success) {

      setCsvBrands(
        response.data.data || []
      );

      setTotalRecords(
        response.data.total || 0
      );

      setTotalPages(
        response.data.totalPages || 1
      );

    }

  } catch (error) {

    console.error(
      "CSV BRAND FETCH ERROR:",
      error.response?.data ||
      error.message
    );

  } finally {

    setLoading(false);

  }

};

const handleFilterChange = (field, value) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }));

  setCurrentPage(1);
};

const resetFilters = () => {

  setFilters({
    companyName: "",
    fullName: "",
    prospects: [],
    email: "",
    officialEmail: "",
    mobileNumber: "",
    linkedinProfile: "",
    city: "",
    address: "",
    directors: "",
    ageOfCompany: [],
    websiteUrl: "",
    dataType: [],
    status: [],
  });

  setCurrentPage(1);
};

const hasActiveFilters = Object.values(filters).some((value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value || "").trim() !== "";
});

const downloadFilteredBrands = async () => {

  try {

    const params = {
      download: "true",
    };

    Object.keys(filters).forEach((key) => {
  const value = filters[key];

  if (Array.isArray(value)) {
    if (value.length > 0) {
      params[key] = value.join(",");
    }
  } else if (typeof value === "string") {
    if (value.trim() !== "") {
      params[key] = value.trim();
    }
  }
});
    const response = await axios.get(
      `${Config.API_URL}/csv-brands`,
      {
        params,
      }
    );

    const brands = response.data.data || [];

    if (!brands.length) {

      alert("No brand data found for the selected filters.");
      return;

    }

    const exportData = brands.map((brand, index) => ({

      "SL No.": index + 1,

      "Company Name":
        brand.companyName || "",

      "Full Name":
        brand.fullName || "",

      "ProsPects":
        brand.prospects || "",

      "Email Id":
        brand.email || "",

      "Official Email Id":
        brand.officialEmail || "",

      "Mobile Number":
        brand.mobileNumber || "",

      "Linkedin Profile":
        brand.linkedinProfile || "",

      "City":
        brand.city || "",

      "Address":
        brand.address || "",

      "Directors":
        brand.directors || "",

      "Age of the Company	":
        brand.ageOfCompany || "",

      "Website URL":
        brand.websiteUrl || "",

      "Data Type":
        brand.dataType || "",

      "Status":
        brand.status || "",

    }));

    const csv = Papa.unparse(exportData);

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      "Filtered_Brands.csv"
    );

  } catch (error) {

    console.error(
      "DOWNLOAD FILTERED BRANDS ERROR:",
      error.response?.data ||
      error.message
    );

    alert(
      error.response?.data?.message ||
      "Failed to download filtered brands"
    );

  }

};

const maskEmail = (email) => {

  if (!email) return "";

  const [username, domain] =
    email.split("@");

  if (!domain) return "******";

  if (username.length <= 2) {

    return (
      username.charAt(0) +
      "***@" +
      domain
    );

  }

  return (
    username.substring(0, 2) +
    "***@" +
    domain
  );

};


const maskMobile = (mobile) => {

  if (!mobile) return "";

  const value = String(mobile);

  if (value.length <= 4) {
    return "******";
  }

  return (
    value.substring(0, 2) +
    "******" +
    value.substring(value.length - 2)
  );

};

// DOWNLOAD MASKED DATA
const downloadMaskedFilteredBrands = async () => {
  try {
    const params = {
      download: "true",
    };

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params[key] = value.join(",");
        }
      } else if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        params[key] = String(value).trim();
      }
    });

    console.log("MASKED DOWNLOAD PARAMS:", params);

    const response = await axios.get(
      `${Config.API_URL}/csv-brands`,
      {
        params,
      }
    );

    const brands = response.data.data || [];

    console.log("FILTERED BRANDS COUNT:", brands.length);

    if (!brands.length) {
      alert("No brand data found for the selected filters.");
      return;
    }

    const exportData = brands.map((brand, index) => ({
      "SL No.": index + 1,
      "Company Name": brand.companyName || "",
      "Full Name": brand.fullName || "",
      "ProsPects": brand.prospects || "",
      "Email Id": maskEmail(brand.email),
      "Official Email Id": maskEmail(brand.officialEmail),
      "Mobile Number": maskMobile(brand.mobileNumber),
      "Linkedin Profile": brand.linkedinProfile || "",
      "City": brand.city || "",
      "Address": brand.address || "",
      "Directors": brand.directors || "",
      "Age of the Company": brand.ageOfCompany || "",
      "Website URL": brand.websiteUrl || "",
      "Data Type": brand.dataType || "",
      "Status": brand.status || "",
    }));

    const csv = Papa.unparse(exportData);

    const blob = new Blob(
      [csv],
      { type: "text/csv;charset=utf-8;" }
    );

    saveAs(
      blob,
      "Masked_Filtered_Brands.csv"
    );

  } catch (error) {
    console.error(
      "DOWNLOAD MASKED BRANDS ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Failed to download masked brands"
    );
  }
};
  // ========================================
  // INITIAL FETCH / PAGE CHANGE
  // ========================================

  useEffect(() => {

    fetchCSVBrands();

  }, [currentPage,filters]);


  // ========================================
  // DELETE SINGLE BRAND
  // ========================================

  const deleteSingleCSVBrand = async (id) => {

    try {

      const confirmDelete =
        window.confirm(
          "Delete this CSV brand?"
        );

      if (!confirmDelete) return;


      const response = await axios.delete(
        `${Config.API_URL}/csv-brands/${id}`
      );


      alert(
        response.data.message
      );


      fetchCSVBrands();


    } catch (error) {

      console.error(
        "DELETE CSV BRAND ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete brand"
      );

    }

  };


  // ========================================
  // DELETE ALL BRANDS
  // ========================================

  const deleteAllCSVBrands = async () => {

    try {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete ALL CSV brands?"
        );

      if (!confirmDelete) return;


      const response = await axios.delete(
        `${Config.API_URL}/csv-brands`
      );


      alert(
        response.data.message
      );


      setCsvBrands([]);

      setTotalRecords(0);

      setTotalPages(1);

      setCurrentPage(1);


    } catch (error) {

      console.error(
        "DELETE ALL CSV BRANDS ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete brands"
      );

    }

  };


 const handleStatusChange = async (brandId, newStatus) => {
  try {
    const statusChangedAt = new Date().toISOString();

    const response = await axios.put(
      `${Config.API_URL}/csv-brands/${brandId}`,
      {
        status: newStatus,
        statusChangedAt,
      }
    );

    if (response.data.success) {
      setCsvBrands((prev) =>
        prev.map((brand) =>
          brand._id === brandId
            ? {
                ...brand,
                status: newStatus,
                statusChangedAt:
                  response.data.data?.statusChangedAt ||
                  statusChangedAt,
              }
            : brand
        )
      );
    }

  } catch (error) {
    console.error(
      "UPDATE CSV BRAND STATUS ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Failed to update brand status"
    );
  }
};


const getStatusDetails = (status) => {
  switch (status) {
    case "Pending":
      return {
        day: "-",
        outreach: "Lead added, no message sent",
      };

    case "Reachout":
      return {
        day: "Day 1",
        outreach: "Initial email/LinkedIn/WhatsApp",
      };

    case "Followup-1":
      return {
        day: "Day 3",
        outreach: "1st follow-up",
      };

    case "Followup-2":
      return {
        day: "Day 7",
        outreach: "2nd follow-up",
      };

    case "Followup-3":
      return {
        day: "Day 12",
        outreach: "Final direct follow-up",
      };

    case "Nurture":
      return {
        day: "Day 18–30",
        outreach: "Soft future follow-up",
      };

    case "Interested":
      return {
        day: "Anytime",
        outreach: "Brand responds positively",
      };

    case "Proposal Sent":
      return {
        day: "After interest",
        outreach: "Send proposal/pricing",
      };

    case "Negotiation":
      return {
        day: "After proposal",
        outreach: "Discuss budget/requirements",
      };

    case "Won":
      return {
        day: "—",
        outreach: "Campaign confirmed",
      };

    case "Lost/Not Interested":
      return {
        day: "—",
        outreach: "Brand rejects",
      };

    case "No Response":
      return {
        day: "After final follow-up",
        outreach: "No response after all attempts",
      };

    default:
      return {
        day: "—",
        outreach: "—",
      };
  }
};
  // ========================================
  // PREVIOUS PAGE
  // ========================================

  const handlePrevious = () => {

    if (currentPage > 1) {

      setCurrentPage(
        (prev) => prev - 1
      );

    }

  };


  // ========================================
  // NEXT PAGE
  // ========================================

  const handleNext = () => {

    if (currentPage < totalPages) {

      setCurrentPage(
        (prev) => prev + 1
      );

    }

  };

const getReminder = (brand) => {
  const status = brand.status || "Pending";

  const targetDays = {
    Reachout: 1,
    "Followup-1": 3,
    "Followup-2": 7,
    "Followup-3": 12,
    Nurture: 30,
  };

  // These statuses don't have a reminder
  if (!(status in targetDays)) {
    return {
      text: "—",
      type: "none",
    };
  }

  /*
    Use createdAt as the starting point.

    statusChangedAt is used if it exists,
    otherwise createdAt is used.
  */
  const startDate =
    brand.statusChangedAt ||
    brand.createdAt;

  if (!startDate) {
    return {
      text: "No date",
      type: "none",
    };
  }

  const start = new Date(startDate);

  if (isNaN(start.getTime())) {
    return {
      text: "No date",
      type: "none",
    };
  }

  const now = new Date();

  // Remove time portion so we compare calendar days
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const elapsedDays = Math.floor(
    (today - startDay) /
      (1000 * 60 * 60 * 24)
  );

  const remainingDays =
    targetDays[status] - elapsedDays;

  // Future
  if (remainingDays > 0) {
    return {
      text: `${remainingDays} day${
        remainingDays === 1 ? "" : "s"
      } left`,
      type: remainingDays === 1
        ? "warning"
        : "normal",
    };
  }

  // Today
  if (remainingDays === 0) {
    return {
      text: "Due today",
      type: "due",
    };
  }

  // Overdue
  const overdueDays = Math.abs(remainingDays);

  return {
    text: `${overdueDays} day${
      overdueDays === 1 ? "" : "s"
    } overdue`,
    type: "overdue",
  };
};


  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-[24px]
        shadow-sm
        overflow-hidden
      "
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <div
        className="
          px-7
          pt-7
          pb-5
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-bold
                text-slate-900
                tracking-tight
              "
            >
              CSV Brands
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Manage brands uploaded through
              CSV files.
            </p>

          </div>

        </div>

      </div>

      {hasActiveFilters && csvBrands.length > 0 &&(
  <div className="flex items-center justify-end gap-3 ml-auto">

    {/* DOWNLOAD FILTERED */}
    <button
      onClick={downloadFilteredBrands}
      className="
        px-5
        py-3
        rounded-xl
        bg-slate-900
        text-white
        text-sm
        font-semibold
        shadow-sm
        hover:bg-slate-800
        transition
        whitespace-nowrap
      "
    >
      Download Filtered
    </button>

    {/* DOWNLOAD MASKED FILTERED */}
    <button
      onClick={downloadMaskedFilteredBrands}
      className="
        px-5
        py-3
        rounded-xl
        bg-white
        text-slate-700
        border
        border-slate-300
        text-sm
        font-semibold
        shadow-sm
        hover:bg-slate-50
        transition
        whitespace-nowrap
      "
    >
      Download Masked
    </button>

  </div>
)}
{/* ========================================
    FILTER SECTION
======================================== */}

<div className=" relative z-[100] px-7 pb-6">

  <div className="
   relative
    z-[100]
    rounded-[22px]
    border
    border-slate-200
    bg-slate-50
    p-5
  ">

    {/* FILTER HEADER */}

    <div className="
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-3
      mb-5
    ">

      <div>

        <h3 className="
          text-lg
          font-bold
          text-slate-900
        ">
          Filter Brands
        </h3>

        <p className="
          mt-1
          text-sm
          text-slate-500
        ">
          Search and filter uploaded brands.
        </p>

      </div>


      <button
        type="button"
        onClick={resetFilters}
        className="
          h-10
          px-5
          rounded-xl
          border
          border-slate-300
          bg-white
          text-slate-700
          text-sm
          font-semibold
          hover:bg-slate-100
          transition
        "
      >
        Reset Filters
      </button>

    </div>


    {/* FILTER GRID */}

    <div className="
    relative
    z-0
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-4
    gap-4
  "
  >


      {/* COMPANY NAME */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          tracking-wide
          text-slate-500
        ">
          Company Name
        </label>

        <input
          type="text"
          value={filters.companyName}
          onChange={(e) =>
            handleFilterChange(
              "companyName",
              e.target.value
            )
          }
          placeholder="Search company"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* FULL NAME */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          tracking-wide
          text-slate-500
        ">
          Full Name
        </label>

        <input
          type="text"
          value={filters.fullName}
          onChange={(e) =>
            handleFilterChange(
              "fullName",
              e.target.value
            )
          }
          placeholder="Search name"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* PROSPECTS */}

<MultiSelectDropdown
  label="Prospects"
  options={filterOptions.prospects}
  value={filters.prospects}
  onChange={(value) =>
    handleFilterChange("prospects", value)
  }
  placeholder="Select prospects"
/>


      {/* EMAIL */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          tracking-wide
          text-slate-500
        ">
          Email
        </label>

        <input
          type="text"
          value={filters.email}
          onChange={(e) =>
            handleFilterChange(
              "email",
              e.target.value
            )
          }
          placeholder="Search email"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* OFFICIAL EMAIL */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          
          tracking-wide
          text-slate-500
          
        ">
          Official Email
        </label>

        <input
          type="text"
          value={filters.officialEmail}
          onChange={(e) =>
            handleFilterChange(
              "officialEmail",
              e.target.value
            )
          }
          placeholder="Search official email"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* MOBILE */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          
          tracking-wide
          text-slate-500
        ">
          Mobile Number
        </label>

        <input
          type="text"
          value={filters.mobileNumber}
          onChange={(e) =>
            handleFilterChange(
              "mobileNumber",
              e.target.value
            )
          }
          placeholder="Search mobile"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* LINKEDIN */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          
          tracking-wide
          text-slate-500
        ">
          LinkedIn Profile
        </label>

        <input
          type="text"
          value={filters.linkedinProfile}
          onChange={(e) =>
            handleFilterChange(
              "linkedinProfile",
              e.target.value
            )
          }
          placeholder="Search LinkedIn"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* CITY */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
      
          tracking-wide
          text-slate-500
        ">
          City
        </label>

        <input
          type="text"
          value={filters.city}
          onChange={(e) =>
            handleFilterChange(
              "city",
              e.target.value
            )
          }
          placeholder="Search city"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* ADDRESS */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
        
          tracking-wide
          text-slate-500
        ">
          Address
        </label>

        <input
          type="text"
          value={filters.address}
          onChange={(e) =>
            handleFilterChange(
              "address",
              e.target.value
            )
          }
          placeholder="Search address"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* DIRECTORS */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
        
          tracking-wide
          text-slate-500
        ">
          Directors
        </label>

        <input
          type="text"
          value={filters.directors}
          onChange={(e) =>
            handleFilterChange(
              "directors",
              e.target.value
            )
          }
          placeholder="Search directors"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* AGE OF COMPANY */}

<MultiSelectDropdown
  label="Age Of Company"
  options={filterOptions.ageOfCompany}
  value={filters.ageOfCompany}
  onChange={(value) =>
    handleFilterChange("ageOfCompany", value)
  }
  placeholder="Select company age"
/>



      {/* WEBSITE */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-bold
          
          tracking-wide
          text-slate-500
        ">
          Website
        </label>

        <input
          type="text"
          value={filters.websiteUrl}
          onChange={(e) =>
            handleFilterChange(
              "websiteUrl",
              e.target.value
            )
          }
          placeholder="Search website"
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            text-sm
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-200
            placeholder:font-semibold
          "
        />

      </div>


      {/* DATA TYPE */}

      {/* DATA TYPE */}
<MultiSelectDropdown
  label="Data Type"
  options={filterOptions.dataType}
  value={filters.dataType}
  onChange={(value) =>
    handleFilterChange("dataType", value)
  }
  placeholder="Select data type"
/>


 {/* STATUS */}
<MultiSelectDropdown
  label="Status"
  options={filterOptions.status}
  value={filters.status}
  onChange={(value) =>
    handleFilterChange("status", value)
  }
  placeholder="Select status"
/>
    </div>

  </div>

</div>
{/* ========================================
          TOTAL RECORDS
      ======================================== */}

      <div
        className="
          px-7
          pb-5
        "
      >

        <div
          className="
            inline-flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            bg-slate-50
            border
            border-slate-200
          "
        >

          <span
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            Total Brands
          </span>

          <span
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            {totalRecords}
          </span>

        </div>

      </div>
      {/* ========================================
          TABLE
      ======================================== */}

      <div className="px-7 pb-7">

        <div
          className="
            border
            border-slate-200
            rounded-[20px]
            overflow-hidden
            bg-white
          "
        >

          <div
            className="
              overflow-x-auto
              overflow-y-auto
              max-h-[650px]
            "
          >

            {loading ? (

              <div
                className="
                  py-20
                  text-center
                  text-slate-500
                  font-medium
                "
              >
                Loading brands...
              </div>

            ) : csvBrands.length === 0 ? (

              <div
                className="
                  py-20
                  text-center
                  text-slate-500
                  font-medium
                "
              >
                No brands found.
              </div>

            ) : (

              <table
                 className="
    min-w-[2200px]
    w-full
    table-fixed
    text-sm
    border-collapse
  "
              >

     <colgroup><col className="w-[70px]" /><col className="w-[180px]" /><col className="w-[160px]" /><col className="w-[140px]" /><col className="w-[220px]" /><col className="w-[220px]" /><col className="w-[170px]" /><col className="w-[360px]" /><col className="w-[140px]" /><col className="w-[250px]" /><col className="w-[180px]" /><col className="w-[150px]" /><col className="w-[220px]" /><col className="w-[150px]" /><col className="w-[150px]" /><col className="w-[130px]" /><col className="w-[200px]" /></colgroup>            
{/* ========================================
HEADER
======================================== */}

<thead className="bg-slate-50">
  <tr>

    {/* SL NO */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      SL No.
    </th>

    {/* COMPANY NAME - FIXED */}
    <th
      className="
        sticky
        left-0
        top-0
        z-50
        w-[220px]
        min-w-[220px]
        max-w-[220px]
        px-4
        py-4
        text-left
        text-[14px]
        font-bold
        tracking-wider
        text-slate-500
        bg-slate-50
        border-r
        border-b
        border-slate-200
        whitespace-nowrap
      "
    >
      Company Name
    </th>

    {/* FULL NAME */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      Full Name
    </th>

    {/* PROSPECTS */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      ProsPects
    </th>

    {/* EMAIL */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      Email Id
    </th>

    {/* OFFICIAL EMAIL */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      Official Email Id
    </th>

    {/* MOBILE */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      Mobile Number
    </th>

    {/* LINKEDIN */}
    <th
      className="
        sticky
        top-0
        z-30
        px-4
        py-3
        text-left
        whitespace-nowrap
        font-semibold
        text-slate-500
        bg-slate-50
        border-b
        border-slate-200
      "
    >
      Linkedin Profile
    </th>

    {/* CITY */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      City
    </th>

    {/* ADDRESS */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Address
    </th>

    {/* DIRECTORS */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Directors
    </th>

    {/* AGE */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Age of the Company
    </th>

    {/* WEBSITE */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Website URL
    </th>

    {/* DATA TYPE */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Data Type
    </th>

    {/* STATUS */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Status
    </th>

    {/* REMINDER */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Reminder
    </th>

    {/* ACTION */}
    <th className="sticky top-0 z-30 px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 bg-slate-50 border-b border-slate-200">
      Action
    </th>

  </tr>
</thead>


<tbody
  className="
    divide-y
    divide-slate-100
    bg-white
  "
>
  {csvBrands.map(
    (brand, index) => (

      <tr
        key={brand._id}
        className="
          hover:bg-slate-50
          transition
        "
      >

        {/* SL NO */}
        <td className="w-[70px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {(currentPage - 1) *
            recordsPerPage +
            index +
            1}
        </td>


        {/* COMPANY */}
        <td
          className="
    sticky
    left-0
    z-20
    w-[220px]
    min-w-[220px]
    max-w-[220px]
    px-4
    py-3
    text-left
    whitespace-nowrap
    align-middle
    font-semibold
    text-slate-800
    bg-white
    border-r
    border-slate-200
  "
        >
          {brand.companyName || "-"}
        </td>


        {/* FULL NAME */}
        <td className="w-[160px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.fullName || "-"}
        </td>


        {/* PROSPECTS */}
        <td className="w-[140px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.prospects || "-"}
        </td>


        {/* EMAIL */}
        <td className="w-[220px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.email || "-"}
        </td>


       {/* OFFICIAL EMAIL */}
<td className="w-[220px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
  {brand.officialEmail ? (
    <div className="group flex items-center gap-2">
      <span>{brand.officialEmail}</span>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(brand.officialEmail);

          setCopiedOfficialEmail(brand._id);

          setTimeout(() => {
            setCopiedOfficialEmail(null);
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
        title="Copy official email"
      >
        {copiedOfficialEmail === brand._id ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    "-"
  )}
</td>


        {/* MOBILE */}
        {/* MOBILE NUMBER */}
<td className="w-[180px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
  {brand.mobileNumber ? (
    <div className="group flex items-center gap-2">
      <span>{brand.mobileNumber}</span>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(brand.mobileNumber);

          setCopiedMobile(brand._id);

          setTimeout(() => {
            setCopiedMobile(null);
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
        title="Copy mobile number"
      >
        {copiedMobile === brand._id ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    "-"
  )}
</td>

        {/* LINKEDIN */}
       <td className="w-[360px] min-w-[360px] max-w-[360px] px-4 py-3 text-left align-middle text-blue-600 ">
  {brand.linkedinProfile ? (
    <a
      href={
        brand.linkedinProfile.startsWith("http")
          ? brand.linkedinProfile
          : `https://${brand.linkedinProfile}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-[330px] text-blue-600 hover:underline break-all"
      title={brand.linkedinProfile}
    >
      {brand.linkedinProfile}
    </a>
  ) : (
    "-"
  )}
</td>


        {/* CITY */}
        <td className="w-[140px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.city || "-"}
        </td>


        {/* ADDRESS */}
        <td className="w-[250px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.address || "-"}
        </td>


        {/* DIRECTORS */}
        <td className="w-[180px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.directors || "-"}
        </td>


        {/* AGE */}
        <td className="w-[150px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.ageOfCompany || "-"}
        </td>


        {/* WEBSITE */}
  <td className="w-[220px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
  {brand.websiteUrl ? (
    <a
      href={
        brand.websiteUrl.startsWith("http")
          ? brand.websiteUrl
          : `https://${brand.websiteUrl}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-[330px] break-all !text-blue-600 hover:!text-blue-800"
      title={brand.websiteUrl}
    >
      {brand.websiteUrl}
    </a>
  ) : (
    "-"
  )}
</td>


        {/* DATA TYPE */}
        <td className="w-[150px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
          {brand.dataType || "-"}
        </td>


        {/* STATUS */}
        <td className=" px-4 py-3 text-left whitespace-nowrap align-middle">

          <span
  className={`
    inline-flex
    items-center
    px-3
    py-1
    rounded-full
    text-xs
    font-bold

    ${
      brand.status === "Reachout"

        ? "bg-blue-50 text-blue-600 border border-blue-200"

        : brand.status === "Followup-1"

        ? "bg-amber-50 text-amber-600 border border-amber-200"

        : brand.status === "Followup-2"

        ? "bg-orange-50 text-orange-600 border border-orange-200"

        : brand.status === "Followup-3"

        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"

        : brand.status === "Nurture"

        ? "bg-indigo-50 text-indigo-600 border border-indigo-200"

        : brand.status === "Interested"

        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"

        : brand.status === "Proposal Sent"

        ? "bg-cyan-50 text-cyan-600 border border-cyan-200"

        : brand.status === "Negotiation"

        ? "bg-violet-50 text-violet-600 border border-violet-200"

        : brand.status === "Won"

        ? "bg-green-50 text-green-700 border border-green-200"

        : brand.status === "Lost/Not Interested"

        ? "bg-red-50 text-red-600 border border-red-200"

        : brand.status === "No Response"

        ? "bg-gray-100 text-gray-600 border border-gray-300"

        : "bg-slate-50 text-slate-600 border border-slate-200"
    }
  `}
>
  {brand.status || "Pending"}
</span>
        </td>


{/* REMINDER */}
<td className="px-4 py-3 text-left whitespace-nowrap align-middle">
  {(() => {
    const reminder = getReminder(brand);

    return (
      <span
        className={`
          inline-flex
          items-center
          px-3
          py-1.5
          rounded-full
          text-xs
          font-bold
          ${
            reminder.type === "normal"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : reminder.type === "warning"
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : reminder.type === "due"
              ? "bg-red-50 text-red-600 border border-red-200"
              : reminder.type === "overdue"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-slate-50 text-slate-500 border border-slate-200"
          }
        `}
      >
        {reminder.text}
      </span>
    );
  })()}
</td>

        {/* ACTION */}

<td className="px-4 py-3 text-left whitespace-nowrap align-middle">

  <select
    value={brand.status || "Pending"}
    onChange={(e) =>
      handleStatusChange(
        brand._id,
        e.target.value
      )
    }
    className="
      w-[180px]
      px-3
      py-2
      rounded-lg
      border
      border-slate-300
      bg-white
      text-sm
      font-medium
      text-slate-700
      outline-none
      focus:ring-2
      focus:ring-slate-300
      cursor-pointer
    "
  >

    <option value="Pending">
      Pending
    </option>

    <option value="Reachout">
      Reachout
    </option>

    <option value="Followup-1">
      Followup-1
    </option>

    <option value="Followup-2">
      Followup-2
    </option>

    <option value="Followup-3">
      Followup-3
    </option>

    <option value="Nurture">
      Nurture
    </option>

    <option value="Interested">
      Interested
    </option>

    <option value="Proposal Sent">
      Proposal Sent
    </option>

    <option value="Negotiation">
      Negotiation
    </option>

    <option value="Won">
      Won
    </option>

    <option value="Lost/Not Interested">
      Lost/Not Interested
    </option>

    <option value="No Response">
      No Response
    </option>

  </select>

</td>

      </tr>
    )
  )}
</tbody>
</table>

  )}
  

          </div>

        </div>


        {/* ========================================
            PAGINATION
        ======================================== */}

        {totalPages > 1 && (

          <div
            className="
              flex
              justify-between
              items-center
              mt-5
              px-2
            "
          >

            <button
              onClick={handlePrevious}
              disabled={
                currentPage === 1
              }
              className={`
                h-10
                px-5
                rounded-xl
                border
                text-sm
                font-semibold
                transition

                ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              Previous
            </button>


            <span
              className="
                text-sm
                font-semibold
                text-slate-600
              "
            >
              Page {currentPage} of{" "}
              {totalPages}
            </span>


            <button
              onClick={handleNext}
              disabled={
                currentPage ===
                totalPages
              }
              className={`
                h-10
                px-5
                rounded-xl
                border
                text-sm
                font-semibold
                transition

                ${
                  currentPage ===
                  totalPages
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                }
              `}
            >
              Next
            </button>

          </div>

        )}

      </div>

    </div>

  );
}

export default CsvBrandSection;