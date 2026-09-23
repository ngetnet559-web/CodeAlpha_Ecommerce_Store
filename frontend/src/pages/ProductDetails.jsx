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
          throw new Error(data.message || "Product not found");
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error || "This product does not exist."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Product */}
        <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          {/* Image */}
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full max-h-[600px] w-full object-cover"
            />
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {product.type}
            </p>

            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-6">
              {isOutOfStock ? (
                <p className="font-medium text-red-600">
                  Out of stock
                </p>
              ) : (
                <p className="font-medium text-green-600">
                  {product.stock} items available
                </p>
              )}
            </div>

            {!isOutOfStock && (
              <>
                {/* Quantity */}
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="flex h-11 w-12 items-center justify-center border-x border-gray-300 font-medium">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-11 w-11 items-center justify-center text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-lg border border-black px-6 py-3 font-semibold text-black transition hover:bg-gray-100"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {isOutOfStock && (
              <button
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-500"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;