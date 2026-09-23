import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const Products = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load products"
          );
        }

        setProducts(data);
      } catch (error) {
        console.error("Products error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.type))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(
        (product) => product.type === category
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, search, category, sort]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
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
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load products
          </h1>

          <p className="mt-3 text-gray-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-gray-500">
            Browse our collection and find something you love.
          </p>
        </div>

        <div className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) =>
                  updateFilter("search", e.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  updateFilter("type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>

              <select
                id="sort"
                value={sort}
                onChange={(e) =>
                  updateFilter("sort", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="">Default</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            {(search || category || sort) && (
              <button
                onClick={clearFilters}
                className="text-left text-sm font-medium text-gray-900 hover:underline sm:text-right"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link to={`/products/${product.product_id}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {product.type}
                  </p>

                  <Link
                    to={`/products/${product.product_id}`}
                    className="mt-2 block"
                  >
                    <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 hover:underline">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </p>

                    <p
                      className={`text-xs font-medium ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;