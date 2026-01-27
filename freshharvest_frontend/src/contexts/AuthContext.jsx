import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiClient } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await apiClient.get("/users/me/");
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post("/auth/login/", {
        email,
        password,
      });
      const accessToken = data.access;

      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      await fetchUser();
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // allow component to handle error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
