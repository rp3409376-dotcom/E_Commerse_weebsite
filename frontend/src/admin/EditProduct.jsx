import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api/axios";
import { getProductImage } from "../utils/productImages";

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Product could not be loaded",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.put(`/products/${id}`, {
        title: product.title,
        description: product.description,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        stock: Number(product.stock || 0),
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Product update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="p-8 text-center">Loading product...</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-lg bg-white p-8 shadow-md"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Link to="/admin/products" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>

        {message && (
          <p className="rounded bg-blue-100 p-3 text-blue-700">{message}</p>
        )}

        {Object.keys(emptyProduct).map((field) => (
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
            value={product[field] ?? ""}
            onChange={handleChange}
            required={
              field === "title" || field === "price" || field === "image"
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        ))}

        {product.image && (
          <img
            src={getProductImage(product.title, product.category)}
            alt="Product preview"
            className="h-32 w-full rounded object-contain bg-gray-100"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </main>
  );
}
