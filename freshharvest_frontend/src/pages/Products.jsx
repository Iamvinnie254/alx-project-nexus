import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

const API_BASE = "http://127.0.0.1:8000/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    price_min: "",
    price_max: "",
    sort: "price",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/products/categories/`);
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Categories error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/products/?page=${currentPage}&page_size=12`;

      // query params
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.search) url += `&search=${filters.search}`;
      if (filters.price_min) url += `&price_min=${filters.price_min}`;
      if (filters.price_max) url += `&price_max=${filters.price_max}`;
      if (filters.sort) url += `&ordering=${filters.sort}`;

      const { data } = await axios.get(url);
      setProducts(Array.isArray(data.results) ? data.results : []);
      setTotalPages(Math.ceil(data.count / 12));
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      search: "",
      price_min: "",
      price_max: "",
      sort: "price",
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Filters Bar */}
      <div className="bg-white sticky top-24 z-30 border-b shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left - Results + Search */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search avocados, tomatoes, kale..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
              </select>
            </div>

            {/* Right - Filters Button */}
            <button className="lg:hidden px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
              Filters <FunnelIcon className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-2 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters For Desktop */}
          <div className="lg:w-80 lg:shrink-0 hidden lg:block">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-40 h-fit">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <FunnelIcon className="w-8 h-8 text-emerald-600 mr-3" />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Categories
                </label>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center cursor-pointer p-3 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={filters.category === cat.id.toString()}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            category: cat.id.toString(),
                          })
                        }
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-lg font-medium text-gray-700">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                >
                  Clear all
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.price_min}
                      onChange={(e) =>
                        setFilters({ ...filters, price_min: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={filters.price_max}
                      onChange={(e) =>
                        setFilters({ ...filters, price_max: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-800">All Products</h1>
              <p className="text-lg text-gray-600">{products.length} results</p>
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-16 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                            currentPage === page
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-white text-gray-700 hover:bg-emerald-50 border hover:shadow-md"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <div className="text-6xl mb-6">🥬</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  No products found
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Try adjusting your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-emerald-700 shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
