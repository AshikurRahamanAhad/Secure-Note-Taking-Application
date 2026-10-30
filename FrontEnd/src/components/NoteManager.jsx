import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function NoteManager({ token, API_BASE_URL }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setNotes(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchNotes();
    }
  }, [token, API_BASE_URL]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        // Re-fetch notes
        const updatedRes = await fetch(`${API_BASE_URL}/api/notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updatedData = await updatedRes.json();
        if (updatedRes.ok) setNotes(updatedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotes(notes.filter(note => note._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-xl h-fit">
        <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> New Note</h3>
        <form onSubmit={handleCreateNote} className="space-y-3">
          <input type="text" required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          <textarea required rows={4} placeholder="Note content..." value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-sm font-medium transition">Save Note</button>
        </form>
      </div>

      <div className="md:col-span-2 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">No notes created yet.</div>
        ) : (
          notes.map(note => (
            <div key={note._id} className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-200">{note.title}</h4>
                <p className="text-slate-400 text-sm mt-1 whitespace-pre-wrap">{note.content}</p>
              </div>
              <button onClick={() => handleDelete(note._id)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}