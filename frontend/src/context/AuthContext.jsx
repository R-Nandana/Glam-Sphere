import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('glamsphere_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      localStorage.setItem('glamsphere_user', JSON.stringify(data.user));
    } catch {
      setUser(null);
      localStorage.removeItem('glamsphere_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    localStorage.setItem('glamsphere_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    localStorage.setItem('glamsphere_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    localStorage.removeItem('glamsphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
