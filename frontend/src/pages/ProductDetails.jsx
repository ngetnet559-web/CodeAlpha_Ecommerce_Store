import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/products/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load product"
          );
        }

        setProduct(data);
        setQuantity(1);
      } catch (error) {
        console.error("Product details error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((currentQuantity) =>
      Math.min(currentQuantity + 1, product.stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(currentQuantity - 1, 1)
    );
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-gray-200" />

            <div className="flex flex-col justify-center">
              <div className="h-4 w-24 rounded bg-gray-200" />

              <div className="mt-4 h-10 w-3/4 rounded bg-gray-200" />

              <div className="mt-4 h-8 w-32 rounded bg-gray-200" />

              <div className="mt-8 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>

              <div className="mt-8 h-12 w-40 rounded bg-gray-200" />

              <div className="mt-5 h-12 w-full rounded bg-gray-200" />

              <div className="mt-3 h-12 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load product
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "Product not found"}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

            <Link
              to="/products"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-black"
        >
          ← Back to Products
        </Link>

        <div className="grid gap-10 rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:p-10">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
              {product.type}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="mt-6">
              {isOutOfStock ? (
                <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                  Out of stock
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  {product.stock} items available
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <>
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-11 w-11 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      −
                    </button>

                    <span className="flex h-11 w-14 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="h-11 w-11 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-900 transition hover:bg-gray-100"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;