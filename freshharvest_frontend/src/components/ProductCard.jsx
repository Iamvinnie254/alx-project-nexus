// src/components/ProductCard.jsx - BACKEND DIRECT
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { api, user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.is_available) return alert("Out of stock!");
    if (!user) return alert("Please login to add to cart");

    setLoading(true);
    try {
      await api.post("/cart/items/", {
        product: product.id, // ✅ Backend expects ID
        quantity: 1,
      });
      alert("✅ Added to cart!");
    } catch (error) {
      console.error("Add failed:", error.response?.data);
      alert(error.response?.data?.detail || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 p-6 h-full">
        <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl overflow-hidden mb-6 group-hover:scale-105 transition-transform">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl flex items-center justify-center h-full">
              🥑
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600">
            {product.name}
          </h3>
          <p className="text-emerald-600 font-bold text-2xl">
            KSh {parseFloat(product.price || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {product.category_name} • {product.weight_per_unit}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.is_available
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.is_available ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-sm text-gray-500">
              by {product.farmer_name}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || loading || !user}
            className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all mt-2 ${
              product.is_available && user
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Adding..." : "Quick Add"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
