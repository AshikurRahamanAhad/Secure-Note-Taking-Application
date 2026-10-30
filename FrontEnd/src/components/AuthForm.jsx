import { useState } from 'react';
import { User, Mail, Lock, KeyRound, X } from 'lucide-react';

export default function AuthForm({ onAuthSuccess, API_BASE_URL }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [adminCode, setAdminCode] = useState('');
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (tagToRemove) => {
    setInterests(interests.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password }
      : { name, email, password, role, interests, ...(role === 'Admin' && { adminCode }) };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      if (isLogin) {
        onAuthSuccess(data.token, data.role || 'User');
      } else {
        setMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-slate-800/50 border border-slate-700/60 p-8 rounded-2xl shadow-xl backdrop-blur">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-400 text-sm mt-1">{isLogin ? 'Log in to access your notes' : 'Register with interests & role'}</p>
      </div>

      {error && <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-lg text-sm">{error}</div>}
      {message && <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="email" required placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {role === 'Admin' && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg">
                <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">Admin Passcode</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
                  <input type="password" required placeholder="Admin secret code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-lg py-2 pl-9 pr-3 text-sm text-amber-200 focus:outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Interests</label>
              <div className="flex gap-2">
                <input type="text" placeholder="e.g. Coding" value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500" />
                <button type="button" onClick={handleAddInterest} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm">Add</button>
              </div>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {interests.map((tag, idx) => (
                    <span key={idx} className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      {tag} <button type="button" onClick={() => handleRemoveInterest(tag)}><X className="w-3 h-3 hover:text-rose-400" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-lg font-medium text-white transition mt-2">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-xs text-indigo-400 hover:underline">
          {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}