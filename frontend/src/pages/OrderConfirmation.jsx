import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OrderConfirmation = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in to view this order");
        }

        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load order");
        }

        setOrder(data);
      } catch (error) {
        console.error("Order confirmation error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-200" />

          <div className="mx-auto mt-6 h-8 w-72 rounded bg-gray-200" />

          <div className="mx-auto mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />

          <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
            <div className="h-6 w-40 rounded bg-gray-200" />

            <div className="mt-6 space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="h-20 w-20 rounded-lg bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-24 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Unable to load order
          </h1>

          <p className="mt-3 text-gray-500">{error}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Thank you for your purchase. Your order has been received
            and is being processed.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Order number:{" "}
            <span className="font-semibold text-gray-900">
              #{order.id}
            </span>
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Order status</p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {order.status}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">Placed on</p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Items
            </h2>

            <div className="mt-6 space-y-5">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ${Number(item.price).toFixed(2)} each
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
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Delivery Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Full name</p>
                <p className="mt-1 font-medium text-gray-900">
                  {order.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1 font-medium text-gray-900">
                  {order.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="mt-1 font-medium text-gray-900">
                  {order.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="mt-1 font-medium capitalize text-gray-900">
                  {order.paymentMethod}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="mt-1 font-medium text-gray-900">
                  {order.address}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 sm:p-8">
            <div className="ml-auto max-w-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>

                <span>
                  ${Number(order.shippingFee).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${order.id}`}
            className="rounded-lg bg-black px-6 py-3 text-center font-medium text-white transition hover:bg-gray-800"
          >
            View Order Details
          </Link>

          <Link
            to="/products"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;