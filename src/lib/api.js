const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5007/api";
const ADMIN_TOKEN_STORAGE_KEY = "influnexa_admin_token";

function adminHeaders() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  return token ? { "x-admin-token": token } : {};
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export async function loginAdmin({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to login.");
  }

  if (data.token) {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token);
  }

  return data;
}

export function logoutAdmin() {
  clearAdminToken();
}

export async function submitRegistration(type, payload) {
  const response = await fetch(`${API_BASE_URL}/registrations/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to submit registration.");
  }

  return data;
}

export async function getAdminDashboard() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to load admin dashboard.");
  }

  return data;
}

export async function updateRegistrationStatus(type, id, status) {
  const response = await fetch(`${API_BASE_URL}/admin/${type}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to update status.");
  }

  return data;
}

export async function getBlogPosts(status = "published") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${API_BASE_URL}/blogs${query}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load blog posts.");
  }

  return data.posts || [];
}

export async function getBlogPost(slug) {
  const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load blog post.");
  }

  return data.post;
}

export async function createBlogPost(payload) {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to create blog post.");
  }

  return data.post;
}

export async function deleteBlogPost(id) {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to delete blog post.");
  }

  return data;
}

export async function createAdminUser(payload) {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to create admin user.");
  }

  return data.user;
}

export async function updateAdminUser(id, payload) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to update admin user.");
  }

  return data.user;
}

export async function deleteAdminUser(id) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(data.message || "Unable to delete admin user.");
  }

  return data;
}
