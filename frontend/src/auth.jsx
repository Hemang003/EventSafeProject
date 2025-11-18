// src/auth.js
import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as apiLogin, signup as apiSignup } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function load() {
      if (!token) return setLoading(false);
      try {
        const me = await getMe(token);
        setUser(me.user || me);
      } catch {
        setToken("");
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  async function login(email, password) {
    const res = await apiLogin(email, password);
    const tok = res.access_token;
    localStorage.setItem("access_token", tok);
    setToken(tok);
    const me = await getMe(tok);
    setUser(me.user || me);
  }

  async function signup(name, email, password) {
    await apiSignup(name, email, password);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken("");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ token, user, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
