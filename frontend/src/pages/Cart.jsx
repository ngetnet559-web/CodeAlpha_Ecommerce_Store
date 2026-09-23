import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Your shopping bag
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Image */}
                    <Link
                      to={`/products/${item.product_id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-full rounded-lg object-cover sm:h-24 sm:w-24"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {item.type}
                      </p>

                      <Link
                        to={`/products/${item.product_id}`}
                        className="mt-1 block text-lg font-semibold text-gray-900 hover:underline"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity */}
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="flex h-9 w-12 items-center justify-center border-y border-gray-300 text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-lg hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="text-lg font-bold text-gray-900">
                        $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() =>
                          removeFromCart(item.product_id)
                        }
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
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
            <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Items ({cart.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )})
                  </span>

                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between border-t pt-4 text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                Checkout
              </Link>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-black hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;