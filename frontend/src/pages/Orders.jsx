import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Your purchases
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-3 text-gray-500">
            View your previous orders and delivery information.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-3 text-gray-500">
              Your orders will appear here after you make a purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-3">
                  {/* Items */}
                  <div className="lg:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                      Items
                    </h2>

                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.product.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          <p className="font-semibold text-gray-900">
                            $
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                      Delivery
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {order.fullName}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">
                          {order.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {order.address}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">City</p>
                        <p className="font-medium text-gray-900">
                          {order.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Payment</p>
                        <p className="font-medium capitalize text-gray-900">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <div className="ml-auto max-w-xs space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        ${Number(order.shippingFee || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;