// Stub. Real PostHog wiring lands in a later task.
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[track]", name, props);
  }
}
