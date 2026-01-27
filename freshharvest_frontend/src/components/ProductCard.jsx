import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
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
      alert("Added to cart! 🛒");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login to add to cart");
      } else {
        alert("Error adding to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 p-6">
      <div className="w-full h-64 bg-linear-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-6xl">🥑</span>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
          {product.name || "Product"}
        </h3>
        <p className="text-emerald-600 font-bold text-2xl">
          KSh {parseFloat(product.price || 0).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          {product.category_name || "Uncategorized"} •{" "}
          {product.weight_per_unit || "kg"}
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
            by {product.farmer_name || "Farmer"}
          </span>
        </div>
        <button
          onClick={addToCart}
          disabled={!product.is_available || loading}
          className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all ${
            product.is_available
              ? "bg-linear-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
