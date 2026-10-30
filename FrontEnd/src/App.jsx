import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import AuthPage from './components/AuthPage.jsx';
import NotesPage from './components/NotesPage.jsx';

function Shell() {
  const { token } = useAuth();
  const [toast, setToast] = useState('');
  const timer = useRef();
  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 3000);
  }, []);

  return (
    <>
      {token ? <NotesPage notify={notify} /> : <AuthPage notify={notify} />}
      {toast && <div id="toast" role="status">{toast}</div>}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const t = localStorage.getItem('sn_theme');
    if (t) document.documentElement.dataset.theme = t;
  }, []);
  return <AuthProvider><Shell /></AuthProvider>;
}
