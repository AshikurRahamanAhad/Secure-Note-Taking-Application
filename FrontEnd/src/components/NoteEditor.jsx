import { useState } from 'react';

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try { await onSave({ title: title.trim(), content }); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <form onSubmit={submit}>
      <h2>{note ? 'Edit note' : 'New note'}</h2>
      <label className="field"><span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required autoFocus /></label>
      <label className="field"><span>Note</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required /></label>
      <p className="err" role="alert">{error}</p>
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save note'}</button>
      </div>
    </form>
  );
}
