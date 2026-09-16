import { useCart } from "../context/useCart";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login before checkout");
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty");
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
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      clearCart();

      alert("Order placed successfully!");

      console.log("Created order:", data);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-lg text-gray-600">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-full rounded-md object-cover sm:w-24"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      ${item.price}
                    </p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded border bg-gray-100 text-lg hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded border bg-gray-100 text-lg hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total + Remove */}
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-lg bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mb-4 flex justify-between text-gray-600">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="mb-6 flex justify-between border-t pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;