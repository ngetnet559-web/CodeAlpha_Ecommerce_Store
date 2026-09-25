import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        if (!ignore) {
          setProducts(data);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Admin products error:", error);

        if (!ignore) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [retry]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setDeletingId(productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.product_id !== productId
        )
      );

      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(error.message);
    } finally {
      setDeletingId(null);
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

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
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
            Failed to load products
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your store products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/products/new")}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            + Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No products yet
            </h2>

            <p className="mt-2 text-gray-600">
              Add your first product to get started.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/products/new")}
              className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const stockClass =
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 5
                          ? "text-yellow-600"
                          : "text-green-600";

                    return (
                      <tr
                        key={product.product_id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg object-cover"
                            />

                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                ID: {product.product_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.type}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </td>

                        <td
                          className={`px-6 py-4 text-sm font-semibold ${stockClass}`}
                        >
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/products/${product.product_id}/edit`
                                )
                              }
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(product.product_id)
                              }
                              disabled={deletingId === product.product_id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === product.product_id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProducts;