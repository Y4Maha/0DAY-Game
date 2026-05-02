import { useState } from "react";
import type { FormEvent } from "react";
import { trackEvent } from "../analytics/posthog";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const endpoint = import.meta.env.VITE_BUTTONDOWN_ENDPOINT;
    const key = import.meta.env.VITE_BUTTONDOWN_KEY;

    if (!endpoint || !key) {
      // No backend configured — track stub then succeed locally
      trackEvent("email_signup", {
        email_hash: btoa(email).slice(0, 16),
        status: "stubbed",
      });
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${key}`,
        },
        body: JSON.stringify({ email_address: email, tags: ["0day-demo"] }),
      });
      if (r.ok || r.status === 200 || r.status === 201) {
        trackEvent("email_signup", {
          email_hash: btoa(email).slice(0, 16),
          status: "ok",
        });
        setSubmitted(true);
      } else if (r.status === 400) {
        // Already subscribed → treat as success
        trackEvent("email_signup", {
          email_hash: btoa(email).slice(0, 16),
          status: "exists",
        });
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-sm text-accent">
        Got it. We'll email you when 0DAY launches.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Notify me when the full game launches"
          className="flex-1 bg-white/10 rounded px-3 py-2 text-sm placeholder:opacity-60"
          required
          disabled={submitting}
        />
        <button
          type="submit"
          className="bg-accent text-bg font-display px-4 py-2 rounded uppercase text-sm disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "..." : "Notify me"}
        </button>
      </div>
      {error && <div className="text-xs text-rose-400">{error}</div>}
    </form>
  );
}
