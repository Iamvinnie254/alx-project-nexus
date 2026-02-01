import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { api, token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart/items/");
      setCartItems(data.results || data || []);
    } catch (error) {
      console.error("Cart fetch failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      setMessage("❌ Please enter delivery address");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("❌ Cart is empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/checkout/", {
        delivery_address: deliveryAddress,
        order_notes: orderNotes || "",
        cart_items: cartItems.map((item) => ({
          product_id: item.product.id || item.product,
          quantity: item.quantity,
        })),
      });

      setMessage(`✅ Order placed successfully!`);

      setCartItems([]);
      setTimeout(() => navigate("/orders"), 1500);
    } catch (error) {
      console.error("Checkout error:", error.response?.data);
      setMessage(
        `❌ ${error.response?.data?.detail || error.response?.data?.error || "Checkout failed"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product_price || item.product?.price || 0;
    return total + parseFloat(price) * item.quantity;
  }, 0);

  if (!token || !user) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-3xl font-bold mb-4">Please login to checkout</h2>
        <button
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl hover:bg-emerald-700"
          onClick={() => navigate("/login")}
        >
          Go to Login →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Checkout</h1>
        <p className="text-2xl text-emerald-600 font-semibold">
          {cartItems.length} items • KSh {cartTotal.toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        {/* DELIVERY INFO */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">📍 Delivery Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Kilimani, Nairobi, House 123"
                  className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">
                  Order Notes
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Call before delivery, leave at security"
                  rows="3"
                  className="w-full p-4 border rounded-xl text-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">💳 Payment</h3>
            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  className="mr-3 w-5 h-5"
                  defaultChecked
                />
                <label htmlFor="cod" className="text-xl font-semibold">
                  💰 Cash on Delivery
                </label>
              </div>
              <p className="text-gray-600 mt-2">
                Pay when you receive your fresh produce
              </p>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div>
          <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-8">
            <h3 className="text-2xl font-bold mb-8">🛒 Order Summary</h3>

            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-4 border-b"
                >
                  <div>
                    <div className="font-semibold text-lg">
                      {item.product_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      × {item.quantity}
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    KSh{" "}
                    {(
                      parseFloat(item.product_price || 0) * item.quantity
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="text-emerald-600">
                  KSh {cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !deliveryAddress.trim()}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-2xl text-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "⏳ Placing Order..." : "✅ Complete Order"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {message && (
        <div
          className={`mt-8 p-8 rounded-3xl text-xl font-bold text-center shadow-2xl ${
            message.includes("✅")
              ? "bg-emerald-100 text-emerald-800 border-4 border-emerald-400"
              : "bg-red-100 text-red-800 border-4 border-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Checkout;
