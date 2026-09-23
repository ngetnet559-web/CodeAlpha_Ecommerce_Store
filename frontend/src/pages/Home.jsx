import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        setProducts(data.slice(0, 4));

        const uniqueCategories = [
          ...new Set(data.map((product) => product.type)),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-100">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Welcome to our store
            </p>

            <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Discover Products You'll Love
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Shop quality products at great prices. Explore our collection
              and find something that's right for you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Our collection
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">
              No products available yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.product_id}
                  to={`/products/${product.product_id}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-500">
                      {product.type}
                    </p>

                    <h3 className="mt-1 font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-2 font-bold text-gray-900">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Explore our products by category and find exactly what
              you're looking for.
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-gray-500">
              No categories available yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?type=${encodeURIComponent(category)}`}
                  className="rounded-xl border border-gray-200 bg-white p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold capitalize text-gray-900">
                    {category}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Explore collection →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Why shop with us
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Shopping Made Simple
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Quality Products
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Browse carefully selected products designed to give you
                great value.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                🔒
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Secure Shopping
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Your account and orders are protected with secure
                authentication.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Easy Ordering
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Find your products, add them to your cart, and place your
                order with just a few steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to Start Shopping?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Explore our collection and discover products that fit your
            needs.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;