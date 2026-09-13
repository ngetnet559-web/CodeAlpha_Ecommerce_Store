import { useCart } from "../context/useCart";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="mt-8 text-gray-500">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.product_id)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.product_id)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Cart;