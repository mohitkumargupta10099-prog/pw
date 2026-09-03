const BASE = "https://api.studyspark.study/api/penpencil";
const BATCHES_JSON =
  "https://raw.githubusercontent.com/rarestudy/rarestudy/refs/heads/main/batches.json";

export type RawBatch = {
  _id: string;
  name: string;
  byName: string;
  startDate: string;
  endDate: string;
  language: string;
  previewImage: string;
  feeTotal: number;
  type: string;
  slug: string;
};

let cache: RawBatch[] | null = null;
let cacheAt = 0;

export async function allBatches(): Promise<RawBatch[]> {
  if (cache && Date.now() - cacheAt < 1000 * 60 * 30) return cache;
  const res = await fetch(BATCHES_JSON);
  const json = (await res.json()) as { batches: RawBatch[] };
  cache = json.batches ?? [];
  cacheAt = Date.now();
  return cache;
}

export const CATEGORY_MATCHERS: Record<string, RegExp> = {
  JEE: /jee|iit/i,
  NEET: /neet|medical/i,
  "Class 10": /class\s*-?\s*10|10th|x\b/i,
  "Class 12": /class\s*-?\s*12|12th/i,
  "Class 11": /class\s*-?\s*11|11th/i,
  GATE: /gate/i,
  UPSC: /upsc|ias|civil services/i,
};

const PRIMARY = "https://proxy.streamvideo.co.in/fetch/api.penpencil.co";
const FALLBACK = "https://vidcloud.eu.org/api";
const TOKEN_URL = "https://vidcloud.eu.org/generate_token.php";

let token: string | null = null;
let tokenAt = 0;

async function getToken(force = false): Promise<string | null> {
  if (!force && token && Date.now() - tokenAt < 1000 * 60 * 20) return token;
  try {
    const res = await fetch(TOKEN_URL, { headers: { accept: "application/json" } });
    const json = (await res.json()) as { access_token?: string };
    token = json.access_token ?? null;
    tokenAt = Date.now();
  } catch {
    token = null;
  }
  return token;
}

async function tryFetch<T>(url: string, headers: Record<string, string>): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { accept: "application/json", ...headers } });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T; success?: boolean };
    if (json.success === false) return null;
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Primary API -> current base -> fallback API (with token) -> retry with fresh token. */
export async function apiGet<T>(path: string): Promise<T | null> {
  for (const base of [PRIMARY, BASE]) {
    const out = await tryFetch<T>(`${base}${path}`, {});
    if (out !== null) return out;
  }
  for (const force of [false, true]) {
    const t = await getToken(force);
    if (!t) continue;
    const out = await tryFetch<T>(`${FALLBACK}${path}`, {
      authorization: `Bearer ${t}`,
      "x-access-token": t,
    });
    if (out !== null) return out;
  }
  return null;
}

