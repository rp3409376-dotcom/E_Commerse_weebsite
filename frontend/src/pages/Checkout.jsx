import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const loadCheckout = async () => {
      try {
        const [cartResponse, addressResponse] = await Promise.all([
          api.get(`/cart/${userId}`).catch((error) => {
            if (error.response?.status === 404) {
              return { data: { cart: { items: [] } } };
            }
            throw error;
          }),
          api.get(`/address/${userId}`),
        ]);
        setCart(cartResponse.data.cart ?? { items: [] });
        const savedAddresses = Array.isArray(addressResponse.data)
          ? addressResponse.data
          : [];
        setAddress(savedAddresses);
        setSelectedAddressId(savedAddresses[0]?._id ?? "");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load checkout details",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCheckout();
  }, [navigate, userId]);

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.productId?.price || 0) * item.quantity,
    0,
  );

  const placeOrder = async () => {
    const selectedAddress = address.find(
      (item) => item._id === selectedAddressId,
    );

    if (!selectedAddress || items.length === 0) return;

    try {
      setIsPlacingOrder(true);
      setErrorMessage("");
      const response = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });
      const orderId = response.data.order?._id;

      if (!orderId) {
        throw new Error("The order was submitted without a confirmation ID.");
      }

      window.dispatchEvent(new Event("cart-updated"));
      navigate(`/order/success/${orderId}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to place order. Please try again.",
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      setDeletingAddressId(addressId);
      setErrorMessage("");
      await api.delete(`/address/${addressId}`, { params: { userId } });
      const remainingAddresses = address.filter(
        (item) => item._id !== addressId,
      );
      setAddress(remainingAddresses);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(remainingAddresses[0]?._id ?? "");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to remove address",
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  if (isLoading) {
    return (
      <p className="p-8 text-center text-slate-600">Loading checkout...</p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <Link
              to="/checkout/address"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Address
            </Link>
          </div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Select Address
          </h2>

          {errorMessage && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {address.length > 0 ? (
            <div className="space-y-3">
              {address.map((item) => (
                <article
                  key={item._id}
                  className={`flex items-start justify-between gap-4 rounded-lg border p-4 text-sm text-slate-700 transition ${selectedAddressId === item._id ? "border-blue-500 bg-blue-50/50" : "border-slate-200"}`}
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={item._id}
                      checked={selectedAddressId === item._id}
                      onChange={() => setSelectedAddressId(item._id)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />
                    <span>
                      <span className="block font-bold text-slate-900">
                        {item.fullName}
                      </span>
                      <span className="block">{item.phone}</span>
                      <span className="block">
                        {item.addressLine}, {item.city}, {item.state} -{" "}
                        {item.pincode}
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteAddress(item._id)}
                    disabled={deletingAddressId === item._id}
                    aria-label={`Remove address for ${item.fullName}`}
                    title="Remove address"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-wait disabled:opacity-50"
                  >
                    {deletingAddressId === item._id ? "..." : "×"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              No delivery address saved yet.
            </p>
          )}
        </section>

        <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Order Summary
          </h2>
          {items.length === 0 ? (
            <div>
              <p className="text-sm text-slate-600">Your cart is empty.</p>
              <Link
                to="/"
                className="mt-3 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId?._id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-slate-600">
                      {item.productId?.title} x {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-900">
                      $
                      {(
                        Number(item.productId?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-4 font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={placeOrder}
                disabled={isPlacingOrder || !selectedAddressId}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlacingOrder ? "Placing order..." : "Place Order"}
                {!isPlacingOrder && (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
              {!selectedAddressId && (
                <p className="text-xs text-slate-500">
                  Add and select a delivery address to continue.
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
