import { headers } from "next/headers";

/**
 * Extracts client IP + location info from server-side request headers.
 */
const clientDataServer = async () => {
  const h = await headers();

  const get = (key: string) => h.get(key) ?? null;

  // IP detection
  const ip =
    get("x-real-ip") ||
    get("x-forwarded-for")?.split(",")[0].trim() ||
    "8.8.8.8"; // fallback

  // Geo (Vercel → Cloudflare → null)
  const country = get("x-vercel-ip-country") || get("cf-ipcountry");
  const region = get("x-vercel-ip-country-region") || get("cf-region");
  const city = get("x-vercel-ip-city") || get("cf-ipcity");

  const lat = get("x-vercel-ip-latitude") || get("cf-iplatitude");
  const lon = get("x-vercel-ip-longitude") || get("cf-iplongitude");

  // Timezone
  const timezone = get("x-vercel-ip-timezone") || get("cf-timezone");
  const continent = get("x-vercel-ip-continent") ;
  const host = get("host") ;

  return {
    ip,
    country,
    region,
    city,
    lat: lat ? Number(lat) : null,
    lon: lon ? Number(lon) : null,
    timezone,
    continent,
    host
  };
};

export default clientDataServer;
