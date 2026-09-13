import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/useCart";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
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
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[600px] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            {product.type}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            <p
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>
          </div>

          <button
  type="button"
  disabled={product.stock === 0}
  onClick={() => {
    console.log("Adding product:", product);
    addToCart(product);
  }}
  className="mt-6 w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
>
  Add to Cart
</button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;