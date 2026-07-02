import { useEffect, useMemo, useState } from "react";
import {
  createBlogPost,
  createAdminUser,
  deleteAdminUser,
  deleteBlogPost,
  getAdminDashboard,
  loginAdmin,
  logoutAdmin,
  updateAdminUser,
  updateRegistrationStatus,
} from "../lib/api";

const brandStatuses = ["new", "contacted", "qualified", "closed"];
const influencerStatuses = ["new", "reviewing", "approved", "rejected"];

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

const emptyDashboardData = {
  stats: {},
  brands: [],
  influencers: [],
  blogs: [],
  users: [],
  currentUser: null,
};

function normalizeDashboardData(dashboard = {}) {
  return {
    stats: dashboard.stats || {},
    brands: Array.isArray(dashboard.brands) ? dashboard.brands : [],
    influencers: Array.isArray(dashboard.influencers) ? dashboard.influencers : [],
    blogs: Array.isArray(dashboard.blogs) ? dashboard.blogs : [],
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

function Pill({ children, tone = "default" }) {
  return <span className={`admin-pill ${tone}`}>{children}</span>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = window.location.hash.replace("#", "");
    return ["brands", "influencers", "blogs", "users"].includes(requestedTab) ? requestedTab : "brands";
  });
  const [data, setData] = useState(emptyDashboardData);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [editingUserId, setEditingUserId] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const tabs = useMemo(
    () => [
      ["brands", `Brands (${data.brands.length})`],
      ["influencers", `Influencers (${data.influencers.length})`],
      ["blogs", `Blogs (${data.blogs.length})`],
      ["users", `Users (${data.users.length})`],
    ],
    [data]
  );

  useEffect(() => {
    localStorage.removeItem("influnexa_admin_token");
  }, []);

  const loadDashboard = async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setStatus({ type: "loading", message: "Loading dashboard..." });
    }

    try {
      const dashboard = await getAdminDashboard();
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

    getAdminDashboard()
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

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const updateStatus = async (type, id, nextStatus) => {
    try {
      await updateRegistrationStatus(type, id, nextStatus);
      await loadDashboard();
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

  const submitUser = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: editingUserId ? "Updating team member..." : "Adding team member..." });

    try {
      const payload = { ...userForm };

      if (editingUserId && !payload.password) {
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

  if (!isAuthenticated) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <a className="admin-logo" href="/">
            <span>IN</span>
            Influnexa Admin
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
          <span>IN</span>
          Influnexa Admin
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
            <button type="button" onClick={loadDashboard}>Refresh</button>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </div>

        {status.message && <div className={`admin-status ${status.type}`}>{status.message}</div>}

        <div className="admin-stats">
          <article><span>Brands</span><strong>{data.stats.brands || 0}</strong><small>{data.stats.newBrands || 0} new</small></article>
          <article><span>Influencers</span><strong>{data.stats.influencers || 0}</strong><small>{data.stats.newInfluencers || 0} new</small></article>
          <article><span>Blogs</span><strong>{data.stats.blogs || 0}</strong><small>{data.stats.publishedBlogs || 0} published</small></article>
          <article><span>Users</span><strong>{data.stats.users || 0}</strong><small>{data.currentUser?.role || "admin"} access</small></article>
        </div>

        {activeTab === "brands" && (
          <div className="admin-panel">
            <h2>Brand registrations</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Contact</th>
                    <th>Campaign</th>
                    <th>Budget</th>
                    <th>Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.brands.map((brand) => (
                    <tr key={brand._id}>
                      <td>
                        <strong>{brand.companyName}</strong>
                        <span>{brand.industry} - {brand.country}</span>
                        <small>{brand.productName}</small>
                      </td>
                      <td>
                        <strong>{brand.contactName}</strong>
                        <a href={`mailto:${brand.email}`}>{brand.email}</a>
                        <span>{brand.phone || "No phone"}</span>
                      </td>
                      <td>
                        <span>{brand.campaignTypes?.join(", ") || "Not selected"}</span>
                        <small>{brand.preferredPlatforms?.join(", ") || "No platforms"}</small>
                      </td>
                      <td>{brand.budgetRange}</td>
                      <td>{formatDate(brand.createdAt)}</td>
                      <td>
                        <select
                          value={brand.status}
                          onChange={(event) => updateStatus("brands", brand._id, event.target.value)}
                        >
                          {brandStatuses.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "influencers" && (
          <div className="admin-panel">
            <h2>Influencer registrations</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Creator</th>
                    <th>Contact</th>
                    <th>Audience</th>
                    <th>Content</th>
                    <th>Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.influencers.map((influencer) => (
                    <tr key={influencer._id}>
                      <td>
                        <strong>{influencer.creatorName}</strong>
                        <a href={influencer.primaryProfile} target="_blank" rel="noreferrer">{influencer.primaryPlatform}</a>
                        <span>{influencer.country}{influencer.city ? `, ${influencer.city}` : ""}</span>
                      </td>
                      <td>
                        <strong>{influencer.fullName}</strong>
                        <a href={`mailto:${influencer.email}`}>{influencer.email}</a>
                        <span>{influencer.phone || "No phone"}</span>
                      </td>
                      <td>
                        <span>{influencer.followers} followers</span>
                        <small>{influencer.engagementRate || "No engagement"} - {influencer.averageViews || "No views"}</small>
                      </td>
                      <td>
                        <span>{influencer.categories?.join(", ") || "No categories"}</span>
                        <small>{influencer.contentTypes?.join(", ") || "No content types"}</small>
                      </td>
                      <td>{formatDate(influencer.createdAt)}</td>
                      <td>
                        <select
                          value={influencer.status}
                          onChange={(event) => updateStatus("influencers", influencer._id, event.target.value)}
                        >
                          {influencerStatuses.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {activeTab === "users" && (
          <div className="admin-blog-grid">
            <form className="admin-panel admin-blog-form" onSubmit={submitUser}>
              <h2>{editingUserId ? "Edit team member" : "Add team member"}</h2>
              <label>Name<input name="name" value={userForm.name} onChange={updateUserField} required /></label>
              <label>Email<input name="email" type="email" value={userForm.email} onChange={updateUserField} required /></label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={userForm.password}
                  onChange={updateUserField}
                  required={!editingUserId}
                  placeholder={editingUserId ? "Leave blank to keep current password" : "Minimum 8 characters"}
                />
              </label>
              <div className="admin-form-row">
                <label>Role<select name="role" value={userForm.role} onChange={updateUserField}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="owner">Owner</option>
                </select></label>
                <label>Status<select name="status" value={userForm.status} onChange={updateUserField}>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select></label>
              </div>
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
                      <button type="button" onClick={() => removeUser(user._id)}>Delete</button>
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
          </div>
        )}
      </section>
    </main>
  );
}
