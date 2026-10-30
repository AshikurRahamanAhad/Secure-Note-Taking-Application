const API = (import.meta.env.VITE_API_URL || 'https://secure-note-taking-application.onrender.com').replace(/\/$/, '');

let getToken = () => null;
let onExpire = () => {};
export function configureApi(opts) {
  getToken = opts.getToken;
  onExpire = opts.onExpire;
}

async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(API + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    });
  } catch {
    throw new Error('Can’t reach the server. Check your connection, or wait a moment if the server is starting up.');
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const msg = data.message || 'Something went wrong. Try again.';
    if (token && (res.status === 401 || /invalid token/i.test(msg))) {
      onExpire();
      throw new Error('Your session has expired. Sign in again.');
    }
    throw new Error(msg);
  }
  return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  login: (body) => request('/api/auth/login', json('POST', body)),
  register: (body) => request('/api/auth/register', json('POST', body)),
  // The backend paginates, so fetch every page and return one list
  async allNotes() {
    let page = 1, pages, all = [];
    do {
      const d = await request(`/api/notes?page=${page}&limit=100`);
      all = all.concat(d.data || []);
      pages = d.totalPages || 1;
      page++;
    } while (page <= pages);
    return all;
  },
  createNote: (body) => request('/api/notes', json('POST', body)),
  updateNote: (id, body) => request('/api/notes/' + id, json('PUT', body)),
  deleteNote: (id) => request('/api/notes/' + id, { method: 'DELETE' }),
  usersWithNotes: () => request('/api/admin/users-with-notes'),
};
