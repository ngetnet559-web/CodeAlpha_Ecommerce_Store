import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    stock: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        if (!ignore) {
          setFormData({
            name: data.name,
            type: data.type,
            price: data.price,
            description: data.description,
            stock: data.stock,
          });

          setCurrentImage(data.image);
          setLoading(false);
        }
      } catch (error) {
        console.error("Load product error:", error);

        if (!ignore) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

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
      setNewImage(null);
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

    setNewImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("stock", formData.stock);

      if (newImage) {
        data.append("image", newImage);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      toast.success("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 h-[600px] animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Failed to load product
          </h1>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Products
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-2 text-gray-600">
            Update your product information.
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
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
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Current Image
              </label>

              {currentImage && (
                <img
                  src={currentImage}
                  alt={formData.name}
                  className="h-48 w-48 rounded-xl object-cover"
                />
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Replace Image
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-3 file:text-sm file:font-medium"
              />

              <p className="mt-2 text-xs text-gray-500">
                Leave empty to keep the current image. Maximum size: 5MB.
              </p>

              {newImage && (
                <p className="mt-2 text-sm text-gray-600">
                  New image: {newImage.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProduct;