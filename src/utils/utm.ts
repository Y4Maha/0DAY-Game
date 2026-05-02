export interface UtmTags {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const KEY = "0day_utm";

export function captureUtm(): UtmTags {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  const tags: UtmTags = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    term: params.get("utm_term") ?? undefined,
  };
  // Persist on first hit only (first-touch attribution)
  const stored = localStorage.getItem(KEY);
  if (!stored && Object.values(tags).some((v) => v !== undefined)) {
    try {
      localStorage.setItem(KEY, JSON.stringify(tags));
    } catch {
      // ignore
    }
  }
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
