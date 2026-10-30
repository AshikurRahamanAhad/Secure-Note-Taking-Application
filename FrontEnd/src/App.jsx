import { useState } from 'react';
import { Shield, LogOut, Users, FileText, PieChart } from 'lucide-react';
import AuthForm from './components/AuthForm';
import NoteManager from './components/NoteManager';
import AdminDashboard from './components/AdminDashboard';

const API_BASE_URL = 'https://secure-note-taking-application.onrender.com';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [activeTab, setActiveTab] = useState('notes');

  const handleAuthSuccess = (newToken, newRole) => {
    setToken(newToken);
    setUserRole(newRole);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
  };

  const handleLogout = () => {
    setToken('');
    setUserRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-indigo-400" />
          <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Secure Notes Vault</h1>
        </div>
        {token && (
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-semibold uppercase">{userRole}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-rose-400 transition"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6">
        {!token ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} API_BASE_URL={API_BASE_URL} />
        ) : (
          <div>
            <div className="flex border-b border-slate-800 mb-6">
              <button onClick={() => setActiveTab('notes')} className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}>
                <FileText className="w-4 h-4" /> My Notes
              </button>
              {userRole === 'Admin' && (
                <>
                  <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition ${activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}>
                    <Users className="w-4 h-4" /> All Users ($lookup)
                  </button>
                  <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition ${activeTab === 'stats' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}>
                    <PieChart className="w-4 h-4" /> Interest Stats ($unwind)
                  </button>
                </>
              )}
            </div>

            {activeTab === 'notes' && <NoteManager token={token} API_BASE_URL={API_BASE_URL} />}
            {activeTab === 'users' && userRole === 'Admin' && <AdminDashboard token={token} API_BASE_URL={API_BASE_URL} activeTab="users" />}
            {activeTab === 'stats' && userRole === 'Admin' && <AdminDashboard token={token} API_BASE_URL={API_BASE_URL} activeTab="stats" />}
          </div>
        )}
      </main>
    </div>
  );
}