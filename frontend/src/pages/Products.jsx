import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const selectedCategory = searchParams.get("type") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
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

    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.type.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (product) => product.type === selectedCategory
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, selectedCategory, sort]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ type: category });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Our collection
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="mt-3 text-gray-600">
            Find the products you're looking for.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">All categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort by
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {(search || selectedCategory || sort) && (
            <button
              onClick={() => {
                setSearch("");
                setSort("");
                setSearchParams({});
              }}
              className="text-sm font-medium text-gray-700 hover:text-black hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/products/${product.product_id}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    {product.type}
                  </p>

                  <Link to={`/products/${product.product_id}`}>
                    <h2 className="mt-1 line-clamp-1 font-semibold text-gray-900 hover:underline">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {product.stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;