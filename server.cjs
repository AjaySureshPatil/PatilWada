const express = require("express");

const app = express();
const PORT = 3001;

// NEW: This is the local API server's CORS configuration.
// Only localhost Parcel origins are allowed; production Vercel calls remain same-origin.
const allowedOrigins = new Set([
  "http://localhost:1234",
  "http://127.0.0.1:1234",
]);

app.use((request, response, next) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    response.header("Access-Control-Allow-Origin", origin);
    response.header("Vary", "Origin");
  }
  response.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.header("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }
  next();
});

// NEW: Local replacement for api/restaurants.js.
app.get("/api/restaurants", async (request, response) => {
  const lat = request.query.lat || "19.07480";
  const lng = request.query.lng || "72.88560";
  const upstreamUrl =
    "https://www.swiggy.com/dapi/restaurants/list/v5" +
    `?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        referer: "https://www.swiggy.com/",
      },
    });
    const body = await upstream.text();
    // NEW: Tell the browser that the proxied response is JSON.
    response.header("Content-Type", "application/json; charset=utf-8");
    response.status(upstream.status).send(body);
  } catch (error) {
    console.error("Local Swiggy restaurant proxy error:", error);
    response.status(502).json({ error: "Unable to reach Swiggy restaurant API" });
  }
});

// NEW: Local replacement for api/menu.js.
app.get("/api/menu", async (request, response) => {
  const restaurantId = request.query.restaurantId;
  if (!restaurantId || !/^\d+$/.test(String(restaurantId))) {
    return response.status(400).json({ error: "A valid restaurantId is required" });
  }

  const lat = request.query.lat || "19.07480";
  const lng = request.query.lng || "72.88560";
  const upstreamUrl =
    "https://www.swiggy.com/dapi/menu/pl" +
    "?page-type=REGULAR_MENU&complete-menu=true" +
    `&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}` +
    `&restaurantId=${encodeURIComponent(String(restaurantId))}` +
    "&catalog_qa=undefined&submitAction=ENTER";

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        referer: "https://www.swiggy.com/",
      },
    });
    const body = await upstream.text();
    // NEW: Tell the browser that the proxied response is JSON.
    response.header("Content-Type", "application/json; charset=utf-8");
    response.status(upstream.status).send(body);
  } catch (error) {
    console.error("Local Swiggy menu proxy error:", error);
    response.status(502).json({ error: "Unable to reach Swiggy menu API" });
  }
});

app.listen(PORT, () => {
  console.log(`Local Swiggy API proxy running at http://localhost:${PORT}`);
});
