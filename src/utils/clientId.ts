// A per-tab identity the GameServer uses to tell "this tab refreshed" apart
// from "a new tab/window opened". sessionStorage is exactly that: it survives
// a refresh of the same tab but is never shared with a new tab, even for the
// same logged-in user.
const STORAGE_KEY = "clientId";

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getClientId = (): string => {
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = createId();
  sessionStorage.setItem(STORAGE_KEY, id);
  return id;
};
