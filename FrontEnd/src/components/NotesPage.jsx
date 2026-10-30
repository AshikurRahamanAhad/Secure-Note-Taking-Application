import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Modal from './Modal.jsx';
import NoteEditor from './NoteEditor.jsx';
import UsersPanel from './UsersPanel.jsx';

const PAGE_SIZE = 9;
const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

function toggleTheme() {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('sn_theme', next); } catch { /* ignore */ }
}

export default function NotesPage({ notify }) {
  const { role, logout } = useAuth();
  const isAdmin = role === 'Admin';
  const [tab, setTab] = useState('notes');
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | 'new' | note
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.allNotes().then(setNotes).catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (notes || []).filter((n) => !s || n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s));
  }, [notes, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function save(values) {
    if (editing === 'new') {
      const d = await api.createNote(values);
      setNotes((list) => [d.note, ...list]);
    } else {
      const d = await api.updateNote(editing._id, values);
      setNotes((list) => list.map((n) => (n._id === d.data._id ? d.data : n)));
    }
    setEditing(null);
    notify('Note saved.');
  }

  async function confirmDelete() {
    const n = deleting;
    setDeleting(null);
    try {
      await api.deleteNote(n._id);
      setNotes((list) => list.filter((x) => x._id !== n._id));
      notify('Note deleted.');
    } catch (e) { notify(e.message); }
  }

  let body;
  if (error) body = <div className="empty"><h3>Couldn’t load notes</h3><p>{error}</p></div>;
  else if (!notes) body = <div className="loading">Loading your notes… the server may take a few seconds to wake up.</div>;
  else if (!filtered.length) body = (
    <div className="empty">
      <h3>{q ? 'No notes match your search' : 'No notes yet'}</h3>
      <p>{q ? 'Try a different word.' : 'Choose “New note” to write your first one.'}</p>
    </div>
  );
  else body = (
    <div className="grid">
      {visible.map((n) => (
        <article className="note" key={n._id}>
          <h3>{n.title}</h3>
          <p>{n.content}</p>
          <footer>
            <time>{fmt(n.updatedAt || n.createdAt)}</time>
            <button className="btn" onClick={() => setEditing(n)}>Edit</button>
            <button className="btn danger" onClick={() => setDeleting(n)}>Delete</button>
          </footer>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <header className="top">
        <h1>Secure Notes</h1>
        <span className="role">{isAdmin ? 'Admin' : 'Member'}</span>
        <button className="btn" onClick={toggleTheme} aria-label="Switch light or dark theme">Theme</button>
        <button className="btn" onClick={logout}>Sign out</button>
      </header>

      <div className="wrap">
        {isAdmin && (
          <div className="nav" role="tablist">
            <button role="tab" aria-selected={tab === 'notes'} onClick={() => setTab('notes')}>Notes</button>
            <button role="tab" aria-selected={tab === 'users'} onClick={() => setTab('users')}>Users</button>
          </div>
        )}

        {tab === 'users' ? <UsersPanel /> : (
          <>
            <div className="bar">
              <input type="search" placeholder="Search notes" aria-label="Search notes" value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }} />
              <button className="btn primary" onClick={() => setEditing('new')}>New note</button>
            </div>
            {body}
            {pages > 1 && (
              <div className="pager">
                <button className="btn" disabled={current <= 1} onClick={() => setPage(current - 1)}>Previous</button>
                <span>Page {current} of {pages}</span>
                <button className="btn" disabled={current >= pages} onClick={() => setPage(current + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing !== null && (
          <NoteEditor key={editing === 'new' ? 'new' : editing._id} note={editing === 'new' ? null : editing}
            onSave={save} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)}>
        <h2>Delete this note?</h2>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>“{deleting?.title}” will be removed for good.</p>
        <div className="actions">
          <button className="btn" onClick={() => setDeleting(null)}>Keep note</button>
          <button className="btn danger" onClick={confirmDelete}>Delete note</button>
        </div>
      </Modal>
    </>
  );
}
