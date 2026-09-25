import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const allowedTransitions = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/orders/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Server returned an unexpected response (${response.status})`,
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        if (!ignore) {
          setOrders(data);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Admin orders error:", error);

        if (!ignore) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, [retry]);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setUpdatingId(orderId);

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Server returned an unexpected response (${response.status})`,
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.status,
              }
            : order,
        ),
      );

      toast.success("Order status updated");
    } catch (error) {
      console.error("Update order status error:", error);

      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Failed to load orders
          </h1>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRetry((value) => value + 1);
            }}
            className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage customer orders.
            </p>
          </div>

          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-600">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const nextStatuses = allowedTransitions[order.status] || [];

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[order.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor={`status-${order.id}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>

                      {nextStatuses.length > 0 ? (
                        <select
                          id={`status-${order.id}`}
                          value=""
                          disabled={updatingId === order.id}
                          onChange={(event) => {
                            if (event.target.value) {
                              updateStatus(order.id, event.target.value);
                            }
                          }}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Update status</option>

                          {nextStatuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500">
                          No changes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer / Delivery / Total */}
                  <div className="grid gap-6 py-6 lg:grid-cols-3">
                    {/* Customer */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Customer
                      </h3>

                      <p className="mt-2 text-sm text-gray-600">
                        {order.fullName}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.user?.email}
                      </p>

                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>

                    {/* Delivery */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Delivery
                      </h3>

                      <p className="mt-2 text-sm text-gray-600">
                        {order.address}
                      </p>

                      <p className="text-sm text-gray-600">{order.city}</p>

                      <p className="mt-1 text-sm text-gray-600">
                        Payment:{" "}
                        <span className="font-medium text-gray-800">
                          {order.paymentMethod}
                        </span>
                      </p>
                    </div>

                    {/* Total */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Order Total
                      </h3>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.orderItems.length}{" "}
                        {order.orderItems.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                      Products
                    </h3>

                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 rounded-xl bg-gray-50 p-3"
                        >
                          <img
                            src={item.product?.image}
                            alt={item.product?.name || "Product"}
                            className="h-16 w-16 rounded-lg object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                              {item.product?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-medium text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Link */}
                  <div className="mt-5 flex justify-end">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-gray-700 transition hover:text-black"
                    >
                      View Customer Order →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
