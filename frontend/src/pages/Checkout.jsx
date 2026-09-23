import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const items = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          ...formData,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      clearCart();

      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before checking out.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link to="/cart" className="text-sm text-gray-500 hover:text-black">
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">Checkout</h1>

          <p className="mt-2 text-gray-500">
            Complete your information to place your order.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Customer Information */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="09xxxxxxxx"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Your city"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter your delivery address"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="font-medium text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-200 p-4 opacity-50">
                  <input type="radio" disabled />

                  <div>
                    <p className="font-medium text-gray-900">Online Payment</p>

                    <p className="text-sm text-gray-500">Coming soon.</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product_id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t pt-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
