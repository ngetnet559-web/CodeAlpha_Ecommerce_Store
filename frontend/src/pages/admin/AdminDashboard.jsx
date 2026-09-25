import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        if (!ignore) {
          setDashboard(data);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard error:", error);

        if (!ignore) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [retry]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    setRetry((value) => value + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>

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
            Failed to load dashboard
          </h1>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Products",
      value: dashboard.statistics.productCount,
      link: "/admin/products",
    },
    {
      label: "Orders",
      value: dashboard.statistics.orderCount,
      link: "/admin/orders",
    },
    {
      label: "Customers",
      value: dashboard.statistics.customerCount,
      link: null,
    },
    {
      label: "Pending Orders",
      value: dashboard.statistics.pendingOrderCount,
      link: "/admin/orders",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

          <p className="mt-2 text-gray-600">Overview of your store.</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const content = (
              <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            );

            return stat.link ? (
              <Link key={stat.label} to={stat.link}>
                {content}
              </Link>
            ) : (
              <div key={stat.label}>{content}</div>
            );
          })}
        </div>

        {/* Revenue */}
        <div className="mt-6 rounded-2xl bg-black p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-white/60">Total Revenue</p>

          <p className="mt-2 text-4xl font-bold">
            ${Number(dashboard.statistics.revenue).toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-white/60">
            Cancelled orders are excluded.
          </p>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              View All Orders →
            </Link>
          </div>

          {dashboard.recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">No orders have been placed yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-gray-900">
                        Order #{order.id}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.user?.name || order.fullName}
                    </p>

                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <p className="font-semibold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </p>

                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-black"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/products/new"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">Add Product</p>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">Manage Orders</p>

            <p className="mt-1 text-sm text-gray-500">
              Review and update customer orders.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
