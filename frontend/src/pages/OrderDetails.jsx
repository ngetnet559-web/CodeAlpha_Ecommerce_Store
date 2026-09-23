import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OrderDetails = () => {
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
        console.error("Order details error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Unable to load order
        </h1>

        <p className="mt-2 text-gray-500">{error}</p>

        <Link
          to="/orders"
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Order #{order.id}</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <Link
            to="/orders"
            className="w-fit rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Order status</p>

              <span className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800">
                {order.status}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="mt-1 font-medium capitalize text-gray-900">
                {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Items
              </h2>

              <div className="space-y-5">
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
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Delivery Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
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
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {order.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-medium text-gray-900">
                  $
                  {(
                    Number(order.total) - Number(order.shippingFee)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>

                <span className="font-medium text-gray-900">
                  ${Number(order.shippingFee).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;