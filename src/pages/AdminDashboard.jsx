import { useEffect, useMemo, useState } from "react";
import {
  createBlogPost,
  createAdminUser,
  deleteAdminUser,
  deleteBlogPost,
  deleteTestimonial,
  getAdminDashboard,
  getAdminRegistrations,
  hasAdminSession,
  loginAdmin,
  logoutAdmin,
  updateAdminUser,
  updateBlogPost,
  updateOwnAdminPassword,
  updateRegistrationStatus,
  updateTestimonialStatus,
  createJob,
  updateJob,
  deleteJob,
  updateJobApplicationStatus,
  createBrandTicket,
  updateBrandTicket,
  deleteBrandTicket,
} from "../lib/api";
import influnexaLogo from "../assets/influnexa-logo.png";
import CsvCreatorSection from "../components/CsvCreatorSection";
import UploadCreatorsCSV from "../components/UploadCreatorCSV";
import CsvBrandSection from "../components/CsvBrandSection";
import UploadBrandsCSV from "../components/UploadBrandsCSV";
const brandStatuses = [
  "New",
  "Under Review",
  "Contacted",
  "Followup-1",
  "Followup-2",
  "Followup-3",
  "Meeting Scheduled",
  "Requirement Received",
  "Proposal Sent",
  "Negotiation",
  "Deal Won",
  "Campaign Started",
  "Campaign Completed",
  "Repeat Client",
  "No Response",
  "Lost",
  "Closed",
];
const influencerStatuses = ["new", "reviewing", "approved", "rejected"];
const testimonialStatuses = ["pending", "approved", "rejected"];
const registrationPageSize = 25;

const legacyBrandStatusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Under Review",
  closed: "Closed",
};

const brandDetailFields = [
  ["Contact Name", "contactName"],
  ["Email", "email", "email"],
  ["Phone", "phone"],
  ["Company Name", "companyName"],
  ["Website", "website", "url"],
  ["Country", "country"],
  ["Industry", "industry"],
  ["Product Name", "productName"],
  ["Product URL", "productUrl", "url"],
  ["Campaign Types", "campaignTypes"],
  ["Campaign Goals", "campaignGoals", "long"],
  ["Target Audience", "targetAudience", "long"],
  ["Target Countries", "targetCountries"],
  ["Preferred Platforms", "preferredPlatforms"],
  ["Creator Count", "creatorCount"],
  ["Budget Currency", "budgetCurrency"],
  ["Budget Range", "budgetRange"],
  ["Timeline", "timeline"],
  ["Product Shipping Ready", "productShippingReady"],
  ["Notes", "notes", "long"],
  ["Status", "status"],
  ["Created", "createdAt", "date"],
  ["Updated", "updatedAt", "date"],
];

const influencerDetailFields = [
  ["Full Name", "fullName"],
  ["Creator Name", "creatorName"],
  ["Email", "email", "email"],
  ["Phone", "phone"],
  ["Country", "country"],
  ["State / Province", "state"],
  ["City", "city"],
  ["Languages", "languages"],
  ["Categories", "categories"],
  ["Primary Platform", "primaryPlatform"],
  ["Primary Profile", "primaryProfile", "url"],
  ["Other Profiles", "otherProfiles", "profiles"],
  ["Followers", "followers"],
  ["Engagement Rate", "engagementRate"],
  ["Average Views", "averageViews"],
  ["Audience Countries", "audienceCountries"],
  ["Content Types", "contentTypes"],
  ["Past Brand Work", "pastBrandWork", "long"],
  ["Rate Card", "rateCard"],
  ["Shipping Address", "shippingAddress", "long"],
  ["Portfolio URL", "portfolioUrl", "url"],
  ["Notes", "notes", "long"],
  ["Consent To Contact", "consentToContact", "boolean"],
  ["Status", "status"],
  ["Created", "createdAt", "date"],
  ["Updated", "updatedAt", "date"],
];
const initialBlogForm = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  author: "Influnexa Team",
  readTime: "5 min read",
  coverImage: "",
  status: "published",
};

const initialUserForm = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  status: "active",
};

const initialPasswordForm = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};
const initialJobForm = { jobId: "", title: "", department: "", type: "Full-time", location: "", experience: "", summary: "", description: "", responsibilities: "", requirements: "", status: "open" };
const applicationStatuses = ["Review", "Shortlisted", "Selected", "Rejected", "On Hold"];
const candidatePageSize = 25;
const ticketStatuses = ["Draft", "Planned", "Active", "On Hold", "Completed", "Cancelled"];
const initialTicketForm = { brandName: "", campaignName: "", contactName: "", contactEmail: "", objective: "", platforms: "", startDate: "", endDate: "", budget: "", currency: "USD", status: "Draft", notes: "", metrics: { creators: "", posts: "", reach: "", impressions: "", engagements: "", clicks: "", conversions: "", spend: "" } };

const emptyDashboardData = {
  stats: {},
  pagination: {
    brands: { page: 1, limit: registrationPageSize, total: 0, totalPages: 1 },
    influencers: { page: 1, limit: registrationPageSize, total: 0, totalPages: 1 },
    applications: { page: 1, limit: candidatePageSize, total: 0, totalPages: 1 },
  },
  brands: [],
  influencers: [],
  blogs: [],
  testimonials: [],
  users: [],
  jobs: [],
  applications: [],
  tickets: [],
  analytics: { brandStatuses: [], influencerStatuses: [], jobStatuses: [], applicationStatuses: [], ticketStatuses: [] },
  currentUser: null,
};

function normalizeDashboardData(dashboard = {}) {
  return {
    stats: dashboard.stats || {},
    pagination: {
      brands: dashboard.pagination?.brands || emptyDashboardData.pagination.brands,
      influencers: dashboard.pagination?.influencers || emptyDashboardData.pagination.influencers,
      applications: dashboard.pagination?.applications || emptyDashboardData.pagination.applications,
    },
    brands: Array.isArray(dashboard.brands) ? dashboard.brands : [],
    influencers: Array.isArray(dashboard.influencers) ? dashboard.influencers : [],
    blogs: Array.isArray(dashboard.blogs) ? dashboard.blogs : [],
    testimonials: Array.isArray(dashboard.testimonials) ? dashboard.testimonials : [],
    users: Array.isArray(dashboard.users) ? dashboard.users : [],
    jobs: Array.isArray(dashboard.jobs) ? dashboard.jobs : [],
    applications: Array.isArray(dashboard.applications) ? dashboard.applications : [],
    tickets: Array.isArray(dashboard.tickets) ? dashboard.tickets : [],
    analytics: dashboard.analytics || emptyDashboardData.analytics,
    currentUser: dashboard.currentUser || null,
  };
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function campaignDaysLeft(ticket) {
  if (ticket?.status !== "Active" || !ticket?.endDate) return null;
  const today = new Date();
  const endDate = new Date(ticket.endDate);
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return Math.ceil((endDate - today) / 86400000);
}

function normalizeExternalUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function formatStatus(value) {
  if (!value) return "Not provided";
  return legacyBrandStatusLabels[value] || value;
}

function brandStatusTone(status) {
  const label = formatStatus(status);
  if (["Deal Won", "Campaign Completed", "Repeat Client", "approved", "qualified"].includes(label)) return "success";
  if (["Lost", "No Response", "Closed"].includes(label)) return "error";
  return "default";
}

function renderDetailValue(record, key, type) {
  const value = record?.[key];

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  if (type === "date") {
    return formatDate(value);
  }

  if (type === "boolean") {
    return value ? "Yes" : "No";
  }

  if (key === "status") {
    return formatStatus(value);
  }

  if (!value) {
    return "Not provided";
  }

  if (type === "email") {
    return <a href={`mailto:${value}`}>{value}</a>;
  }

  if (type === "url") {
  return (
    <a
      href={normalizeExternalUrl(value)}
      target="_blank"
      rel="noopener noreferrer"
      className="
        block
        w-full
        max-w-full
        min-w-0
        whitespace-normal
        break-words
        text-blue-600
        hover:underline
      "
      style={{
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {value}
    </a>
  );
}

if (type === "profiles") {
  const urls =
    String(value).match(/(?:https?:\/\/|www\.)[^\s,]+/gi) || [];

  if (!urls.length) return value;

  return (
    <div
      className="admin-profile-links"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        whiteSpace: "normal",
        overflow: "visible",
      }}
    >
      {urls.map((url, index) => (
        <a
          key={`${url}-${index}`}
          href={normalizeExternalUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            whiteSpace: "normal",
            overflow: "visible",
            overflowWrap: "anywhere",
            wordBreak: "break-all",
            textOverflow: "clip",
            marginBottom: "6px",
          }}
          className="text-blue-600 hover:underline"
        >
          {url}
        </a>
      ))}
    </div>
  );
}
  return value;
}

function RegistrationTableCell({ record, field }) {
  const [, key, type] = field;

  const rawValue = record?.[key];

  const textValue = Array.isArray(rawValue)
    ? rawValue.join(", ")
    : String(rawValue || "");

  const canExpand =
    key !== "categories" && textValue.length > 90;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">

      <div
        className={`
          w-full
          min-w-0
          max-w-full
          whitespace-normal
          break-words
          ${expanded ? "" : "line-clamp-2 overflow-hidden"}
        `}
        style={{
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {renderDetailValue(record, key, type)}
      </div>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="
            mt-1
            text-xs
            font-medium
            text-blue-600
            hover:text-blue-800
            hover:underline
          "
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
function RegistrationStatusButtons({ record, statusOptions, type, onUpdateStatus }) {
  const currentStatus = type === "brands" ? formatStatus(record.status) : record.status;
  const statusTone = (status) => {
    const label = formatStatus(status).toLowerCase();
    if (["approved", "deal won", "campaign started", "campaign completed", "repeat client"].includes(label)) return "success";
    if (["rejected", "lost", "no response", "closed"].includes(label)) return "danger";
    return "warning";
  };
  return (
    <div className="admin-registration-status-buttons">
      {statusOptions.filter((status) => formatStatus(status).toLowerCase() !== "new").map((status) => (
        <button
          className={`${statusTone(status)} ${currentStatus === formatStatus(status) ? "is-active" : ""}`}
          key={status}
          onClick={() => onUpdateStatus(type, record._id, status)}
          type="button"
        >
          {formatStatus(status)}
        </button>
      ))}
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  return <span className={`admin-pill ${tone}`}>{children}</span>;
}

function registrationStatusTone(status) {
  const label = formatStatus(status).toLowerCase();
  if (["approved", "deal won", "campaign started", "campaign completed", "repeat client"].includes(label)) return "success";
  if (["rejected", "lost", "no response", "closed"].includes(label)) return "error";
  return "default";
}

function RegistrationDataTable({
  fields,
  items,
  emptyMessage,
  statusOptions,
  type,
  onUpdateStatus,
}) {
  return (
    <div className="admin-full-data-table-wrap">
      <table className="admin-table admin-full-data-table">
        <thead>
          <tr>
            {fields.map(([label, key]) => (
              <th key={key}>{label}</th>
            ))}
            <th className="admin-actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((record) => (
            <tr key={record._id}>
              {fields.map(([label, key, valueType]) => (
                <td
                  key={key}
                  className="
                    px-4
                    py-5
                    align-top
                  "
                >
                  {key === "status" ? (
                    <Pill tone={registrationStatusTone(record.status)}>
                      {formatStatus(record.status)}
                    </Pill>
                  ) : (
                    <RegistrationTableCell
                      record={record}
                      field={[label, key, valueType]}
                    />
                  )}
                </td>
              ))}

              <td className="admin-actions-column">
                <RegistrationStatusButtons
                  record={record}
                  statusOptions={statusOptions}
                  type={type}
                  onUpdateStatus={onUpdateStatus}
                />
              </td>
            </tr>
          ))}

          {!items.length && (
            <tr>
              <td colSpan={fields.length + 1}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function RegistrationToolbar({ countLabel, filters, onFilterChange, onSearch, onReset, searchPlaceholder, statusOptions, type }) {
  return (
    <form className="admin-registration-toolbar" onSubmit={onSearch}>
      <label>
        Global Search
        <input
          name="search"
          placeholder={searchPlaceholder}
          type="search"
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
        />
      </label>
      <label>
        Status
        <select value={filters.status} onChange={(event) => onFilterChange("status", event.target.value)}>
          <option value="">All Statuses</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>{formatStatus(item)}</option>
          ))}
        </select>
      </label>
      <label>
        Country
        <input placeholder="Country" value={filters.country} onChange={(event) => onFilterChange("country", event.target.value)} />
      </label>
      {type === "brands" ? (
        <label>
          Industry
          <input placeholder="Industry" value={filters.industry} onChange={(event) => onFilterChange("industry", event.target.value)} />
        </label>
      ) : (
        <>
          <label>
            Platform
            <input placeholder="Instagram, YouTube..." value={filters.platform} onChange={(event) => onFilterChange("platform", event.target.value)} />
          </label>
          <label>
            Category
            <input placeholder="Fashion, Beauty..." value={filters.category} onChange={(event) => onFilterChange("category", event.target.value)} />
          </label>
          <label>
            State
            <input placeholder="State / Province" value={filters.state} onChange={(event) => onFilterChange("state", event.target.value)} />
          </label>
          <label>
            Location
            <input placeholder="City" value={filters.location} onChange={(event) => onFilterChange("location", event.target.value)} />
          </label>
          <label>
            Language
            <input placeholder="English, Hindi..." value={filters.language} onChange={(event) => onFilterChange("language", event.target.value)} />
          </label>
          <label>
            Followers From
            <input min="0" placeholder="1000" type="number" value={filters.followerMin} onChange={(event) => onFilterChange("followerMin", event.target.value)} />
          </label>
          <label>
            Followers To
            <input min="0" placeholder="100000" type="number" value={filters.followerMax} onChange={(event) => onFilterChange("followerMax", event.target.value)} />
          </label>
        </>
      )}
      <label>
        From
        <input type="date" value={filters.from} onChange={(event) => onFilterChange("from", event.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={filters.to} onChange={(event) => onFilterChange("to", event.target.value)} />
      </label>
      <button type="submit">Apply</button>
      <button className="admin-filter-reset" type="button" onClick={onReset}>Reset</button>
      <span>{countLabel}</span>
    </form>
  );
}

function RegistrationPager({
  cursorHistory = [],
  hasMore,
  onPrevious,
  onNext,
  meta,
  onPageChange,
}) {
  if (meta) {
    const page = meta.page || 1;
    const totalPages = meta.totalPages || 1;
    const total = meta.total || 0;
    const limit = meta.limit || registrationPageSize;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
      <div className="admin-registration-pager">
        <div className="admin-pager-info">
          <span>
            Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
            <strong>{total}</strong>
          </span>
        </div>

        <div className="admin-pager-controls">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>

          <span className="admin-pager-page">
            Page <strong>{page}</strong> / <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  const currentPage = cursorHistory.length + 1;

  return (
    <div className="admin-registration-pager">
      <div className="admin-pager-info">
        <span>Cursor pagination</span>
      </div>

      <div className="admin-pager-controls">
        <button
          type="button"
          disabled={!cursorHistory.length}
          onClick={onPrevious}
        >
          Previous
        </button>

        <span className="admin-pager-page">
          Page <strong>{currentPage}</strong>
        </span>

        <button
          type="button"
          disabled={!hasMore}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
function AnalyticsChart({ title, items = [], emptyMessage }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const largest = Math.max(...items.map((item) => item.count), 1);

  return (
    <article className="admin-analytics-chart">
      <div className="admin-analytics-chart-heading"><h3>{title}</h3><span>{total} total</span></div>
      {items.length ? <div className="admin-chart-bars">{items.map((item) => <div className="admin-chart-row" key={item._id || "unassigned"}><div><span>{formatStatus(item._id || "Not set")}</span><strong>{item.count}</strong></div><i><b style={{ width: `${(item.count / largest) * 100}%` }} /></i></div>)}</div> : <p>{emptyMessage}</p>}
    </article>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = window.location.hash.replace("#", "");
    return ["overview", "brands", "tickets", "influencers", "csv-creators","upload-csv",  "csv-brands",
  "upload-csv-brands","blogs", "testimonials", "users", "jobs", "applications"].includes(requestedTab) ? requestedTab : "overview";
  });
  const [data, setData] = useState(emptyDashboardData);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [editingBlogId, setEditingBlogId] = useState("");
  const [userForm, setUserForm] = useState(initialUserForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [editingUserId, setEditingUserId] = useState("");
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [editingJobId, setEditingJobId] = useState("");
  const [ticketForm, setTicketForm] = useState(initialTicketForm);
  const [editingTicketId, setEditingTicketId] = useState("");
  const [expandedCoverLetters, setExpandedCoverLetters] = useState(() => new Set());
  const [expandedCandidates, setExpandedCandidates] = useState(() => new Set());
  const [brandFilters, setBrandFilters] = useState({ search: "", status: "", country: "", industry: "", from: "", to: "" });
  const [influencerFilters, setInfluencerFilters] = useState({ search: "", status: "", country: "", state: "", location: "", language: "", platform: "", category: "", followerMin: "", followerMax: "", from: "", to: "" });
  const [brandQuery, setBrandQuery] = useState({ search: "", status: "", country: "", industry: "", from: "", to: "" });
  const [influencerQuery, setInfluencerQuery] = useState({ search: "", status: "", country: "", state: "", location: "", language: "", platform: "", category: "", followerMin: "", followerMax: "", from: "", to: "" });
  const [brandTable, setBrandTable] = useState({ items: [], hasMore: false, nextCursor: null, history: [] });
  const [influencerTable, setInfluencerTable] = useState({ items: [], hasMore: false, nextCursor: null, history: [] });
  const [candidateFilters, setCandidateFilters] = useState({ search: "", status: "", jobId: "", page: 1 });
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(hasAdminSession);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const tabs = useMemo(
    () => [
      ["overview", "Dashboard"],
      ["brands", `Brands (${data.stats.brands || 0})`],
      ["tickets", `Brand tickets (${data.stats.tickets || 0})`],
      ["influencers", `Influencers (${data.stats.influencers || 0})`],
       ["csv-creators", `CSV Creators`],
       ["upload-csv", `CSV  Upload Creators`],
       ["csv-brands", `CSV Brands`],
       ["upload-csv-brands", `CSV Upload Brands`],
      ["blogs", `Blogs (${data.blogs.length})`],
      ["testimonials", `Testimonials (${data.testimonials.length})`],
      ["jobs", `Jobs (${data.jobs.length})`],
      ["applications", `Candidates (${data.applications.length})`],
      ["users", `Users (${data.users.length})`],
    ],
    [data]
  );

  const dashboardParams = useMemo(
    () => ({
      candidateSearch: candidateFilters.search.trim(),
      candidateStatus: candidateFilters.status,
      candidateJobId: candidateFilters.jobId.trim(),
      candidatePage: candidateFilters.page,
      candidateLimit: candidatePageSize,
    }),
    [candidateFilters]
  );

  const loadDashboard = async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setStatus({ type: "loading", message: "Loading dashboard..." });
    }

    try {
      const dashboard = await getAdminDashboard(dashboardParams);
      setData(normalizeDashboardData(dashboard));
      setIsAuthenticated(true);
      setStatus({ type: "success", message: "" });
    } catch (error) {
      if (error.message === "Admin token is required.") {
        setIsAuthenticated(false);
      }
      setStatus({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      getAdminDashboard(dashboardParams)
        .then((dashboard) => {
          if (active) {
            setData(normalizeDashboardData(dashboard));
            setStatus({ type: "success", message: "" });
          }
        })
        .catch((error) => {
          if (active) {
            if (error.message === "Admin token is required.") {
              setIsAuthenticated(false);
            }
            setStatus({ type: "error", message: error.message });
          }
        });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [dashboardParams, isAuthenticated]);

  const loadRegistrationTable = async (type, filters, after = null, history = []) => {
    try {
      const result = await getAdminRegistrations(type, { ...filters, limit: registrationPageSize, after });
      const next = { items: result.items || [], hasMore: Boolean(result.pagination?.hasMore), nextCursor: result.pagination?.nextCursor || null, history };
      if (type === "brands") setBrandTable(next);
      else setInfluencerTable(next);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "brands") return;
    loadRegistrationTable("brands", brandQuery);
  }, [activeTab, brandQuery, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "influencers") return;
    loadRegistrationTable("influencers", influencerQuery);
  }, [activeTab, influencerQuery, isAuthenticated]);

  const updateStatus = async (type, id, nextStatus) => {
    try {
      await updateRegistrationStatus(type, id, nextStatus);
      await loadDashboard();
      if (type === "brands") await loadRegistrationTable("brands", brandQuery);
      if (type === "influencers") await loadRegistrationTable("influencers", influencerQuery);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const updateReviewStatus = async (id, nextStatus) => {
    try {
      await updateTestimonialStatus(id, nextStatus);
      await loadDashboard();
      setActiveTab("testimonials");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const updateBlogField = (event) => {
    const { name, value } = event.target;
    setBlogForm((current) => ({ ...current, [name]: value }));
  };

  const updateUserField = (event) => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const updatePasswordField = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };
  const updateJobField = (event) => setJobForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateTicketField = (event) => setTicketForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateTicketMetric = (event) => setTicketForm((current) => ({ ...current, metrics: { ...current.metrics, [event.target.name]: event.target.value } }));
  const submitTicket = async (event) => { event.preventDefault(); setStatus({ type: "loading", message: editingTicketId ? "Updating brand ticket..." : "Creating brand ticket..." }); try { if (editingTicketId) await updateBrandTicket(editingTicketId, ticketForm); else await createBrandTicket(ticketForm); setTicketForm(initialTicketForm); setEditingTicketId(""); await loadDashboard(); setActiveTab("tickets"); setStatus({ type: "success", message: editingTicketId ? "Brand ticket updated." : "Brand ticket created." }); } catch (error) { setStatus({ type: "error", message: error.message }); } };
  const editTicket = (ticket) => { setEditingTicketId(ticket._id); setTicketForm({ ...initialTicketForm, ...ticket, startDate: ticket.startDate ? ticket.startDate.slice(0, 10) : "", endDate: ticket.endDate ? ticket.endDate.slice(0, 10) : "", platforms: (ticket.platforms || []).join(", "), metrics: { ...initialTicketForm.metrics, ...(ticket.metrics || {}) } }); setActiveTab("tickets"); };
  const removeTicket = async (id) => { if (!window.confirm("Delete this brand ticket?")) return; try { await deleteBrandTicket(id); if (editingTicketId === id) { setEditingTicketId(""); setTicketForm(initialTicketForm); } await loadDashboard(); setStatus({ type: "success", message: "Brand ticket deleted." }); } catch (error) { setStatus({ type: "error", message: error.message }); } };
  const submitJob = async (event) => { event.preventDefault(); setStatus({ type: "loading", message: editingJobId ? "Updating job..." : "Posting job..." }); try { if (editingJobId) await updateJob(editingJobId, jobForm); else await createJob(jobForm); setJobForm(initialJobForm); setEditingJobId(""); await loadDashboard(); setActiveTab("jobs"); setStatus({ type: "success", message: "Job saved." }); } catch (error) { setStatus({ type: "error", message: error.message }); } };
  const editJob = (job) => { setEditingJobId(job._id); setJobForm({ ...initialJobForm, ...job, jobId: job.jobId || "", responsibilities: (job.responsibilities || []).join("\n"), requirements: (job.requirements || []).join("\n") }); setActiveTab("jobs"); };
  const removeJob = async (id) => { if (!window.confirm("Delete this job post?")) return; try { await deleteJob(id); await loadDashboard(); setStatus({ type: "success", message: "Job deleted." }); } catch (error) { setStatus({ type: "error", message: error.message }); } };
  const updateCandidateStatus = async (id, nextStatus) => { try { const result = await updateJobApplicationStatus(id, nextStatus); await loadDashboard({ showLoading: false }); const message = result.email?.sent ? "Status updated and email sent to the candidate." : result.email?.reason ? `Status updated, but the email was not sent: ${result.email.reason}` : result.email?.skipped ? "Status updated. Email is skipped because SendGrid is not configured." : "Candidate status updated."; setStatus({ type: result.email?.reason ? "error" : "success", message }); } catch (error) { setStatus({ type: "error", message: error.message }); } };
  const updateCandidateFilter = (field, value) => setCandidateFilters((current) => ({ ...current, [field]: value, page: 1 }));
  const changeCandidatePage = (page) => setCandidateFilters((current) => ({ ...current, page }));
  const toggleCoverLetter = (id) => setExpandedCoverLetters((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleCandidate = (id) => setExpandedCandidates((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const submitLogin = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Signing in..." });

    try {
      await loginAdmin({ email: loginEmail, password });
      setLoginEmail("");
      setPassword("");
      setIsAuthenticated(true);
      await loadDashboard({ showLoading: false });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const logout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPassword("");
    setData(emptyDashboardData);
    setStatus({ type: "idle", message: "" });
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: editingBlogId ? "Updating blog post..." : "Saving blog post..." });

    try {
      if (editingBlogId) {
        await updateBlogPost(editingBlogId, blogForm);
      } else {
        await createBlogPost(blogForm);
      }
      setBlogForm(initialBlogForm);
      setEditingBlogId("");
      await loadDashboard();
      setActiveTab("blogs");
      setStatus({ type: "success", message: editingBlogId ? "Blog post updated." : "Blog post saved." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const editBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || "",
      category: blog.category || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "Influnexa Team",
      readTime: blog.readTime || "5 min read",
      coverImage: blog.coverImage || "",
      status: blog.status || "published",
    });
    setActiveTab("blogs");
  };

  const cancelBlogEdit = () => {
    setEditingBlogId("");
    setBlogForm(initialBlogForm);
  };

  const selectTab = (id) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const updateBrandFilter = (field, value) => setBrandFilters((current) => ({ ...current, [field]: value }));

  const updateInfluencerFilter = (field, value) => setInfluencerFilters((current) => ({ ...current, [field]: value }));

  const applyRegistrationSearch = (event) => {
    event.preventDefault();
    if (activeTab === "brands") setBrandQuery({ ...brandFilters });
    else if (activeTab === "influencers") setInfluencerQuery({ ...influencerFilters });
    else loadDashboard();
  };

  const resetRegistrationFilters = () => {
    if (activeTab === "brands") {
      const cleared = { search: "", status: "", country: "", industry: "", from: "", to: "" };
      setBrandFilters(cleared);
      setBrandQuery(cleared);
    }
    if (activeTab === "influencers") {
      const cleared = { search: "", status: "", country: "", state: "", location: "", language: "", platform: "", category: "", followerMin: "", followerMax: "", from: "", to: "" };
      setInfluencerFilters(cleared);
      setInfluencerQuery(cleared);
    }
  };

  const nextBrandPage = () => loadRegistrationTable("brands", brandQuery, brandTable.nextCursor, [...brandTable.history, brandTable.nextCursor]);
  const previousBrandPage = () => { const history = brandTable.history.slice(0, -1); loadRegistrationTable("brands", brandQuery, history.at(-1) || null, history); };
  const nextInfluencerPage = () => loadRegistrationTable("influencers", influencerQuery, influencerTable.nextCursor, [...influencerTable.history, influencerTable.nextCursor]);
  const previousInfluencerPage = () => { const history = influencerTable.history.slice(0, -1); loadRegistrationTable("influencers", influencerQuery, history.at(-1) || null, history); };

  const submitUser = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: editingUserId ? "Updating team member..." : "Adding team member..." });

    try {
      const payload = { ...userForm };

      if (editingUserId) {
        delete payload.password;
      }

      if (editingUserId) {
        await updateAdminUser(editingUserId, payload);
      } else {
        await createAdminUser(payload);
      }

      setUserForm(initialUserForm);
      setEditingUserId("");
      await loadDashboard();
      setActiveTab("users");
      setStatus({ type: "success", message: editingUserId ? "Team member updated." : "Team member added." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setStatus({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    setStatus({ type: "loading", message: "Updating password..." });

    try {
      await updateOwnAdminPassword({
        currentPassword: passwordForm.currentPassword,
        password: passwordForm.password,
      });
      setPasswordForm(initialPasswordForm);
      await loadDashboard({ showLoading: false });
      setStatus({ type: "success", message: "Your password has been updated." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const editUser = (user) => {
    setEditingUserId(user._id);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "admin",
      status: user.status || "active",
    });
    setActiveTab("users");
  };

  const cancelUserEdit = () => {
    setEditingUserId("");
    setUserForm(initialUserForm);
  };

  const removeUser = async (id) => {
    try {
      await deleteAdminUser(id);
      await loadDashboard();
      setStatus({ type: "success", message: "Team member removed." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const removeBlog = async (id) => {
    try {
      await deleteBlogPost(id);
      if (editingBlogId === id) {
        setEditingBlogId("");
        setBlogForm(initialBlogForm);
      }
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const removeTestimonial = async (id) => {
    try {
      await deleteTestimonial(id);
      await loadDashboard();
      setActiveTab("testimonials");
      setStatus({ type: "success", message: "Testimonial removed." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const editingUser = data.users.find((user) => user._id === editingUserId);
  const isEditingOwner = editingUser?.role === "owner";
  const currentUserRole = data.currentUser?.role || "admin";
  const canManageUsers = currentUserRole === "owner" || currentUserRole === "admin";

  if (!isAuthenticated) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <a className="admin-logo" href="/">
            <span className="admin-logo-frame">
              <img src={influnexaLogo} alt="Influnexa" />
            </span>
            <span className="admin-logo-copy">
              <strong>Influnexa</strong>
              <small>Admin</small>
            </span>
          </a>
          <div className="admin-login-copy">
            <p>Secure access</p>
            <h1>Admin login</h1>
            <span>Sign in with your admin email and password. First setup can use the existing env admin password.</span>
          </div>
          <form className="admin-login-form" onSubmit={submitLogin}>
            <label>
              Admin email
              <input
                autoComplete="email"
                name="email"
                placeholder="owner@influnexa.com"
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                name="password"
                placeholder="Enter admin password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {status.message && <div className={`admin-status ${status.type}`}>{status.message}</div>}
            <div className="admin-login-actions">
              <button type="submit">Login</button>
              <a className="admin-home-link" href="/">Back to website</a>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/">
          <span className="admin-logo-frame">
            <img src={influnexaLogo} alt="Influnexa" />
          </span>
          <span className="admin-logo-copy">
            <strong>Influnexa</strong>
            <small>Admin</small>
          </span>
        </a>
        <nav>
          {tabs.map(([id, label]) => (
            <button
              key={id}
              className={activeTab === id ? "active" : ""}
              type="button"
              onClick={() => selectTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <a className="admin-home-link" href="/">Back to website</a>
      </aside>

      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p>Influnexa workspace</p>
            <h1>{activeTab === "overview" ? "Operations overview" : tabs.find(([id]) => id === activeTab)?.[1] || "Admin workspace"}</h1>
          </div>
          <div className="admin-actions">
            <button className="admin-action-button refresh" type="button" onClick={loadDashboard}>
              Refresh
            </button>
            <button className="admin-action-button logout" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {status.message && <div className={`admin-status ${status.type}`}>{status.message}</div>}

        {activeTab === "overview" && (
          <div className="admin-overview">
            <section className="admin-overview-hero">
              <div><p>Operations overview</p><h2>Everything that needs attention, in one place.</h2><span>Track incoming leads, creator registrations, active vacancies, and candidate decisions without switching between tabs.</span></div>
              <div className="admin-overview-priority"><span>Needs review</span><strong>{(data.stats.newBrands || 0) + (data.stats.newInfluencers || 0) + (data.stats.reviewApplications || 0)}</strong><small>new brands, creators & candidates</small></div>
            </section>
            <section className="admin-overview-metrics"><article><span>Active jobs</span><strong>{data.analytics.jobStatuses.find((item) => item._id === "open")?.count || 0}</strong><small>live opportunities</small></article><article><span>Candidates</span><strong>{data.stats.applications || 0}</strong><small>{data.stats.reviewApplications || 0} awaiting review</small></article><article><span>Brand leads</span><strong>{data.stats.brands || 0}</strong><small>{data.stats.newBrands || 0} new requests</small></article><article><span>Active campaigns</span><strong>{data.stats.activeTickets || 0}</strong><small>{data.stats.tickets || 0} brand tickets</small></article><article><span>Creators</span><strong>{data.stats.influencers || 0}</strong><small>{data.stats.newInfluencers || 0} new registrations</small></article><article>
  <span>CSV Creators</span>
  <strong>{data.stats.csvRecords || 0}</strong>
  <small>total CSV upload records</small>
</article></section>
            <section className="admin-analytics-grid">
              <AnalyticsChart title="Candidate pipeline" items={data.analytics.applicationStatuses} emptyMessage="Candidate activity will appear here." />
              <AnalyticsChart title="Open job management" items={data.analytics.jobStatuses} emptyMessage="Create a job post to see its status." />
              <AnalyticsChart title="Brand pipeline" items={data.analytics.brandStatuses} emptyMessage="Brand registrations will appear here." />
              <AnalyticsChart title="Brand campaign tickets" items={data.analytics.ticketStatuses} emptyMessage="Create a brand ticket to see campaign analysis." />
              <AnalyticsChart title="Creator pipeline" items={data.analytics.influencerStatuses} emptyMessage="Creator registrations will appear here." />
            </section>
            <section className="admin-panel admin-overview-quick-actions"><div><h2>Quick actions</h2><p>Jump directly to your most common tasks.</p></div><div><button type="button" onClick={() => selectTab("tickets")}>Manage campaigns</button><button type="button" onClick={() => selectTab("applications")}>Review candidates</button><button type="button" onClick={() => selectTab("brands")}>View brand leads</button></div></section>
          </div>
        )}

        {activeTab === "brands" && (
          <div className="admin-panel">
            <div className="admin-panel-title-row">
              <h2>Brand registrations</h2>
            </div>
            <RegistrationToolbar
              countLabel="Fast server-side filters"
              filters={brandFilters}
              onFilterChange={updateBrandFilter}
              onSearch={applyRegistrationSearch}
              onReset={resetRegistrationFilters}
              searchPlaceholder="Company, contact, email, industry..."
              statusOptions={brandStatuses}
              type="brands"
            />
            <RegistrationDataTable fields={brandDetailFields} items={brandTable.items} emptyMessage="No brand registrations match these filters." statusOptions={brandStatuses} type="brands" onUpdateStatus={updateStatus} />
            <RegistrationPager cursorHistory={brandTable.history} hasMore={brandTable.hasMore} onPrevious={previousBrandPage} onNext={nextBrandPage} />
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="admin-ticket-workspace">
            <form className="admin-panel admin-blog-form" onSubmit={submitTicket}>
              <div className="admin-panel-title-row"><h2>{editingTicketId ? "Edit brand ticket" : "Create brand ticket"}</h2><small>Create an internal campaign record and keep its delivery metrics current.</small></div>
              <div className="admin-form-row"><label>Brand name<input name="brandName" value={ticketForm.brandName} onChange={updateTicketField} required /></label><label>Campaign name<input name="campaignName" value={ticketForm.campaignName} onChange={updateTicketField} required /></label></div>
              <div className="admin-form-row"><label>Contact name<input name="contactName" value={ticketForm.contactName} onChange={updateTicketField} /></label><label>Contact email<input name="contactEmail" type="email" value={ticketForm.contactEmail} onChange={updateTicketField} /></label></div>
              <label>Campaign objective<textarea name="objective" value={ticketForm.objective} onChange={updateTicketField} rows="2" placeholder="Awareness, product launch, conversions..." /></label>
              <div className="admin-form-row"><label>Platforms <input name="platforms" value={ticketForm.platforms} onChange={updateTicketField} placeholder="Instagram, YouTube" /></label><label>Status<select name="status" value={ticketForm.status} onChange={updateTicketField}>{ticketStatuses.map((item) => <option key={item}>{item}</option>)}</select></label></div>
              <div className="admin-form-row"><label>Start date<input name="startDate" type="date" value={ticketForm.startDate} onChange={updateTicketField} /></label><label>End date<input name="endDate" type="date" value={ticketForm.endDate} onChange={updateTicketField} /></label></div>
              <div className="admin-form-row"><label>Budget<input min="0" name="budget" type="number" value={ticketForm.budget} onChange={updateTicketField} /></label><label>Currency<input name="currency" value={ticketForm.currency} onChange={updateTicketField} /></label></div>
              <h3 className="admin-ticket-subheading">Campaign performance</h3>
              <div className="admin-ticket-metrics">{[["creators", "Creators"], ["posts", "Posts"], ["reach", "Reach"], ["impressions", "Impressions"], ["engagements", "Engagements"], ["clicks", "Clicks"], ["conversions", "Conversions"], ["spend", "Spend"]].map(([key, label]) => <label key={key}>{label}<input min="0" name={key} type="number" value={ticketForm.metrics[key]} onChange={updateTicketMetric} /></label>)}</div>
              <label>Internal notes<textarea name="notes" value={ticketForm.notes} onChange={updateTicketField} rows="3" /></label>
              <div className="admin-login-actions"><button type="submit">{editingTicketId ? "Update Ticket" : "Create Ticket"}</button>{editingTicketId && <button type="button" onClick={() => { setEditingTicketId(""); setTicketForm(initialTicketForm); }}>Cancel</button>}</div>
            </form>
            <div className="admin-ticket-side">
              <section className="admin-panel"><div className="admin-panel-title-row"><h2>Campaign analysis</h2><small>{data.stats.activeTickets || 0} active</small></div><AnalyticsChart title="Ticket status" items={data.analytics.ticketStatuses} emptyMessage="Create a ticket to see campaign status analysis." /><div className="admin-ticket-summary"><article><span>Total reach</span><strong>{data.tickets.reduce((sum, ticket) => sum + (ticket.metrics?.reach || 0), 0).toLocaleString()}</strong></article><article><span>Total engagements</span><strong>{data.tickets.reduce((sum, ticket) => sum + (ticket.metrics?.engagements || 0), 0).toLocaleString()}</strong></article><article><span>Conversions</span><strong>{data.tickets.reduce((sum, ticket) => sum + (ticket.metrics?.conversions || 0), 0).toLocaleString()}</strong></article></div></section>
              <section className="admin-panel"><h2>Brand campaign tickets</h2><div className="admin-blog-list">{data.tickets.map((ticket) => { const metrics = ticket.metrics || {}; const engagementRate = metrics.impressions ? ((metrics.engagements || 0) / metrics.impressions * 100).toFixed(2) : "0.00"; const daysLeft = campaignDaysLeft(ticket); return <article key={ticket._id}><div><Pill tone={ticket.status === "Completed" || ticket.status === "Active" ? "success" : ticket.status === "Cancelled" ? "error" : "default"}>{ticket.status}</Pill>{daysLeft !== null && <Pill tone={daysLeft < 0 ? "error" : daysLeft <= 3 ? "default" : "success"}>{daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? "Ends today" : `${daysLeft} days left`}</Pill>}<h3>{ticket.ticketNumber} · {ticket.brandName}</h3><p>{ticket.campaignName}</p><span>{ticket.platforms?.join(", ") || "No platforms"} · {formatDate(ticket.startDate)} — {formatDate(ticket.endDate)}</span><small>Reach {Number(metrics.reach || 0).toLocaleString()} · Engagement {engagementRate}% · {Number(metrics.conversions || 0).toLocaleString()} conversions</small></div><div className="admin-row-actions"><button type="button" onClick={() => editTicket(ticket)}>Edit</button><button type="button" onClick={() => removeTicket(ticket._id)}>Delete</button></div></article>; })}{data.tickets.length === 0 && <p>No brand tickets yet. Create one to manage a campaign from brief to results.</p>}</div></section>
            </div>
          </div>
        )}

        {activeTab === "influencers" && (
          <div className="admin-panel">
            <div className="admin-panel-title-row">
              <h2>Influencer registrations</h2>
              <small>Find creators by name, email, market, platform, category, or status.</small>
            </div>
            <RegistrationToolbar
              filters={influencerFilters}
              onFilterChange={updateInfluencerFilter}
              onSearch={applyRegistrationSearch}
              onReset={resetRegistrationFilters}
              searchPlaceholder="Creator, email, country, platform..."
              statusOptions={influencerStatuses}
              type="influencers"
            />
            <RegistrationDataTable fields={influencerDetailFields} items={influencerTable.items} emptyMessage="No influencer registrations match these filters." statusOptions={influencerStatuses} type="influencers" onUpdateStatus={updateStatus} />
            <RegistrationPager cursorHistory={influencerTable.history} hasMore={influencerTable.hasMore} onPrevious={previousInfluencerPage} onNext={nextInfluencerPage} />
          </div>
        )}

{activeTab === "csv-creators" && (
  <CsvCreatorSection />
)}

{activeTab === "upload-csv" && (
  <UploadCreatorsCSV />
)}

{activeTab === "csv-brands" && (
  <CsvBrandSection />
)}

{activeTab === "upload-csv-brands" && (
  <UploadBrandsCSV />
)}
        {activeTab === "blogs" && (
          <div className="admin-blog-grid">
            <form className="admin-panel admin-blog-form" onSubmit={submitBlog}>
              <h2>{editingBlogId ? "Edit blog post" : "Create blog post"}</h2>
              <label>Title<input name="title" value={blogForm.title} onChange={updateBlogField} required /></label>
              <label>Category<input name="category" value={blogForm.category} onChange={updateBlogField} required /></label>
              <label>Excerpt<textarea name="excerpt" value={blogForm.excerpt} onChange={updateBlogField} required rows="3" /></label>
              <label>
                Content
                <textarea
                  name="content"
                  value={blogForm.content}
                  onChange={updateBlogField}
                  rows="10"
                  placeholder={"Use headings and lists, for example:\n\n## Main heading\nParagraph text here.\n\n### Subheading\n- Bullet point\n- Bullet point\n\n1. Numbered step\n2. Numbered step"}
                />
                <small className="admin-field-note">Supported formatting: ## section heading, ### subheading, - bullet list, and 1. numbered list. Keep headings and list items on their own lines.</small>
              </label>
              <div className="admin-form-row">
                <label>Author<input name="author" value={blogForm.author} onChange={updateBlogField} /></label>
                <label>Read time<input name="readTime" value={blogForm.readTime} onChange={updateBlogField} /></label>
              </div>
              <label>Cover image URL<input name="coverImage" value={blogForm.coverImage} onChange={updateBlogField} /></label>
              <label>Status<select name="status" value={blogForm.status} onChange={updateBlogField}>
                <option>published</option>
                <option>draft</option>
              </select></label>
              <div className="admin-login-actions">
                <button type="submit">{editingBlogId ? "Update Blog" : "Create Blog"}</button>
                {editingBlogId && <button type="button" onClick={cancelBlogEdit}>Cancel</button>}
              </div>
            </form>

            <div className="admin-panel">
              <h2>Blog posts</h2>
              <div className="admin-blog-list">
                {data.blogs.map((blog) => (
                  <article key={blog._id}>
                    <div>
                      <Pill tone={blog.status === "published" ? "success" : "default"}>{blog.status}</Pill>
                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt}</p>
                      <span>{blog.category} - {blog.readTime} - {formatDate(blog.publishedAt)}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => editBlog(blog)}>Edit</button>
                      <button type="button" onClick={() => removeBlog(blog._id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="admin-blog-grid">
            <form className="admin-panel admin-blog-form" onSubmit={submitJob}>
              <h2>{editingJobId ? "Edit job post" : "Post a new job"}</h2>
              <div className="admin-form-row"><label>Job ID<input value={editingJobId ? jobForm.jobId : "Auto-generated (INX-00001)"} readOnly /></label><label>Role title<input name="title" value={jobForm.title} onChange={updateJobField} required /></label></div>
              <div className="admin-form-row"><label>Department<input name="department" value={jobForm.department} onChange={updateJobField} required /></label><label>Employment type<select name="type" value={jobForm.type} onChange={updateJobField}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></label></div>
              <div className="admin-form-row"><label>Location<input name="location" value={jobForm.location} onChange={updateJobField} required /></label><label>Experience<input name="experience" value={jobForm.experience} onChange={updateJobField} required /></label></div>
              <label>Short summary<textarea name="summary" value={jobForm.summary} onChange={updateJobField} rows="2" required /></label><label>Job description<textarea name="description" value={jobForm.description} onChange={updateJobField} rows="4" required /></label><label>Responsibilities <small>(one per line)</small><textarea name="responsibilities" value={jobForm.responsibilities} onChange={updateJobField} rows="4" /></label><label>Requirements <small>(one per line)</small><textarea name="requirements" value={jobForm.requirements} onChange={updateJobField} rows="4" /></label><label>Status<select name="status" value={jobForm.status} onChange={updateJobField}><option value="open">Open</option><option value="draft">Draft</option><option value="closed">Closed</option></select></label><div className="admin-login-actions"><button type="submit">{editingJobId ? "Update Job" : "Post Job"}</button>{editingJobId && <button type="button" onClick={() => { setEditingJobId(""); setJobForm(initialJobForm); }}>Cancel</button>}</div>
            </form>
            <div className="admin-panel"><h2>Job posts</h2><div className="admin-blog-list">{data.jobs.map((job) => <article key={job._id}><div><Pill tone={job.status === "open" ? "success" : "default"}>{job.status}</Pill><h3>{job.jobId} · {job.title}</h3><p>{job.department} · {job.location} · {job.type}</p></div><div className="admin-row-actions"><button type="button" onClick={() => editJob(job)}>Edit</button><button type="button" onClick={() => removeJob(job._id)}>Delete</button></div></article>)}{data.jobs.length === 0 && <p>No job posts yet.</p>}</div></div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="admin-panel"><div className="admin-panel-title-row"><h2>Job candidates</h2><small>Review applications, open resumes, and update candidate status.</small></div><form className="admin-registration-toolbar" onSubmit={applyRegistrationSearch}><label>Search<input placeholder="Name, email, mobile, role..." type="search" value={candidateFilters.search} onChange={(event) => updateCandidateFilter("search", event.target.value)} /></label><label>Job ID<input placeholder="INX-00001" value={candidateFilters.jobId} onChange={(event) => updateCandidateFilter("jobId", event.target.value)} /></label><label>Status<select value={candidateFilters.status} onChange={(event) => updateCandidateFilter("status", event.target.value)}><option value="">All statuses</option>{applicationStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><button type="submit">Apply</button><span>{data.pagination.applications.total || 0} matching candidates</span></form><div className="admin-candidate-list">{data.applications.map((application) => <article className={`admin-candidate-card ${expandedCandidates.has(application._id) ? "is-expanded" : ""}`} key={application._id}><div className="admin-candidate-heading"><div><Pill tone={application.status === "Selected" ? "success" : application.status === "Rejected" ? "error" : "default"}>{application.status}</Pill><h3>{application.name}</h3><p>{application.jobTitle} <strong>· {application.jobId}</strong></p></div><div className="candidate-card-actions"><label>Candidate status<select aria-label={`Update ${application.name} status`} value={application.status} onChange={(event) => updateCandidateStatus(application._id, event.target.value)}>{applicationStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><button className="candidate-expand-button" type="button" onClick={() => toggleCandidate(application._id)}>{expandedCandidates.has(application._id) ? "Collapse" : "View details"}</button></div></div>{expandedCandidates.has(application._id) && <dl className="admin-candidate-details"><div><dt>Email</dt><dd><a href={`mailto:${application.email}`}>{application.email}</a></dd></div><div><dt>Mobile number</dt><dd><a href={`tel:${application.phone}`}>{application.phone}</a></dd></div><div><dt>Experience</dt><dd>{application.experience || "Not provided"}</dd></div><div><dt>Passing year</dt><dd>{application.passingYear || "Not provided"}</dd></div><div><dt>Applied on</dt><dd>{formatDate(application.createdAt)}</dd></div><div><dt>Resume</dt><dd>{application.resumeData ? <a href={application.resumeData} download={application.resumeName}>Download {application.resumeName}</a> : "Not uploaded"}</dd></div><div className="wide"><dt>Address</dt><dd>{application.address || "Not provided"}</dd></div><div className="wide"><dt>Cover letter</dt><dd className={expandedCoverLetters.has(application._id) ? "cover-letter-expanded" : "cover-letter-preview"}>{application.coverLetter || "Not provided"}</dd>{application.coverLetter && application.coverLetter.length > 180 && <button className="cover-letter-toggle" type="button" onClick={() => toggleCoverLetter(application._id)}>{expandedCoverLetters.has(application._id) ? "Show less" : "Read full letter"}</button>}</div></dl>}</article>)}{data.applications.length === 0 && <p>No applications yet.</p>}</div><RegistrationPager meta={data.pagination.applications} onPageChange={changeCandidatePage} /></div>
        )}

        {activeTab === "testimonials" && (
          <div className="admin-panel">
            <h2>Testimonial approvals</h2>
            <div className="admin-blog-list">
              {data.testimonials.map((testimonial) => (
                <article key={testimonial._id}>
                  <div>
                    <Pill tone={testimonial.status === "approved" ? "success" : testimonial.status === "rejected" ? "error" : "default"}>
                      {testimonial.status}
                    </Pill>
                    <h3>{testimonial.name}</h3>
                    <p>"{testimonial.quote}"</p>
                    <span>
                      {testimonial.role} - {testimonial.email || "No email"} - {testimonial.rating || 5}.0 rating - {formatDate(testimonial.createdAt)}
                    </span>
                  </div>
                  <div className="admin-row-actions">
                    <select
                      value={testimonial.status}
                      onChange={(event) => updateReviewStatus(testimonial._id, event.target.value)}
                    >
                      {testimonialStatuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <button type="button" onClick={() => removeTestimonial(testimonial._id)}>Delete</button>
                  </div>
                </article>
              ))}
              {data.testimonials.length === 0 && (
                <article>
                  <div>
                    <h3>No testimonials yet</h3>
                    <p>Submitted reviews will appear here for approval.</p>
                  </div>
                </article>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-blog-grid">
            <form className="admin-panel admin-blog-form" onSubmit={submitPassword}>
              <h2>Change my password</h2>
              <label>
                Current password
                <input
                  autoComplete="current-password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={updatePasswordField}
                  required
                />
              </label>
              <label>
                New password
                <input
                  name="password"
                  autoComplete="new-password"
                  type="password"
                  value={passwordForm.password}
                  onChange={updatePasswordField}
                  required
                  placeholder="Minimum 8 characters"
                />
              </label>
              <label>
                Confirm new password
                <input
                  autoComplete="new-password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={updatePasswordField}
                  required
                />
              </label>
              <div className="admin-login-actions">
                <button type="submit">Update Password</button>
              </div>
            </form>

            {canManageUsers ? (
              <>
                <form className="admin-panel admin-blog-form" onSubmit={submitUser}>
                  <h2>{editingUserId ? "Edit team member" : "Add team member"}</h2>
                  <label>Name<input name="name" value={userForm.name} onChange={updateUserField} required /></label>
                  <label>Email<input name="email" type="email" value={userForm.email} onChange={updateUserField} required /></label>
                  {!editingUserId && (
                    <label>
                      Initial password
                      <input
                        autoComplete="new-password"
                        name="password"
                        type="password"
                        value={userForm.password}
                        onChange={updateUserField}
                        required
                        placeholder="Minimum 8 characters"
                      />
                    </label>
                  )}
                  <div className="admin-form-row">
                    <label>Role<select name="role" value={userForm.role} onChange={updateUserField} disabled={isEditingOwner}>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      {(currentUserRole === "owner" || userForm.role === "owner") && <option value="owner">Owner</option>}
                    </select></label>
                    <label>Status<select name="status" value={userForm.status} onChange={updateUserField} disabled={isEditingOwner}>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select></label>
                  </div>
                  <p className="admin-owner-help">
                    Passwords can only be changed by the signed-in user from the password form.
                  </p>
                  {isEditingOwner && <p className="admin-owner-help">Owner role and active access are protected.</p>}
                  <div className="admin-login-actions">
                    <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
                    {editingUserId && <button type="button" onClick={cancelUserEdit}>Cancel</button>}
                  </div>
                </form>

                <div className="admin-panel">
                  <h2>Team access</h2>
                  <div className="admin-blog-list admin-user-list">
                    {data.users.map((user) => (
                      <article key={user._id}>
                        <div>
                          <Pill tone={user.status === "active" ? "success" : "default"}>{user.status}</Pill>
                          <h3>{user.name}</h3>
                          <p>{user.email}</p>
                          <span>{user.role} - Last login: {formatDate(user.lastLoginAt)}</span>
                        </div>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editUser(user)}>Edit</button>
                          {user.role === "owner" ? (
                            <span className="admin-protected-note">Protected owner</span>
                          ) : (
                            <button type="button" onClick={() => removeUser(user._id)}>Delete</button>
                          )}
                        </div>
                      </article>
                    ))}
                    {data.users.length === 0 && (
                      <article>
                        <div>
                          <h3>No team members yet</h3>
                          <p>Add your first admin user from this form.</p>
                        </div>
                      </article>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-panel">
                <h2>Team access</h2>
                <div className="admin-blog-list admin-user-list">
                  <article>
                    <div>
                      <Pill tone="default">{currentUserRole}</Pill>
                      <h3>{data.currentUser?.name || "Team member"}</h3>
                      <p>{data.currentUser?.email || "Signed-in user"}</p>
                      <span>Owner and admin users can add or manage team access.</span>
                    </div>
                  </article>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
