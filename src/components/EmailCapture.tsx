import { useState } from "react";
import { trackEvent } from "../analytics/posthog";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    trackEvent("email_signup", {
      email_hash: btoa(email).slice(0, 16),
      status: "stubbed",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-sm text-accent">
        Got it. We'll email you when 0DAY launches.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Notify me when the full game launches"
        className="flex-1 bg-white/10 rounded px-3 py-2 text-sm placeholder:opacity-60"
        required
      />
      <button
        type="submit"
        className="bg-accent text-bg font-display px-4 py-2 rounded uppercase text-sm"
      >
        Notify me
      </button>
    </form>
  );
}
