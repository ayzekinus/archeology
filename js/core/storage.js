export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

export function removeKey(key) {
  localStorage.removeItem(key);
}
