const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function getUser() {
  const r = await fetch(`${API}/auth/user`, { credentials: 'include' });
  if (r.status === 200) return r.json();
  return null;
}

export function loginUrl(provider) {
  return `${API}/auth/${provider}`;
}

export async function doSearch(term) {
  const r = await fetch(`${API}/api/search`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term }),
  });
  return r.json();
}

export async function topSearches() {
  const r = await fetch(`${API}/api/top-searches`, { credentials: 'include' });
  return r.json();
}

export async function history() {
  const r = await fetch(`${API}/api/history`, { credentials: 'include' });
  return r.json();
}

export async function logout() {
  const response = await fetch(`${API}/auth/logout`, { credentials: 'include' });
  return response.json();
}
