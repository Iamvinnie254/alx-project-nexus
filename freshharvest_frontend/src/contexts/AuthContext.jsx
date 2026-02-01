// src/contexts/AuthContext.jsx - FULLY FIXED
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useRef(
    axios.create({
      baseURL: API_BASE,
      timeout: 10000,
    }),
  ).current;

  // 🔥 FIXED: Single init on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

        try {
          const { data } = await api.get("/users/me/");
          setUser(data);
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
          delete api.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login/", { email, password });
      const accessToken = data.access || data.token;

      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const { data: userData } = await api.get("/users/me/");
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
