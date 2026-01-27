// src/components/Navbar.jsx - MOBILE WIDTH FIXED
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fullscreen Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FIXED NAVBAR - CONTAINER WIDTH */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100 lg:border-b-0">
        {/* Desktop */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent"
            >
              FreshHarvest
            </Link>
            {/* Desktop links... */}
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Products
              </Link>
              <Link to="/cart" className="relative p-2">
                🛒
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE - FULL WIDTH CONTAINER */}
        <div className="lg:hidden w-full px-4 py-4 max-w-full">
          <div className="flex items-center justify-between w-full">
            <Link
              to="/"
              className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent"
            >
              FreshHarvest
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100"
            >
              <svg
                className={`w-6 h-6 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU - FULL WIDTH NO OVERFLOW */}
        <div
          className={`
          lg:hidden fixed top-16 left-0 right-0 z-40
          bg-white/98 backdrop-blur-2xl shadow-2xl border-b border-emerald-200
          overflow-hidden transition-all duration-500 ease-out
          ${isOpen ? "max-h-[70vh] opacity-100 py-6 px-4" : "max-h-0 opacity-0 py-0"}
          w-full max-w-full
        `}
        >
          <div className="w-full space-y-4">
            {/* Menu items - responsive text */}
            <Link
              to="/"
              className="block py-3 px-4 text-lg font-semibold text-gray-800 hover:bg-emerald-50 rounded-xl w-full"
              onClick={() => setIsOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              to="/products"
              className="block py-3 px-4 text-lg font-semibold text-gray-800 hover:bg-emerald-50 rounded-xl w-full"
              onClick={() => setIsOpen(false)}
            >
              🥬 Products
            </Link>
            <Link
              to="/cart"
              className="py-3 px-4 text-lg font-semibold text-gray-800 hover:bg-emerald-50 rounded-xl w-full flex items-center"
              onClick={() => setIsOpen(false)}
            >
              🛒 Cart{" "}
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                3
              </span>
            </Link>
            {user ? (
              <button
                className="w-full py-3 px-4 text-lg text-red-600 hover:bg-red-50 rounded-xl"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                🚪 Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full block text-center bg-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg"
                onClick={() => setIsOpen(false)}
              >
                👋 Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
};

export default Navbar;
