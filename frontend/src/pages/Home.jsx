import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { getProductImage } from "../utils/productImages";
import { getStoredUserId } from "../utils/auth";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const response = await api.get("/products", {
        params: { search, category },
      });
      setProducts(
        Array.isArray(response.data.products) ? response.data.products : [],
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setMessage(
        error.response?.data?.message || "Products could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = getStoredUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(productId);
      await api.post("/cart/add", { userId, productId, quantity: 1 });
      window.dispatchEvent(new Event("cart-updated"));
      setMessage("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setMessage(error.response?.data?.message || "Unable to add product");
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
        <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-52"
          >
            <option value="">All Categories</option>
            <option value="Laptop">Laptop</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Tables">Tables</option>
          </select>
        </div>
        {message && <p className="text-blue-600">{message}</p>}
        {isLoading && (
          <p className="rounded bg-white px-6 py-4 text-slate-600">
            Loading products...
          </p>
        )}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const fallbackImage = getProductImage(
              product.title,
              product.category,
            );

            return (
              <article
                key={product._id}
                className="product-card group flex h-full flex-col overflow-hidden rounded-xl p-3"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="product-card-content"
                >
                  <div className="product-card-image aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <img
                      src={product.image || fallbackImage}
                      alt={product.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImage;
                      }}
                      className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="mt-3 min-h-12 text-base font-bold text-slate-900">
                    {product.title}
                  </h2>
                  <p className="mt-1 text-lg font-bold text-blue-700">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <p className="product-card-description mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">
                    {product.description}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => addToCart(product._id)}
                  disabled={addingProductId === product._id}
                  className="product-card-action mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingProductId === product._id ? (
                    "Adding..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 3h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 001.9-1.4L21 7H6" />
                        <circle cx="10" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                      </svg>
                      Add to Cart
                    </span>
                  )}
                </button>
              </article>
            );
          })}
        </div>
        {!isLoading && !message && products.length === 0 && (
          <p className="rounded bg-white p-6">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
