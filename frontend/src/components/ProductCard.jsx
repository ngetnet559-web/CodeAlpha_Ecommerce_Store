function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm text-gray-500">{product.type}</p>

          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            {product.name}
          </h2>
        </div>

        <p className="text-lg font-bold text-gray-900">
          ${product.price}
        </p>

        <p className="text-sm text-gray-500">
          {product.stock > 0
            ? `${product.stock} available`
            : "Out of stock"}
        </p>

        <button
          type="button"
          disabled={product.stock === 0}
          className="w-full rounded-lg cursor-pointer bg-[#27ff1f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#26e420] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCard;