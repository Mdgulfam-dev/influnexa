// src/config/Config.js

const LOCAL_API_URL = "http://127.0.0.1:5001/api";

const PRODUCTION_API_URL =
  "https://influnexa-backend-igoz.onrender.com/api";

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL;

  // Production/deployed frontend
  if (
    typeof window !== "undefined" &&
    !isLocalHost(window.location.hostname)
  ) {
    if (
      !configuredUrl ||
      configuredUrl.includes("127.0.0.1") ||
      configuredUrl.includes("localhost")
    ) {
      return PRODUCTION_API_URL;
    }
  }

  // Local development
  return configuredUrl || LOCAL_API_URL;
}

const Config = {
  API_URL: resolveApiBaseUrl(),
};

export default Config;