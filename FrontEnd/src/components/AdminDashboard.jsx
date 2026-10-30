import { useState, useEffect } from 'react';

export default function AdminDashboard({ token, API_BASE_URL, activeTab }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetch(`${API_BASE_URL}/api/admin/users-with-notes`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setUsers(Array.isArray(data) ? data : []))
        .catch(console.error);
    } else if (activeTab === 'stats') {
      fetch(`${API_BASE_URL}/api/admin/interests-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setStats(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [token, activeTab, API_BASE_URL]);

  if (activeTab === 'users') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">All Users & Notes ($lookup Pipeline)</h3>
        <div className="grid gap-4">
          {users.map(u => (
            <div key={u._id} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-indigo-300">{u.name}</h4>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <span className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-300">Role: {u.role}</span>
              </div>
              <div className="mt-3 border-t border-slate-700/50 pt-3 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Joined Notes:</span>
                {(!u.notes || u.notes.length === 0) ? <p className="text-xs text-slate-500 italic">No notes.</p> :
                  u.notes.map(n => (
                    <div key={n._id} className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-xs">
                      <span className="font-medium text-slate-300">{n.title}:</span> <span className="text-slate-400">{n.content}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Interest Analytics ($unwind & $group Pipeline)</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 uppercase block">Interest</span>
              <span className="text-lg font-bold text-indigo-400">{item._id || 'Unspecified'}</span>
            </div>
            <div className="bg-indigo-950 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-center">
              <span className="text-xs text-indigo-300 block">Users</span>
              <span className="text-xl font-bold text-indigo-200">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}