import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ORDERS_STATUSES = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { api, token, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/orders/");
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Orders fetch failed:", error);
      if (error.response?.status === 401) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, api]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleFocus = () => fetchOrders();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-8 animate-pulse">🔐</div>
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Please login to view orders
        </h2>
        <p className="text-xl text-gray-600 mb-8">Your session has expired</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-linear-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-3xl text-xl font-bold hover:from-emerald-700 shadow-xl hover:shadow-2xl transition-all"
        >
          Login to Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
          Your Orders
        </h1>
        <p className="text-2xl text-gray-600">
          {loading ? "Loading..." : `${orders.length} orders found`}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-2xl text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-8">📦</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            No orders yet
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start shopping to see your orders here
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-linear-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-3xl text-xl font-bold hover:from-emerald-700 shadow-xl hover:shadow-2xl transition-all"
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <>
          {/* ORDERS LIST */}
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl border border-gray-100 cursor-pointer transition-all hover:-translate-y-1 group"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-all">
                      📦
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        Order #{order.order_number || order.id}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {formatDate(order.created_at)}
                      </p>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} shadow-md`}
                      >
                        {order.status_display || order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-end sm:items-center">
                    <div className="text-right">
                      <p className="text-3xl font-black text-emerald-600">
                        KSh {parseFloat(order.total || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        {order.total_items || 0} items
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {order.delivery_address?.split(",")[0] || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SELECTED ORDER DETAILS MODAL - UNCHANGED */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Your existing modal code stays exactly the same */}
                <div className="p-8 border-b">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-3xl hover:text-emerald-600 font-bold hover:scale-110 transition-all"
                      >
                        ×
                      </button>
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                          Order #
                          {selectedOrder.order_number || selectedOrder.id}
                        </h2>
                        <span
                          className={`px-4 py-2 rounded-full text-lg font-bold ${getStatusColor(selectedOrder.status)}`}
                        >
                          {selectedOrder.status_display || selectedOrder.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-emerald-600 mb-1">
                        KSh{" "}
                        {parseFloat(selectedOrder.total || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.total_items || 0} items
                      </p>
                    </div>
                  </div>
                </div>

                {/* TRACKING + ITEMS - Your existing code stays the same */}
                <div className="p-8 border-b">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    Order Progress
                  </h3>
                  <div className="flex items-center justify-between mb-8">
                    {["pending", "processing", "shipped", "delivered"].map(
                      (step, index) => {
                        const isActive =
                          selectedOrder.status?.toLowerCase() === step;
                        const isCompleted =
                          ["processing", "shipped", "delivered"].includes(
                            selectedOrder.status?.toLowerCase(),
                          ) &&
                          index <
                            [
                              "pending",
                              "processing",
                              "shipped",
                              "delivered",
                            ].indexOf(selectedOrder.status?.toLowerCase());
                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mb-2 transition-all ${
                                isCompleted
                                  ? "bg-emerald-500 text-white shadow-lg"
                                  : isActive
                                    ? "bg-emerald-400 text-white shadow-lg ring-4 ring-emerald-200"
                                    : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {isCompleted ? "✅" : index + 1}
                            </div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              {step}
                            </div>
                            {index < 3 && (
                              <div
                                className={`flex-1 w-1 bg-linear-to-t ${
                                  isCompleted
                                    ? "from-emerald-500 to-transparent"
                                    : "from-gray-200 to-transparent"
                                } mx-6 lg:mx-0`}
                              ></div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-6 p-6 bg-gray-50 rounded-2xl"
                      >
                        <div className="w-24 h-24 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                          {item.product_name.charAt(0).toLowerCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2">
                            {item.product_name}
                          </h4>
                          <p className="text-2xl font-black text-emerald-600 mb-1">
                            KSh{" "}
                            {(
                              parseFloat(item.price || 0) * item.quantity
                            ).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            Qty: {item.quantity} × KSh{" "}
                            {parseFloat(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 pt-0 border-t">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p>
                        <span className="font-semibold">Delivery Address:</span>
                      </p>
                      <p className="mt-1">{selectedOrder.delivery_address}</p>
                    </div>
                    {selectedOrder.order_notes && (
                      <div>
                        <p>
                          <span className="font-semibold">Notes:</span>
                        </p>
                        <p className="mt-1 italic text-gray-600">
                          {selectedOrder.order_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
