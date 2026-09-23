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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Unable to load orders
        </h1>

        <p className="mt-2 text-gray-500">{error}</p>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Orders
          </h1>

          <p className="mt-4 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
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
          <h1 className="text-3xl font-bold text-gray-900">
            Your Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage your previous orders.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              {/* Order Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
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
                        $
                        {(
                          Number(item.price) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                  Delivery Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

                  <div className="sm:col-span-2 lg:col-span-4">
                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-100 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order total
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Includes ${Number(order.shippingFee).toFixed(2)}{" "}
                      shipping
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="w-full rounded-lg bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;