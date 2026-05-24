import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock_quantity: "",
  category: "",
  harvest_date: "",
  image: "",
  weight_per_unit: "kg",
};

const FarmerDashboard = () => {
  const { api, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const farmerTotal = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + parseFloat(order.farmer_total || 0),
      0,
    );
  }, [orders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user && user.user_type !== "farmer") {
      navigate("/products");
      return;
    }
    if (user?.user_type === "farmer") {
      fetchDashboard();
    }
  }, [isAuthenticated, user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        api.get("/products/mine/"),
        api.get("/products/categories/"),
        api.get("/orders/farmer/"),
      ]);
      setProducts(productsRes.data.results || productsRes.data || []);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
      setOrders(ordersRes.data.results || ordersRes.data || []);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.post("/products/", {
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        image: form.image || null,
      });
      setForm(emptyProduct);
      setMessage("Product added");
      fetchDashboard();
    } catch (error) {
      const data = error.response?.data;
      setMessage(typeof data === "string" ? data : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const updateStock = async (product, nextQuantity) => {
    const quantity = Math.max(0, Number(nextQuantity));
    try {
      await api.patch(`/products/${product.id}/`, {
        stock_quantity: quantity,
      });
      setProducts((items) =>
        items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock_quantity: quantity,
                is_available: quantity > 0,
              }
            : item,
        ),
      );
    } catch {
      setMessage("Could not update stock");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl text-gray-600">
          Loading farmer dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Farmer workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Manage your harvest
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Add fresh produce, keep stock current, and see orders that include
              your products.
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-emerald-400 hover:text-emerald-700"
          >
            Refresh
          </button>
        </header>

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm text-gray-700">
            {message}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Listed products</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Open orders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.filter((order) => order.status !== "delivered").length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Sales in listed orders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              KSh {farmerTotal.toLocaleString()}
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your products
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">Stock</th>
                    <th className="py-3 pr-4 font-medium">Harvest</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-gray-500">
                          {product.category_name}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        KSh {parseFloat(product.price).toLocaleString()}
                      </td>
                      <td className="py-4 pr-4">
                        <input
                          type="number"
                          min="0"
                          value={product.stock_quantity}
                          onChange={(event) =>
                            updateStock(product, event.target.value)
                          }
                          className="w-24 rounded-lg border border-gray-300 px-3 py-2"
                        />
                      </td>
                      <td className="py-4 pr-4">{product.harvest_date}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.is_available
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.is_available ? "Available" : "Out"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td className="py-8 text-gray-500" colSpan="5">
                        No products yet. Add your first harvest from the form.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={handleCreateProduct}
            className="rounded-lg bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Add produce
            </h2>
            <div className="mt-5 space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Short description"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  placeholder="Stock"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="harvest_date"
                  type="date"
                  value={form.harvest_date}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  name="weight_per_unit"
                  value={form.weight_per_unit}
                  onChange={handleChange}
                  required
                  placeholder="kg, bunch, crate"
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add product"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Orders with your produce
          </h2>
          <div className="mt-5 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.order_number} from {order.buyer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-KE")}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {order.status_display || order.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {order.farmer_items.map((item) => (
                    <div
                      key={`${order.id}-${item.product_name}`}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>KSh {parseFloat(item.subtotal).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 text-sm text-gray-600">
                  Delivery area: {order.delivery_address}
                </div>
              </article>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500">
                Orders that include your produce will appear here.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FarmerDashboard;
