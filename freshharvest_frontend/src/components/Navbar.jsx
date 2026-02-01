// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext"; // ✅ Your existing context path

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, cartCount } = useCart(); // ✅ Using YOUR CartContext API
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Use cartItems.length as fallback if cartCount not available
  const cartItemCount = cartCount || cartItems?.length || 0;

  return (
    <>
      {/* Fullscreen Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100">
        {/* DESKTOP NAVBAR */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent hover:scale-105 transition-all"
            >
              FreshHarvest
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-lg font-medium text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50/80 transition-all"
              >
                🏠 Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-medium text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50/80 transition-all"
              >
                🥬 Products
              </Link>

              {/* CART WITH LIVE COUNT */}
              <Link
                to="/cart"
                className="relative p-3 hover:bg-emerald-50/80 rounded-2xl transition-all group"
              >
                <span className="text-2xl">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="text-lg font-medium text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50/80 transition-all"
              >
                📋 Orders
              </Link>

              {/* AUTH SECTION */}
              <div className="flex items-center space-x-4 ml-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 bg-emerald-50/50 px-4 py-2 rounded-2xl backdrop-blur-sm border border-emerald-100/50">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 max-w-24 truncate">
                        {user.username}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.user_type === "farmer"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {user.user_type}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="text-red-600 hover:text-red-700 font-semibold px-6 py-3 rounded-xl hover:bg-red-50/50 transition-all shadow-sm hover:shadow-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE NAVBAR - SAME STRUCTURE, SIMPLIFIED */}
        <div className="lg:hidden w-full px-4 py-4">
          <div className="flex items-center justify-between w-full max-w-full">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent"
            >
              FreshHarvest
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-2xl shadow-md transition-all duration-300 ${
                isOpen
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-emerald-200 hover:shadow-emerald-300"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180 scale-110" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU - UPDATED CART COUNT */}
        <div
          className={`
            lg:hidden fixed top-16 left-0 right-0 z-40
            bg-white/98 backdrop-blur-2xl shadow-2xl border-b-4 border-emerald-200
            overflow-hidden transition-all duration-500 ease-out
            ${isOpen ? "max-h-[70vh] opacity-100 py-6 px-4" : "max-h-0 opacity-0 py-0"}
            w-full max-w-full
          `}
        >
          <div className="w-full space-y-4">
            <Link
              to="/"
              className="block py-4 px-6 text-xl font-bold text-gray-800 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all shadow-sm hover:shadow-md border hover:border-emerald-200"
              onClick={() => setIsOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              to="/products"
              className="block py-4 px-6 text-xl font-bold text-gray-800 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all shadow-sm hover:shadow-md border hover:border-emerald-200"
              onClick={() => setIsOpen(false)}
            >
              🥬 Products
            </Link>
            <Link
              to="/cart"
              className="py-4 px-6 text-xl font-bold text-gray-800 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all shadow-sm hover:shadow-md border hover:border-emerald-200 flex items-center justify-between"
              onClick={() => setIsOpen(false)}
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg ml-4">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="block py-4 px-6 text-xl font-bold text-gray-800 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all shadow-sm hover:shadow-md border hover:border-emerald-200"
              onClick={() => setIsOpen(false)}
            >
              📋 Orders
            </Link>

            {/* AUTH SECTION MOBILE - SAME AS BEFORE */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-3xl border-2 border-emerald-200/50 shadow-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-800 mb-1">
                          Welcome!
                        </h3>
                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                          {user.username}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                          user.user_type === "farmer"
                            ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
                            : "bg-emerald-100 text-emerald-800 border-2 border-emerald-200"
                        }`}
                      >
                        {user.user_type}
                      </span>
                    </div>
                  </div>
                  <button
                    className="w-full py-5 px-6 text-xl font-bold text-red-600 hover:text-red-700 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 rounded-3xl shadow-lg hover:shadow-xl border-2 border-red-200/50 transition-all duration-300"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full block text-center bg-gradient-to-r from-emerald-600 to-green-600 text-white py-6 px-8 rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-700 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  👋 Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
};

export default Navbar;
