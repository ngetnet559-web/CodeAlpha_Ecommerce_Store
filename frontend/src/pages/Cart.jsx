import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const Cart = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;

  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-2 text-gray-500">
              Review your items before checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="w-fit text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => {
              const isOutOfStock = item.stock <= 0;
              const reachedStock = item.quantity >= item.stock;

              return (
                <div
                  key={item.product_id}
                  className="rounded-xl bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            {item.type}
                          </p>

                          <Link
                            to={`/products/${item.product_id}`}
                            className="mt-1 block text-lg font-semibold text-gray-900 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <p className="text-lg font-bold text-gray-900">
                          $
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        ${Number(item.price).toFixed(2)} each
                      </p>

                      {isOutOfStock && (
                        <p className="mt-3 text-sm font-medium text-red-600">
                          This product is currently out of stock.
                        </p>
                      )}

                      {!isOutOfStock && reachedStock && (
                        <p className="mt-3 text-xs text-gray-500">
                          Maximum available quantity reached.
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.product_id)
                            }
                            disabled={item.quantity <= 1}
                            className="h-10 w-10 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                          >
                            −
                          </button>

                          <span className="flex h-10 w-12 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.product_id)
                            }
                            disabled={
                              isOutOfStock || reachedStock
                            }
                            className="h-10 w-10 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.product_id)
                          }
                          className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>

                  <span className="font-medium text-gray-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-black hover:underline"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs leading-5 text-gray-400">
                  Shipping and final order totals are calculated
                  again by the server during checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;