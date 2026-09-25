import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

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

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      const token = localStorage.getItem("token");

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data =
        response.status === 204
          ? null
          : await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete product"
        );
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
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-72 rounded bg-gray-200" />

          <div className="mt-8 overflow-hidden rounded-2xl bg-white">
            <div className="h-14 bg-gray-200" />

            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex gap-4"
                >
                  <div className="h-16 w-16 rounded-lg bg-gray-200" />

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
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load products
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your store products and inventory.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Add Product
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-5xl">📦</div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-gray-500">
                Add your first product to start selling.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 px-6 py-4">
                <p className="text-sm text-gray-500">
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {products.map((product) => (
                  <div
                    key={product.product_id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.type}
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="sm:w-28">
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Stock
                        </p>

                        <p
                          className={`mt-1 font-semibold ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </p>
                      </div>

                      <div className="flex gap-3 sm:w-auto">
                        <button
                          type="button"
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:flex-none"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId === product.product_id
                          }
                          onClick={() =>
                            handleDelete(
                              product.product_id,
                              product.name
                            )
                          }
                          className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          {deletingId === product.product_id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;