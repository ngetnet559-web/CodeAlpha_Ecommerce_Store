import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in to view your orders");
        }

        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        setOrders(data);
      } catch (error) {
        console.error("Orders error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";

      case "PROCESSING":
        return "bg-blue-100 text-blue-800";

      case "SHIPPED":
        return "bg-purple-100 text-purple-800";

      case "DELIVERED":
        return "bg-green-100 text-green-800";

      case "CANCELLED":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="mt-8 space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="h-4 w-24 rounded bg-gray-200" />
                      <div className="mt-3 h-4 w-36 rounded bg-gray-200" />
                    </div>

                    <div className="h-7 w-24 rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  {[1, 2].map((product) => (
                    <div
                      key={product}
                      className="flex gap-4"
                    >
                      <div className="h-20 w-20 rounded-lg bg-gray-200" />

                      <div className="flex-1">
                        <div className="h-4 w-48 rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-24 rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Unable to load orders
          </h1>

          <p className="mt-3 text-gray-500">{error}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-6xl">📦</div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            No orders yet
          </h1>

          <p className="mt-3 text-gray-500">
            Your orders will appear here after you make a purchase.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Track and review your previous purchases.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const itemCount = order.orderItems.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-gray-900">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="space-y-5">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-20 w-20 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-medium text-gray-900">
                            {item.product.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.product.type}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-gray-900">
                            $
                            {(
                              Number(item.price) * item.quantity
                            ).toFixed(2)}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Delivery to
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {order.city}
                      </p>

                      <p className="mt-1 max-w-lg text-sm text-gray-500">
                        {order.address}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="w-full rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;