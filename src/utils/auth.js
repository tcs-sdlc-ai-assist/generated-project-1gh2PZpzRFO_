// WARNING: Client-side session only — MVP tradeoff. No server-side validation.

/**
 * Reads the 'writespace_session' from localStorage.
 * @returns {Object|null} The parsed session object, or null if missing or on error.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem('writespace_session');
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Writes a session object to 'writespace_session' in localStorage.
 * @param {Object} session - The session object { userId, username, displayName, role }.
 * @returns {Object} The session object that was stored.
 */
export function setSession(session) {
  try {
    localStorage.setItem('writespace_session', JSON.stringify(session));
    return session;
  } catch {
    return session;
  }
}

/**
 * Removes the 'writespace_session' key from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem('writespace_session');
  } catch {
    // Silently ignore removal errors.
  }
}