import posthog from "posthog-js";
import { getAnonId } from "../utils/uuid";
import { captureUtm } from "../utils/utm";

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com";
  if (!key) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[analytics] VITE_POSTHOG_KEY missing — analytics disabled");
    }
    return;
  }
  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    autocapture: false,
    capture_pageview: true,
  });
  posthog.identify(getAnonId());
  const utm = captureUtm();
  if (Object.keys(utm).length > 0) posthog.register(utm);
  initialized = true;
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (!initialized) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[track-stub]", name, props);
    }
    return;
  }
  posthog.capture(name, props ?? {});
}
