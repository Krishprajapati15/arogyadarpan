export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  const API_KEY =
    "415e621c56c822eec20b99c5249d92332945aa067dcc1e8481be16b2ba129b9d";

  try {
    // Construct the URL with query parameters for SerpAPI
    const params = new URLSearchParams({
      q: "hospitals",
      location: location,
      hl: "en",
      gl: "in",
      google_domain: "google.com",
      api_key: API_KEY,
      engine: "google",
    });

    const apiResponse = await fetch(
      `https://serpapi.com/search.json?${params}`
    );

    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Extract hospital data from local_results and organic_results
    const hospitals = [];

    // Add local results (map results) - these are the most relevant
    if (data.local_results?.places) {
      hospitals.push(
        ...data.local_results.places.map((place) => ({
          title: place.title,
          rating: place.rating,
          reviews: place.reviews,
          type: place.type,
          address: place.address,
          phone: place.phone,
          hours: place.hours,
          service_options: place.service_options,
          links: place.links,
          gps_coordinates: place.gps_coordinates,
          source: "local",
        }))
      );
    }

    // Add relevant organic results if we need more data
    if (data.organic_results && hospitals.length < 10) {
      const relevantResults = data.organic_results
        .filter(
          (result) =>
            result.title.toLowerCase().includes("hospital") ||
            result.snippet?.toLowerCase().includes("hospital") ||
            result.snippet?.toLowerCase().includes("medical") ||
            result.source?.toLowerCase().includes("hospital")
        )
        .slice(0, 10 - hospitals.length) // Fill up to 10 total results
        .map((result) => {
          // Try to extract structured data from snippet
          const snippet = result.snippet || "";
          const hasRating = snippet.match(/(\d\.\d)\s*\((\d+)/);

          return {
            title: result.title,
            address: snippet.split(".")[0] || snippet.substring(0, 100),
            snippet: result.snippet,
            links: { website: result.link },
            rating: hasRating ? parseFloat(hasRating[1]) : null,
            reviews: hasRating ? parseInt(hasRating[2]) : null,
            source: "organic",
          };
        });

      hospitals.push(...relevantResults);
    }

    // Sort hospitals by rating (highest first), then by review count
    hospitals.sort((a, b) => {
      if (a.rating && b.rating) {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return (b.reviews || 0) - (a.reviews || 0);
      }
      if (a.rating && !b.rating) return -1;
      if (!a.rating && b.rating) return 1;
      return (b.reviews || 0) - (a.reviews || 0);
    });

    res.status(200).json({
      hospitals: hospitals.slice(0, 12), // Limit to 12 results
      total: hospitals.length,
      location: location,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      message: "Failed to fetch hospital data",
      error: error.message,
    });
  }
}
