export default async function handler(request, response) {
  // NEW: Allow only GET requests from the frontend.
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  // NEW: Read location values passed by the frontend, with Mumbai defaults.
  const lat = request.query.lat || "19.07480";
  const lng = request.query.lng || "72.88560";

  // NEW: Build the real Swiggy URL on the server, where browser CORS rules do not apply.
  const upstreamUrl =
    "https://www.swiggy.com/dapi/restaurants/list/v5" +
    `?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

  try {
    // NEW: Fetch Swiggy from Vercel and send browser-like headers accepted by Swiggy.
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        referer: "https://www.swiggy.com/",
      },
    });

    const body = await upstream.text();
    // NEW: Return the upstream error status instead of changing it into a successful response.
    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: "Swiggy restaurant API request failed" });
    }

    // NEW: Return JSON to the frontend and cache the response on Vercel.
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).send(body);
  } catch (error) {
    console.error("Swiggy restaurant proxy error:", error);
    return response.status(502).json({ error: "Unable to reach Swiggy restaurant API" });
  }
}
