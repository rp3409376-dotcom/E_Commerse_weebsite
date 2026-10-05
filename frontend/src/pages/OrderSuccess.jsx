import { useParams } from "react-router";

export default function OrderSuccess() {
  const { orderId } = useParams();

  const goHome = () => {
    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold">Order placed Successfully</h1>
      <p className="text-gray-600">Your order has been placed successfully.</p>
      <p className="text-lg font-semibold">Order ID: {orderId}</p>
      <button
        onClick={goHome}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </main>
  );
}
