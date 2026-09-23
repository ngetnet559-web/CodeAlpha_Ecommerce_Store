import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

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

      toast.success("Order placed successfully!");

      navigate("/order-confirmation", {
        state: {
          order: data,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before continuing to checkout.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-sm font-medium text-gray-500 transition hover:text-black"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your delivery information and place your order.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Where should we deliver your order?
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address"
                    rows={4}
                    autoComplete="street-address"
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Method
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose how you would like to pay.
              </p>

              <div className="mt-6">
                <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-black bg-gray-50 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="font-medium text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>

                <div className="mt-3 flex cursor-not-allowed items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-60">
                  <input
                    type="radio"
                    disabled
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="font-medium text-gray-700">
                      Online Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Online payment will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black px-5 py-3.5 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Your final total is calculated and verified securely by
              the server.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;