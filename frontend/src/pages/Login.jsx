import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import api from "../api/axios";

export default function Login() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (!response.data.token || !response.data.userId) {
        throw new Error("Login response was incomplete. Please try again.");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to reach the store. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#edf1ec] px-4 py-8 sm:px-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-[0_24px_70px_rgba(23,43,36,0.12)] md:min-h-[590px] md:grid-cols-2">
        <div className="relative hidden min-h-[590px] overflow-hidden bg-[#183d35] md:block">
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85"
            alt="Laptop on a desk"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102a25]/90 via-[#183d35]/15 to-[#183d35]/10" />
          <Link
            to="/"
            className="absolute left-9 top-9 text-sm font-bold tracking-[0.18em] text-white"
          >
            ROHIT / STORE
          </Link>
          <div className="absolute bottom-10 left-9 right-9 text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6db9b]">
              Your next good find
            </p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight">
              Welcome back to the good stuff.
            </h1>
          </div>
        </div>

        <div className="flex items-center px-6 py-10 sm:px-10 md:px-12">
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
            <Link
              to="/"
              className="mb-10 inline-flex text-sm font-bold tracking-[0.14em] text-[#23483d] md:hidden"
            >
              ROHIT / STORE
            </Link>
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#748478]">
                Member access
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d3028]">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#718078]">
                Sign in to pick up where you left off.
              </p>
            </div>

            {message && (
              <p
                className="mb-5 rounded border border-[#f2c7bd] bg-[#fff5f2] px-4 py-3 text-sm text-[#9b3e2f]"
                role="alert"
              >
                {message}
              </p>
            )}

            <div className="mb-5">
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold text-[#34453c]"
              >
                Email address
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 text-[#1d3028] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
              />
            </div>

            <div className="mb-7">
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-semibold text-[#34453c]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 pr-12 text-[#1d3028] outline-none transition focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#738078] hover:text-[#23483d]"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.5 4 9.5 6a17.7 17.7 0 01-3.2 4.1M6.2 6.2C4.1 7.5 2.8 9.2 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                      </>
                    ) : (
                      <>
                        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#244c3d] px-4 py-3 font-semibold text-white transition hover:bg-[#193b30] focus:outline-none focus:ring-4 focus:ring-[#527c62]/20 disabled:cursor-wait disabled:opacity-65"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && (
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

            <p className="mt-7 text-center text-sm text-[#718078]">
              New here?{" "}
              <Link
                to="/signin"
                className="font-bold text-[#315f49] underline decoration-[#a8c391] underline-offset-4 hover:text-[#193b30]"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
