import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Order not found
          </h1>

          <p className="mt-3 text-gray-500">
            We couldn't find the order confirmation details.
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Message */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order placed successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Thank you for your purchase. Your order has been received
            and is now being processed.
          </p>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Order number
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              #{order.id}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">
            {order.orderItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
              >
                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.product?.name || "Product"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  $
                  {(
                    Number(item.price) * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Shipping
              </span>

              <span className="font-medium text-gray-900">
                ${Number(order.shippingFee).toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="font-semibold text-gray-900">
                Total
              </span>

              <span className="text-xl font-bold text-gray-900">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Full name
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.fullName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                City
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Payment
              </p>

              <p className="mt-1 font-medium capitalize text-gray-900">
                {order.paymentMethod}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">
                Delivery address
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.address}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${order.id}`}
            className="rounded-lg bg-black px-6 py-3 text-center font-medium text-white hover:bg-gray-800"
          >
            View Order Details
          </Link>

          <Link
            to="/products"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;