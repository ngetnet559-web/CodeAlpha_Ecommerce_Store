import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      event.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please select a product image");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("image", image);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create product");
      }

      toast.success("Product created successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mb-4 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Products
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Add Product
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new product to your store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Type
              </label>

              <input
                id="type"
                name="type"
                type="text"
                value={formData.type}
                onChange={handleChange}
                required
                placeholder="e.g. Electronics"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the product..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Image
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-3 file:text-sm file:font-medium"
              />

              <p className="mt-2 text-xs text-gray-500">
                Maximum image size: 5MB.
              </p>

              {image && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {image.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;