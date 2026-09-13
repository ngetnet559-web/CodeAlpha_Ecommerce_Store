import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Our collection
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;