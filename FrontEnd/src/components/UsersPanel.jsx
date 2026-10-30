import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function UsersPanel() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.usersWithNotes().then((d) => setUsers(d.data || [])).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="empty"><h3>Couldn’t load users</h3><p>{error}</p></div>;
  if (!users) return <div className="loading">Loading users…</div>;
  if (!users.length) return <div className="empty"><h3>No users yet</h3></div>;

  return users.map((u) => {
    const notes = u.userNotes || [];
    return (
      <details className="user" key={u._id}>
        <summary>
          <b>{u.name}</b><small>{u.email}</small>
          <small>{u.role} · {notes.length} {notes.length === 1 ? 'note' : 'notes'}</small>
        </summary>
        {u.interests?.length > 0 && <small>Interests: {u.interests.join(', ')}</small>}
        {notes.length ? (
          <ul>{notes.map((n) => <li key={n._id}><strong>{n.title}</strong></li>)}</ul>
        ) : <p style={{ color: 'var(--muted)' }}>No notes yet.</p>}
      </details>
    );
  });
}
