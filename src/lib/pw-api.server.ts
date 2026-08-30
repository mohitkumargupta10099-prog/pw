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

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}
