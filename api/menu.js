export default async function handler(request, response) {
  // NEW: Allow only GET requests.
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  // NEW: Read and validate the restaurant ID before calling Swiggy.
  const restaurantId = request.query.restaurantId;
  if (!restaurantId || !/^\d+$/.test(String(restaurantId))) {
    return response.status(400).json({ error: "A valid restaurantId is required" });
  }

  // NEW: Use frontend location values, with Mumbai defaults.
  const lat = request.query.lat || "19.07480";
  const lng = request.query.lng || "72.88560";

  // NEW: Build the Swiggy menu URL on the server.
  const upstreamUrl =
    "https://www.swiggy.com/dapi/menu/pl" +
    "?page-type=REGULAR_MENU&complete-menu=true" +
    `&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}` +
    `&restaurantId=${encodeURIComponent(String(restaurantId))}` +
    "&catalog_qa=undefined&submitAction=ENTER";

  try {
    // NEW: Fetch Swiggy on the server, not inside the browser.
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        referer: "https://www.swiggy.com/",
      },
    });

    const body = await upstream.text();
    // NEW: Preserve Swiggy error statuses for the frontend.
    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: "Swiggy menu API request failed" });
    }

    // NEW: Return JSON and cache the menu response on Vercel.
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).send(body);
  } catch (error) {
    console.error("Swiggy menu proxy error:", error);
    return response.status(502).json({ error: "Unable to reach Swiggy menu API" });
  }
}
