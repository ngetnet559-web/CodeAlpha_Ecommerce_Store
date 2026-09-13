import { Link } from "react-router-dom";
function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {product.type}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-3 text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p
            className={`text-sm ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>
        </div>

        <Link
  to={`/products/${product.product_id}`}
  className="mt-5 block w-full rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
>
  View Details
</Link>
      </div>
    </article>
  );
}

export default ProductCard;