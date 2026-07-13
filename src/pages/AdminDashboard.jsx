import { useEffect, useMemo, useState } from "react";
import {
  createBlogPost,
  createAdminUser,
  deleteAdminUser,
  deleteBlogPost,
  deleteTestimonial,
  getAdminDashboard,
  loginAdmin,
  logoutAdmin,
  updateAdminUser,
  updateOwnAdminPassword,
  updateRegistrationStatus,
  updateTestimonialStatus,
} from "../lib/api";
import influnexaLogo from "../assets/influnexa-logo.png";

const brandStatuses = [
  "New",
  "Under Review",
  "Contacted",
  "Follow-up 1",
  "Follow-up 2",
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
  ["Contact name", "contactName"],
  ["Email", "email", "email"],
  ["Phone", "phone"],
  ["Company name", "companyName"],
  ["Website", "website", "url"],
  ["Country", "country"],
  ["Industry", "industry"],
  ["Product name", "productName"],
  ["Product URL", "productUrl", "url"],
  ["Campaign types", "campaignTypes"],
  ["Campaign goals", "campaignGoals", "long"],
  ["Target audience", "targetAudience", "long"],
  ["Target countries", "targetCountries"],
  ["Preferred platforms", "preferredPlatforms"],
  ["Creator count", "creatorCount"],
  ["Budget currency", "budgetCurrency"],
  ["Budget range", "budgetRange"],
  ["Timeline", "timeline"],
  ["Product shipping ready", "productShippingReady"],
  ["Notes", "notes", "long"],
  ["Status", "status"],
  ["Created", "createdAt", "date"],
  ["Updated", "updatedAt", "date"],
];

const influencerDetailFields = [
  ["Full name", "fullName"],
  ["Creator name", "creatorName"],
  ["Email", "email", "email"],
  ["Phone", "phone"],
  ["Country", "country"],
  ["City", "city"],
  ["Languages", "languages"],
  ["Categories", "categories"],
  ["Primary platform", "primaryPlatform"],
  ["Primary profile", "primaryProfile", "url"],
  ["Other profiles", "otherProfiles", "long"],
  ["Followers", "followers"],
  ["Engagement rate", "engagementRate"],
  ["Average views", "averageViews"],
  ["Audience countries", "audienceCountries"],
  ["Content types", "contentTypes"],
  ["Past brand work", "pastBrandWork", "long"],
  ["Rate card", "rateCard"],
  ["Shipping address", "shippingAddress", "long"],
  ["Portfolio URL", "portfolioUrl", "url"],
  ["Notes", "notes", "long"],
  ["Consent to contact", "consentToContact", "boolean"],
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

const emptyDashboardData = {
  stats: {},
  pagination: {
    brands: { page: 1, limit: registrationPageSize, total: 0, totalPages: 1 },
    influencers: { page: 1, limit: registrationPageSize, total: 0, totalPages: 1 },
  },
  brands: [],
  influencers: [],
  blogs: [],
  testimonials: [],
  users: [],
  currentUser: null,
};

function normalizeDashboardData(dashboard = {}) {
  return {
    stats: dashboard.stats || {},
    pagination: {
      brands: dashboard.pagination?.brands || emptyDashboardData.pagination.brands,
      influencers: dashboard.pagination?.influencers || emptyDashboardData.pagination.influencers,
    },
    brands: Array.isArray(dashboard.brands) ? dashboard.brands : [],
    influencers: Array.isArray(dashboard.influencers) ? dashboard.influencers : [],
    blogs: Array.isArray(dashboard.blogs) ? dashboard.blogs : [],
    testimonials: Array.isArray(dashboard.testimonials) ? dashboard.testimonials : [],
    users: Array.isArray(dashboard.users) ? dashboard.users : [],
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
      <a href={normalizeExternalUrl(value)} target="_blank" rel="noreferrer">
        {value}
      </a>
    );
  }

  return value;
}

function Pill({ children, tone = "default" }) {
  return <span className={`admin-pill ${tone}`}>{children}</span>;
}

function RegistrationDetails({ emptyMessage, fields, record, title }) {
  if (!record) {
    return (
      <aside className="admin-registration-details is-empty">
        <h3>{title}</h3>
        <p>{emptyMessage}</p>
      </aside>
    );
  }

  return (
    <aside className="admin-registration-details">
      <div className="admin-registration-details-heading">
        <div>
          <span>Complete details</span>
          <h3>{title}</h3>
        </div>
        <Pill tone={brandStatusTone(record.status)}>
          {formatStatus(record.status) || "New"}
        </Pill>
      </div>
      <dl>
        {fields.map(([label, key, type]) => (
          <div className={type === "long" ? "wide" : ""} key={key}>
            <dt>{label}</dt>
            <dd>{renderDetailValue(record, key, type)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function RegistrationToolbar({ countLabel, filters, onFilterChange, onSearch, searchPlaceholder, statusOptions }) {
  return (
    <form className="admin-registration-toolbar" onSubmit={onSearch}>
      <label>
        Search
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
          <option value="">All statuses</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>{formatStatus(item)}</option>
          ))}
        </select>
      </label>
      <button type="submit">Apply</button>
      <span>{countLabel}</span>
    </form>
  );
}

function RegistrationPager({ meta, onPageChange }) {
  const page = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;
  const total = meta?.total || 0;
  const limit = meta?.limit || registrationPageSize;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="admin-registration-pager">
      <span>{start}-{end} of {total}</span>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <strong>Page {page} / {totalPages}</strong>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = window.location.hash.replace("#", "");
    return ["brands", "influencers", "blogs", "testimonials", "users"].includes(requestedTab) ? requestedTab : "brands";
  });
  const [data, setData] = useState(emptyDashboardData);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [editingUserId, setEditingUserId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedInfluencerId, setSelectedInfluencerId] = useState("");
  const [brandFilters, setBrandFilters] = useState({ search: "", status: "", page: 1 });
  const [influencerFilters, setInfluencerFilters] = useState({ search: "", status: "", page: 1 });
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const tabs = useMemo(
    () => [
      ["brands", `Brands (${data.stats.brands || 0})`],
      ["influencers", `Influencers (${data.stats.influencers || 0})`],
      ["blogs", `Blogs (${data.blogs.length})`],
      ["testimonials", `Testimonials (${data.testimonials.length})`],
      ["users", `Users (${data.users.length})`],
    ],
    [data]
  );

  const dashboardParams = useMemo(
    () => ({
      brandSearch: brandFilters.search.trim(),
      brandStatus: brandFilters.status,
      brandPage: brandFilters.page,
      brandLimit: registrationPageSize,
      influencerSearch: influencerFilters.search.trim(),
      influencerStatus: influencerFilters.status,
      influencerPage: influencerFilters.page,
      influencerLimit: registrationPageSize,
    }),
    [brandFilters, influencerFilters]
  );

  useEffect(() => {
    localStorage.removeItem("influnexa_admin_token");
  }, []);

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

  const updateStatus = async (type, id, nextStatus) => {
    try {
      await updateRegistrationStatus(type, id, nextStatus);
      await loadDashboard();
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
    setStatus({ type: "loading", message: "Saving blog post..." });

    try {
      await createBlogPost(blogForm);
      setBlogForm(initialBlogForm);
      await loadDashboard();
      setActiveTab("blogs");
      setStatus({ type: "success", message: "Blog post saved." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const selectTab = (id) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const updateBrandFilter = (field, value) => {
    setBrandFilters((current) => ({ ...current, [field]: value, page: 1 }));
  };

  const updateInfluencerFilter = (field, value) => {
    setInfluencerFilters((current) => ({ ...current, [field]: value, page: 1 }));
  };

  const applyRegistrationSearch = (event) => {
    event.preventDefault();
    loadDashboard();
  };

  const changeBrandPage = (page) => {
    setBrandFilters((current) => ({ ...current, page }));
  };

  const changeInfluencerPage = (page) => {
    setInfluencerFilters((current) => ({ ...current, page }));
  };

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
  const selectedBrand = data.brands.find((brand) => brand._id === selectedBrandId);
  const selectedInfluencer = data.influencers.find((influencer) => influencer._id === selectedInfluencerId);

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
            <p>Dynamic dashboard</p>
            <h1>Registrations and blog control center</h1>
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

        <div className="admin-stats">
          <article><span>Brands</span><strong>{data.stats.brands || 0}</strong><small>{data.stats.newBrands || 0} new</small></article>
          <article><span>Influencers</span><strong>{data.stats.influencers || 0}</strong><small>{data.stats.newInfluencers || 0} new</small></article>
          <article><span>Blogs</span><strong>{data.stats.blogs || 0}</strong><small>{data.stats.publishedBlogs || 0} published</small></article>
          <article><span>Testimonials</span><strong>{data.stats.testimonials || 0}</strong><small>{data.stats.pendingTestimonials || 0} pending</small></article>
          <article><span>Users</span><strong>{data.stats.users || 0}</strong><small>{data.currentUser?.role || "admin"} access</small></article>
        </div>

        {activeTab === "brands" && (
          <div className="admin-panel">
            <div className="admin-panel-title-row">
              <h2>Brand registrations</h2>
            </div>
            <RegistrationToolbar
              countLabel={`${data.pagination.brands.total || 0} matching brands`}
              filters={brandFilters}
              onFilterChange={updateBrandFilter}
              onSearch={applyRegistrationSearch}
              searchPlaceholder="Company, contact, email, industry..."
              statusOptions={brandStatuses}
            />
            <div className="admin-registration-layout">
              <div className="admin-registration-list">
                {data.brands.map((brand) => (
                  <article className={`admin-registration-card ${selectedBrandId === brand._id ? "active" : ""}`} key={brand._id}>
                    <button type="button" onClick={() => setSelectedBrandId(brand._id)}>
                      <span className="admin-registration-card-top">
                        <strong>{brand.companyName}</strong>
                        <Pill tone={brandStatusTone(brand.status)}>{formatStatus(brand.status)}</Pill>
                      </span>
                      <span>{brand.industry} - {brand.country}</span>
                      <small>{brand.productName}</small>
                      <span>{brand.contactName} - {brand.email}</span>
                      <small>{brand.budgetRange} - {formatDate(brand.createdAt)}</small>
                    </button>
                    <select
                      aria-label={`Update ${brand.companyName} status`}
                      value={formatStatus(brand.status)}
                      onChange={(event) => updateStatus("brands", brand._id, event.target.value)}
                    >
                      {brandStatuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </article>
                ))}
                {data.brands.length === 0 && (
                  <article className="admin-registration-card is-empty">
                    <strong>No brand registrations yet</strong>
                    <span>New campaign requests will appear here.</span>
                  </article>
                )}
                <RegistrationPager meta={data.pagination.brands} onPageChange={changeBrandPage} />
              </div>
              <RegistrationDetails
                emptyMessage="Click a brand card to see the full campaign request."
                fields={brandDetailFields}
                record={selectedBrand}
                title={selectedBrand?.companyName || "Brand details"}
              />
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
              countLabel={`${data.pagination.influencers.total || 0} matching influencers`}
              filters={influencerFilters}
              onFilterChange={updateInfluencerFilter}
              onSearch={applyRegistrationSearch}
              searchPlaceholder="Creator, email, country, platform..."
              statusOptions={influencerStatuses}
            />
            <div className="admin-registration-layout">
              <div className="admin-registration-list">
                {data.influencers.map((influencer) => (
                  <article className={`admin-registration-card ${selectedInfluencerId === influencer._id ? "active" : ""}`} key={influencer._id}>
                    <button type="button" onClick={() => setSelectedInfluencerId(influencer._id)}>
                      <span className="admin-registration-card-top">
                        <strong>{influencer.creatorName}</strong>
                        <Pill tone={influencer.status === "approved" ? "success" : influencer.status === "rejected" ? "error" : "default"}>
                          {influencer.status}
                        </Pill>
                      </span>
                      <span>{influencer.primaryPlatform} - {influencer.followers} followers</span>
                      <small>{influencer.country}{influencer.city ? `, ${influencer.city}` : ""}</small>
                      <span>{influencer.fullName} - {influencer.email}</span>
                      <small>{influencer.categories?.join(", ") || "No categories"} - {formatDate(influencer.createdAt)}</small>
                    </button>
                    <select
                      aria-label={`Update ${influencer.creatorName} status`}
                      value={influencer.status}
                      onChange={(event) => updateStatus("influencers", influencer._id, event.target.value)}
                    >
                      {influencerStatuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </article>
                ))}
                {data.influencers.length === 0 && (
                  <article className="admin-registration-card is-empty">
                    <strong>No influencer registrations yet</strong>
                    <span>New creator applications will appear here.</span>
                  </article>
                )}
                <RegistrationPager meta={data.pagination.influencers} onPageChange={changeInfluencerPage} />
              </div>
              <RegistrationDetails
                emptyMessage="Click an influencer card to see the full creator profile."
                fields={influencerDetailFields}
                record={selectedInfluencer}
                title={selectedInfluencer?.creatorName || "Influencer details"}
              />
            </div>
          </div>
        )}

        {activeTab === "blogs" && (
          <div className="admin-blog-grid">
            <form className="admin-panel admin-blog-form" onSubmit={submitBlog}>
              <h2>Create blog post</h2>
              <label>Title<input name="title" value={blogForm.title} onChange={updateBlogField} required /></label>
              <label>Category<input name="category" value={blogForm.category} onChange={updateBlogField} required /></label>
              <label>Excerpt<textarea name="excerpt" value={blogForm.excerpt} onChange={updateBlogField} required rows="3" /></label>
              <label>Content<textarea name="content" value={blogForm.content} onChange={updateBlogField} rows="6" /></label>
              <div className="admin-form-row">
                <label>Author<input name="author" value={blogForm.author} onChange={updateBlogField} /></label>
                <label>Read time<input name="readTime" value={blogForm.readTime} onChange={updateBlogField} /></label>
              </div>
              <label>Cover image URL<input name="coverImage" value={blogForm.coverImage} onChange={updateBlogField} /></label>
              <label>Status<select name="status" value={blogForm.status} onChange={updateBlogField}>
                <option>published</option>
                <option>draft</option>
              </select></label>
              <button type="submit">Create Blog</button>
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
                    <button type="button" onClick={() => removeBlog(blog._id)}>Delete</button>
                  </article>
                ))}
              </div>
            </div>
          </div>
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
