import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchOrder = async () => {
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

        const contentType =
          response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Server returned an unexpected response (${response.status})`
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        const foundOrder = data.find(
          (item) => item.id === Number(id)
        );

        if (!foundOrder) {
          throw new Error("Order not found");
        }

        if (!ignore) {
          setOrder(foundOrder);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Admin order details error:",
          error
        );

        if (!ignore) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      ignore = true;
    };
  }, [id]);

  const updateStatus = async (status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Server returned an unexpected response (${response.status})`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrder((current) => ({
        ...current,
        status: data.status,
      }));

      toast.success("Order status updated");
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load order
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <Link
            to="/admin/orders"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const nextStatuses = allowedTransitions[order.status] || [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/orders"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.id}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[order.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[order.status] ||
                    order.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="order-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Update Status
              </label>

              {nextStatuses.length > 0 ? (
                <select
                  id="order-status"
                  value=""
                  disabled={updating}
                  onChange={(event) => {
                    if (event.target.value) {
                      updateStatus(event.target.value);
                    }
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
                >
                  <option value="">
                    Select next status
                  </option>

                  {nextStatuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
                  No further changes
                </p>
              )}
            </div>
          </div>

          {/* Customer + Delivery */}
          <div className="grid gap-8 border-b border-gray-100 py-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Customer Information
              </h2>

              <div className="mt-3 space-y-1">
                <p className="text-gray-700">
                  {order.fullName}
                </p>

                <p className="text-sm text-gray-500">
                  {order.user?.email}
                </p>

                <p className="text-sm text-gray-500">
                  {order.phone}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-3 space-y-1">
                <p className="text-gray-700">
                  {order.address}
                </p>

                <p className="text-sm text-gray-500">
                  {order.city}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Payment:{" "}
                  <span className="font-medium text-gray-700">
                    {order.paymentMethod}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-100 py-6">
            <h2 className="text-sm font-semibold text-gray-900">
              Order Items
            </h2>

            <div className="mt-4 space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                >
                  <img
                    src={item.product?.image}
                    alt={
                      item.product?.name ||
                      "Product"
                    }
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">
                      {item.product?.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm text-gray-500">
                      Price: $
                      {Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    $
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end pt-6">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>

                <span>
                  $
                  {Number(
                    order.shippingFee
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  $
                  {Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;