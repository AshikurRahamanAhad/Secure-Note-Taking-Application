import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

export default function AuthPage({ notify }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '', role: 'User', adminCode: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isLogin = mode === 'login';

  const switchMode = (m) => { setMode(m); setError(''); };

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (isLogin) {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        const body = {
          name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role,
          interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        };
        if (form.role === 'Admin') body.adminCode = form.adminCode;
        await register(body);
        setForm({ ...form, password: '', adminCode: '' });
        switchMode('login');
        notify('Account created. Sign in to continue.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <aside>
        <h1>Notes that stay yours.</h1>
        <p>Sign in to write, edit and keep your notes behind your own account.</p>
      </aside>
      <main>
        <div className="card">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={isLogin} onClick={() => switchMode('login')}>Sign in</button>
            <button role="tab" aria-selected={!isLogin} onClick={() => switchMode('register')}>Create account</button>
          </div>
          <form onSubmit={submit}>
            <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            {!isLogin && (
              <label className="field"><span>Name</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" required /></label>
            )}
            <label className="field"><span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required /></label>
            <label className="field"><span>Password</span>
              <input type="password" value={form.password} onChange={set('password')} minLength={isLogin ? undefined : 6}
                autoComplete={isLogin ? 'current-password' : 'new-password'} required /></label>
            {!isLogin && (
              <>
                <label className="field"><span>Interests (separate with commas, optional)</span>
                  <input value={form.interests} onChange={set('interests')} placeholder="coding, music" /></label>
                <label className="field"><span>Account type</span>
                  <select value={form.role} onChange={set('role')}>
                    <option value="User">User</option><option value="Admin">Admin</option>
                  </select></label>
                {form.role === 'Admin' && (
                  <label className="field"><span>Admin code</span>
                    <input type="password" value={form.adminCode} onChange={set('adminCode')} autoComplete="off" required /></label>
                )}
              </>
            )}
            <p className="err" role="alert">{error}</p>
            <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
              {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
