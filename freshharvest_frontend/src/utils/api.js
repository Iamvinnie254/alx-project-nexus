import axios from "axios";

// Base URL for your backend
const API_BASE = "http://127.0.0.1:8000/api";

// Structured API endpoints
export const api = {
  // Auth
  auth: {
    register: `${API_BASE}/auth/register/`,
    login: `${API_BASE}/auth/login/`,
  },
  // Products
  products: {
    list: `${API_BASE}/products/`,
    categories: `${API_BASE}/products/categories/`,
  },
  // Orders
  orders: {
    cart: `${API_BASE}/orders/cart/items/`,
    orders: `${API_BASE}/orders/orders/`,
  },
  // Users
  users: {
    me: `${API_BASE}/users/me/`,
  },
};

// Axios instance for requests
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Optional: intercept requests to attach token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: intercept responses to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: logout if unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // Or redirect to login
    }
    return Promise.reject(error);
  },
);
