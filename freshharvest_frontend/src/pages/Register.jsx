import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    user_type: "consumer",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.password_confirm) {
      setErrors({ password_confirm: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setErrors({});
    setGeneralError("");

    const result = await register(formData);

    if (result.success) {
      navigate("/");
    } else {
      setGeneralError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-linear-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 13.951V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-5.051c0-.462.178-.913.504-1.247l3.323-4.169a2 2 0 012.646-2.434h.001zM12 12a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
            Join FreshHarvest
          </h1>
          <p className="text-xl text-gray-600">
            Create your account in 1 minute
          </p>
        </div>

        {/* General Error */}
        {generalError && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-6 py-4 rounded-2xl mb-8">
            {generalError}
          </div>
        )}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 lg:p-10 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="Jane Doe"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="jane@nairobi.co.ke"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="+254723456789"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="Westlands, Nairobi"
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:shadow-md cursor-pointer transition-all hover:border-emerald-300 group">
                  <input
                    type="radio"
                    name="user_type"
                    value="consumer"
                    checked={formData.user_type === "consumer"}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-emerald-600">
                      🛒 Consumer
                    </div>
                    <div className="text-sm text-gray-600">
                      Buy fresh produce
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:shadow-md cursor-pointer transition-all hover:border-emerald-300 group">
                  <input
                    type="radio"
                    name="user_type"
                    value="farmer"
                    checked={formData.user_type === "farmer"}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-emerald-600">
                      🌾 Farmer
                    </div>
                    <div className="text-sm text-gray-600">
                      Sell your harvest
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-4 pr-12 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showPassword
                          ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      }
                    />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Password Confirm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 pr-12 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all shadow-sm"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showConfirmPassword
                          ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      }
                    />
                  </svg>
                </button>
              </div>
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirm}
                </p>
              )}
            </div>
            {/* Password Strength Hint */}
            <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm">
              <p className="text-gray-700 mb-1">💪 Strong password needs:</p>
              <div className="text-xs space-y-1">
                <div
                  className={`flex items-center ${formData.password.length >= 8 ? "text-emerald-600" : "text-gray-500"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? "bg-emerald-500" : "bg-gray-300"}`}
                  ></div>
                  8+ characters
                </div>
                <div
                  className={`flex items-center ${/[A-Z]/.test(formData.password) ? "text-emerald-600" : "text-gray-500"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
                  ></div>
                  Uppercase letter
                </div>
                <div
                  className={`flex items-center ${/[0-9]/.test(formData.password) ? "text-emerald-600" : "text-gray-500"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
                  ></div>
                  Number
                </div>
                <div
                  className={`flex items-center ${/[^a-zA-Z0-9]/.test(formData.password) ? "text-emerald-600" : "text-gray-500"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[^a-zA-Z0-9]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
                  ></div>
                  Special character
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-emerald-600 to-green-600 text-white py-5 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create My Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
