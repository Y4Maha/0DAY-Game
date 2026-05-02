const KEY = "0day_anon_id";

export function getAnonId(): string {
  if (typeof localStorage === "undefined") {
    return "anon-no-localstorage";
  }
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // ignore quota / private mode
    }
  }
  return id;
}
