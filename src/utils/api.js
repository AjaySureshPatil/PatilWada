// NEW CODE: Keep API calls relative on Vercel.
// Locally, use the Express proxy running on port 3001 so Parcel has a working API server too.
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocalhost ? "http://localhost:3001" : "";
