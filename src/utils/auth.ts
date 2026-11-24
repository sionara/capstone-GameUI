// Login token helpers. The token comes from APIServer's /login or /register
// response and proves who the user is to both servers: sent as
// "Authorization: Bearer <token>" to APIServer, and in the socket handshake
// to GameServer. Servers take the user id from the token, never from ids the
// client sends.
//
// Stored under "token" via usehooks-ts' useLocalStorage (see useLogin /
// useRegister), which JSON-encodes values - hence the JSON.parse here.
export const TOKEN_KEY = "token";

export const getToken = (): string => {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as string) : "";
  } catch {
    return "";
  }
};

// Forget the login. "session" is the flag SecuredRoute checks.
export const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem("session", "false");
  } catch {
    // storage unavailable - nothing to clear
  }
};

// The token is missing, expired, or rejected: drop it and send the user to the
// login page. A full page load (not navigate()) so every hook re-reads the
// cleared storage and the socket starts fresh.
export const forceLogout = () => {
  clearAuth();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

// fetch() with the login token attached. A 401 means the session is over
// (expired or invalid token), so log out instead of showing an error.
export const authFetch = async (url: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...init, headers });
  if (response.status === 401) {
    forceLogout();
    throw new Error("Session expired");
  }
  return response;
};
