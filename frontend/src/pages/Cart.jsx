import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios";
import { getStoredUserId } from "../utils/auth";
import { getProductImage } from "../utils/productImages";

export default function Cart() {
  const { userId: routeUserId } = useParams();
  const userId = routeUserId || getStoredUserId();
  const [cart, setCart] = useState({ items: [] });
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    if (!userId) {
      setCart({ items: [] });
      return;
    }

    try {
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data.cart ?? { items: [] });
      setMessage("");
    } catch (error) {
      if (error.response?.status === 404) {
        setCart({ items: [] });
        setMessage("");
        return;
      }

      console.error("Error loading cart:", error);
      setMessage(error.response?.data?.message || "Cart could not be loaded");
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const removeItem = async (productId) => {
    try {
      await api.delete("/cart/items", { data: { userId, productId } });
      await loadCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
      setMessage(error.response?.data?.message || "Item could not be removed");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.patch("/cart/items", { userId, productId, quantity });
      await loadCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      setMessage(
        error.response?.data?.message || "Quantity could not be updated",
      );
    }
  };

  if (!userId) {
    return (
      <main className="p-6">
        <p>Please log in to view your cart.</p>
        <Link to="/login" className="text-blue-600 underline">
          Go to login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId._id}
              className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[96px_1fr_auto_auto] sm:items-center"
            >
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={
                    item.productId.image ||
                    getProductImage(
                      item.productId.title,
                      item.productId.category,
                    )
                  }
                  alt={item.productId.title}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getProductImage(
                      item.productId.title,
                      item.productId.category,
                    );
                  }}
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div>
                <Link
                  to={`/products/${item.productId._id}`}
                  className="font-semibold text-blue-600"
                >
                  {item.productId.title}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  ${Number(item.productId.price).toFixed(2)} per item
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.productId.title} quantity`}
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="flex h-8 w-10 items-center justify-center text-lg font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    -
                  </button>
                  <span className="flex h-8 min-w-12 items-center justify-center border-x border-slate-300 px-3 font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.productId.title} quantity`}
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity + 1)
                    }
                    className="flex h-8 w-10 items-center justify-center text-lg font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId._id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="text-left sm:min-w-28 sm:text-right">
                <p className="text-xs text-slate-500">Total price</p>
                <p className="font-bold text-slate-900">
                  ${(Number(item.productId.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Proceed to checkout
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
