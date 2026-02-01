// src/components/Cart.jsx - PERFECTLY STABLE ✅
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api, token, user } = useAuth();
  const navigate = useNavigate();

  // 🔥 STABLE fetchCart - Won't loop
  const fetchCart = useCallback(async () => {
    // ✅ CRITICAL: Only call with VALID token
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/cart/items/");
      const items = data.results || data;
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Cart fetch failed:", error);
      // 401 handled by AuthContext interceptor
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, api]);

  // 🔥 PERFECT useEffect - Stable dependency
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    try {
      if (quantity <= 0) {
        await api.delete(`/cart/items/${itemId}/`);
      } else {
        await api.patch(`/cart/items/${itemId}/`, { quantity });
      }
      fetchCart();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;
    try {
      await api.delete(`/cart/items/${itemId}/`);
      fetchCart();
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + parseFloat(item.product_price || 0) * (item.quantity || 0);
  }, 0);

  // 🔥 EARLY RETURNS - NO API CALLS
  if (loading) {
    return <div className="text-center py-20 text-2xl">Loading cart...</div>;
  }

  if (!token || !user) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-3xl font-bold mb-4">Please login to view cart</h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700"
        >
          Go to Login →
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add fresh produce to get started!</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <div className="text-2xl font-semibold text-gray-700">
          {cartItems.length} items
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl border border-emerald-100"
            >
              <div className="flex gap-6 lg:gap-8 items-start">
                <div className="w-28 h-28 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
                  🥑
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {item.product_name}
                  </h3>
                  <p className="text-emerald-600 text-3xl font-black mb-4">
                    KSh{" "}
                    {(
                      parseFloat(item.product_price || 0) * item.quantity
                    ).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-lg mb-6">
                    KSh {parseFloat(item.product_price || 0).toLocaleString()} ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-4 self-start">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    −
                  </button>
                  <span className="text-3xl font-black w-20 text-center min-w-[5rem]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-emerald-100 sticky top-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Order Summary
            </h3>
            <div className="space-y-4 mb-12">
              <div className="flex justify-between text-2xl">
                <span>Total ({cartItems.length} items):</span>
                <span className="font-black text-4xl text-emerald-600">
                  KSh {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-6 px-8 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl hover:from-emerald-700 transform hover:-translate-y-1 transition-all mb-6"
            >
              Proceed to Checkout →
            </button>
            <div className="text-center text-lg text-gray-600 pt-6 border-t border-emerald-200">
              💰 Cash on Delivery Available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
