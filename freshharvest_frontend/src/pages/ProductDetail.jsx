import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, StarIcon } from "@heroicons/react/24/outline";

const API_BASE = "http://127.0.0.1:8000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/products/${id}/`);
      setProduct(data);
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to add to cart");
      navigate("/login");
      return;
    }

    setLoadingCart(true);
    try {
      await axios.post(
        `${API_BASE}/orders/cart/items/`,
        { product: id, quantity },
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
        alert("Please login to continue");
        navigate("/login");
      } else {
        alert("Error adding to cart");
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const incrementQuantity = () => setQuantity(Math.min(quantity + 1, 99));
  const decrementQuantity = () => setQuantity(Math.max(quantity - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-50">
        <div className="text-2xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-6">🥬</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Product Image */}
          <div className="lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl p-4 lg:p-8 sticky top-32 lg:top-40">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl overflow-hidden flex items-center justify-center mb-6 lg:mb-8">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-6xl lg:text-7xl">🥑</span>
                )}
              </div>

              {/* Thumbnail Gallery (if multiple images) */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {[product.image || "/api/placeholder/400/400"].map(
                  (img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:order-2">
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-12 sticky top-32 lg:top-40 lg:max-h-[80vh] overflow-y-auto">
              {/* Product Title + Farmer */}
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <div className="flex items-center mr-6">
                    <span className="text-emerald-600 font-bold text-3xl mr-2">
                      by
                    </span>
                    <span className="font-semibold">{product.farmer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating || 4.5) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-medium">4.5 (23)</span>
                  </div>
                </div>
              </div>

              {/* Price + Availability */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl mb-8 border border-emerald-100">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl lg:text-5xl font-black text-emerald-600">
                    KSh {parseFloat(product.price || 0).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 ml-4 line-through">
                    KSh {(product.price * 1.2).toLocaleString()}
                  </span>
                  <span className="ml-4 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                    17% OFF
                  </span>
                </div>
                <div
                  className={`px-4 py-2 rounded-full inline-block text-sm font-semibold ${
                    product.is_available
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {product.is_available ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Quantity
                </label>
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 max-w-max">
                  <button
                    onClick={decrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-white rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="px-6 py-4 text-2xl font-bold text-gray-800 bg-white rounded-xl mx-1">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-white rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {product.weight_per_unit || "per kg"} • Total: KSh{" "}
                  {(quantity * parseFloat(product.price || 0)).toLocaleString()}
                </p>
              </div>

              {/* Category + Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Category:</span>
                  <p className="text-emerald-600 font-medium">
                    {product.category_name}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Weight:</span>
                  <p>{product.weight_per_unit || "1 kg"}</p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={!product.is_available || loadingCart}
                className={`w-full py-5 px-8 rounded-3xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center justify-center ${
                  product.is_available
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:shadow-3xl hover:-translate-y-1"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loadingCart ? (
                  <>
                    <svg
                      className="animate-spin w-6 h-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-7 h-7 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 3.5A2 2 0 005 19h14a2 2 0 001.1-3.7l-1.5-3.5zM16 9a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              {/* Description */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description ||
                    "Premium quality produce straight from Nairobi small-scale farmers. Freshly harvested and delivered to your door within 24 hours. Perfect for healthy cooking and Nairobi lifestyles."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
