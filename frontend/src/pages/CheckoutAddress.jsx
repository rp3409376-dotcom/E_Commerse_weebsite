import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setIsSaving(true);
      await api.post("/address/add", {
        ...form,
        userId,
      });
      navigate("/checkout");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to save address",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    ["fullName", "Full name", "text"],
    ["phone", "Phone number", "tel"],
    ["addressLine", "Address", "text"],
    ["city", "City", "text"],
    ["state", "State", "text"],
    ["pincode", "PIN code", "text"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <form
        onSubmit={saveAddress}
        className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-2xl font-bold text-slate-900">
          Delivery Address
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Add the address where you want your order delivered.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([name, label, type]) => (
            <label
              key={name}
              className={name === "addressLine" ? "sm:col-span-2" : ""}
            >
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                {label}
              </span>
              <input
                required
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          ))}
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving address..." : "Save Address"}
        </button>
      </form>
    </main>
  );
}
