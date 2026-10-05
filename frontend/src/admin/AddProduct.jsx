import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { getProductImage, isProductImage } from "../utils/productImages";

const initialForm = {
  title: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

export default function AddProduct() {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "category" || name === "title") {
      const nextTitle = name === "title" ? value : formData.title;
      const nextCategory = name === "category" ? value : formData.category;
      const productImage = getProductImage(nextTitle, nextCategory);
      const currentImageIsDefault = isProductImage(formData.image);

      setFormData({
        ...formData,
        [name]: value,
        ...(productImage && (!formData.image || currentImageIsDefault)
          ? { image: productImage }
          : {}),
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock || 0),
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-lg bg-white p-8 shadow-md"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Link to="/admin/products" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>

        {message && (
          <p className="rounded bg-green-100 p-3 text-green-700">{message}</p>
        )}

        {Object.keys(initialForm).map((field) => (
          <input
            key={field}
            name={field}
            type={
              field === "price" || field === "stock"
                ? "number"
                : field === "image"
                  ? "url"
                  : "text"
            }
            min={field === "price" || field === "stock" ? "0" : undefined}
            step={field === "price" ? "0.01" : undefined}
            placeholder={
              field === "image"
                ? "https://images.unsplash.com/photo-..."
                : field[0].toUpperCase() + field.slice(1)
            }
            value={formData[field]}
            onChange={handleChange}
            required={
              field === "title" || field === "price" || field === "image"
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        ))}

        {formData.image && (
          <img
            src={formData.image}
            alt="Product preview"
            className="h-32 w-full rounded object-contain bg-gray-100"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </main>
  );
}
