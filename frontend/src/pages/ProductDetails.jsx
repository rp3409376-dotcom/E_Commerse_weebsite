import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api/axios";
import { getProductImage } from "../utils/productImages";
import { getStoredUserId } from "../utils/auth";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setSelectedImage(
        response.data.image ||
          getProductImage(response.data.title, response.data.category),
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Product could not be loaded",
      );
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (!product) {
    return <div className="p-8 text-center">{message || "Loading..."}</div>;
  }

  const fallbackImage = getProductImage(product.title, product.category);

  const handleImageError = (event) => {
    if (selectedImage === fallbackImage) {
      return;
    }

    setSelectedImage(fallbackImage);
    event.currentTarget.src = fallbackImage;
  };

  const handleAddToCart = async () => {
    const userId = getStoredUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await api.post("/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      window.dispatchEvent(new Event("cart-updated"));
      setMessage(`${product.title} added to cart`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add product");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex h-56 items-center justify-center rounded-md bg-gray-100 sm:h-64">
          <img
            src={selectedImage || fallbackImage}
            alt={product.title}
            onError={handleImageError}
            className="h-full w-full object-contain p-4"
          />
        </div>
        <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold">
          ${Number(product.price).toFixed(2)}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
        {message && (
          <p className="mt-3 text-green-700">
            {message}.{" "}
            <Link to="/cart" className="font-semibold underline">
              View cart
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
