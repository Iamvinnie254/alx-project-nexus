// src/contexts/AuthContext.jsx - FIXED 401 ERROR
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

  // Create axios instance with baseURL
  const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(
        "🔍 Fetching user with token:",
        token.substring(0, 20) + "...",
      );

      const { data } = await api.get("/users/me/");
      setUser(data);
      console.log("✅ User fetched:", data);
    } catch (error) {
      console.error(
        "❌ Fetch user FAILED:",
        error.response?.status,
        error.response?.data,
      );
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log("🔐 LOGIN:", { email });

      const { data } = await api.post("/auth/login/", {
        email,
        password,
      });

      console.log("✅ LOGIN RESPONSE:", Object.keys(data));

      // Handle both access/refresh and token response formats
      const accessToken = data.access || data.token;
      if (!accessToken) {
        throw new Error("No access token in response");
      }

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      return { success: true };
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error.response?.data);
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Invalid credentials";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log("🚀 REGISTER:", userData);

      const { data } = await api.post("/auth/register/", userData);
      console.log("✅ REGISTER SUCCESS:", data);

      // Try login with registered credentials
      const loginResult = await login(userData.email, userData.password);
      return loginResult;
    } catch (error) {
      console.error(
        "❌ REGISTER ERROR:",
        error.response?.status,
        error.response?.data,
      );

      let message = "Registration failed";
      const errorData = error.response?.data;

      if (errorData.password) {
        message = Array.isArray(errorData.password)
          ? errorData.password.join(", ")
          : errorData.password;
      } else if (errorData.email) {
        message = Array.isArray(errorData.email)
          ? errorData.email[0]
          : errorData.email;
      } else if (errorData.username) {
        message = Array.isArray(errorData.username)
          ? errorData.username[0]
          : errorData.username;
      } else if (errorData.detail) {
        message = errorData.detail;
      }

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
    delete api.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
