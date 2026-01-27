// src/components/ProductCard.jsx - ADD LINK
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    // Quick add (same as before)
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/orders/cart/items/",
        {
          product: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Added to cart!");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login to add to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="block group" // ← LINK WRAPPER
    >
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
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
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
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              e.stopPropagation();
              addToCart();
            }}
            disabled={!product.is_available || loading}
            className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all mt-2 ${
              product.is_available
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600"
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
