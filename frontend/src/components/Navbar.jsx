import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getStoredUserId } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = getStoredUserId();

  useEffect(() => {
    if (!userId) {
      setCartCount(0);
      return;
    }

    const loadCartCount = async () => {
      try {
        const response = await api.get(`/cart/${userId}`);
        setCartCount(
          response.data.cart?.items?.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0,
          ) ?? 0,
        );
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartCount(0);
      }
    };

    loadCartCount();
    window.addEventListener("cart-updated", loadCartCount);
    return () => window.removeEventListener("cart-updated", loadCartCount);
  }, [userId]);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="shrink-0 text-base font-bold text-slate-900 sm:text-xl"
        >
          Rohit Product Store
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3">
          {userId ? (
            <>
              <Link
                to="/cart"
                aria-label="Open shopping cart"
                title="Cart"
                className="relative flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:text-base"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 001.9-1.4L21 7H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="h-10 rounded-lg bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 sm:px-4 sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                aria-label="Login to your account"
                title="Login"
                className="flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-blue-600 px-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 sm:h-10 sm:gap-1.5 sm:px-4 sm:text-base"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span className="max-[380px]:hidden">Login</span>
              </Link>
              <Link
                to="/signin"
                aria-label="Create a new account"
                title="Sign Up"
                className="flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:h-10 sm:gap-1.5 sm:px-4 sm:text-base"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M16 11h6" />
                </svg>
                <span className="max-[380px]:hidden">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
