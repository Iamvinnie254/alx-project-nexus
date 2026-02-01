import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000/api";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoriesRes = await axios.get(`${API_BASE}/products/categories/`);
      setCategories(
        Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : categoriesRes.data.results || [],
      );
      const productsRes = await axios.get(`${API_BASE}/products/?page_size=8`);
      setProducts(
        Array.isArray(productsRes.data.results) ? productsRes.data.results : [],
      );
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-xl text-gray-700">Loading FreshHarvest...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-red-600 text-xl p-8 bg-red-50 rounded-xl max-w-md mx-4 text-center">
          {error}
          <button
            onClick={fetchData}
            className="ml-4 bg-emerald-600 text-white px-6 py-2 rounded-xl mt-4 hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Hero */}
      <section className="relative bg-linear-to-r from-emerald-600 to-green-700 text-white py-32 pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            FreshHarvest
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Farm-fresh produce delivered from Nairobi small-scale farmers to
            your door
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-emerald-700 px-8 sm:px-12 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-xl hover:shadow-2xl"
          >
            Shop Fresh Produce
          </a>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-linear-to-br from-green-100 to-emerald-200 p-6 sm:p-8 rounded-2xl hover:shadow-2xl h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl">
                      {cat.name.charAt(0).toLowerCase()}
                    </div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-800">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800">
            Fresh Picks
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-6">
                No products available right now.
              </p>
              <button
                onClick={fetchData}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
