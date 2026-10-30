import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, configureApi } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* storage blocked */ } };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({ token: read('sn_token'), role: read('sn_role') }));

  const logout = useCallback(() => {
    write('sn_token', null); write('sn_role', null);
    setSession({ token: null, role: null });
  }, []);

  // keep the API layer pointed at the current token
  useEffect(() => {
    configureApi({ getToken: () => session.token, onExpire: logout });
  }, [session.token, logout]);
  configureApi({ getToken: () => session.token, onExpire: logout });

  const login = async (credentials) => {
    const d = await api.login(credentials);
    write('sn_token', d.token); write('sn_role', d.role);
    setSession({ token: d.token, role: d.role });
  };

  return <Ctx.Provider value={{ ...session, login, logout, register: api.register }}>{children}</Ctx.Provider>;
}
