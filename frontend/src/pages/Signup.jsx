import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setIsError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (formData.password.length < 8) {
      setIsError(true);
      setMessage("Use a password with at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Those passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setMessage(response.data.message || "Your account is ready.");
      setAccountCreated(true);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to reach the store. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#edf1ec] px-4 py-8 sm:px-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-[0_24px_70px_rgba(23,43,36,0.12)] md:min-h-[630px] md:grid-cols-2">
        <div className="relative hidden min-h-[630px] overflow-hidden bg-[#183d35] md:block">
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
              A fresh start
            </p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight">
              Make room for something good.
            </h1>
          </div>
        </div>

        <div className="flex items-center px-6 py-9 sm:px-10 md:px-12">
          <div className="mx-auto w-full max-w-sm">
            <Link
              to="/"
              className="mb-8 inline-flex text-sm font-bold tracking-[0.14em] text-[#23483d] md:hidden"
            >
              ROHIT / STORE
            </Link>

            {accountCreated ? (
              <div aria-live="polite">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f0e2] text-[#315f49]">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#748478]">
                  All set
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#1d3028]">
                  Account created
                </h2>
                <p
                  className="mt-3 text-sm leading-6 text-[#718078]"
                  role="status"
                >
                  {message} Sign in with {formData.email.trim().toLowerCase()}{" "}
                  to continue.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/login", {
                      state: { email: formData.email.trim().toLowerCase() },
                    })
                  }
                  className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#244c3d] px-4 py-3 font-semibold text-white transition hover:bg-[#193b30] focus:outline-none focus:ring-4 focus:ring-[#527c62]/20"
                >
                  Continue to sign in
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
                </button>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#748478]">
                    Join the store
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-[#1d3028]">
                    Create account
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#718078]">
                    Set up your details and you are ready to go.
                  </p>
                </div>

                {message && (
                  <p
                    className={`${isError ? "border-[#f2c7bd] bg-[#fff5f2] text-[#9b3e2f]" : "border-[#c9dec6] bg-[#f2f8ef] text-[#315f49]"} mb-5 rounded border px-4 py-3 text-sm`}
                    role="alert"
                  >
                    {message}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-2 block text-sm font-semibold text-[#34453c]"
                    >
                      Full name
                    </label>
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 text-[#1d3028] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-2 block text-sm font-semibold text-[#34453c]"
                    >
                      Email address
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 text-[#1d3028] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className="mb-2 block text-sm font-semibold text-[#34453c]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        minLength={8}
                        required
                        className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 pr-12 text-[#1d3028] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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

                  <div>
                    <label
                      htmlFor="signup-confirm-password"
                      className="mb-2 block text-sm font-semibold text-[#34453c]"
                    >
                      Confirm password
                    </label>
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-[#d7ded8] bg-white px-4 py-3 text-[#1d3028] outline-none transition focus:border-[#527c62] focus:ring-4 focus:ring-[#527c62]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#244c3d] px-4 py-3 font-semibold text-white transition hover:bg-[#193b30] focus:outline-none focus:ring-4 focus:ring-[#527c62]/20 disabled:cursor-wait disabled:opacity-65"
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                    {!isSubmitting && (
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#718078]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#315f49] underline decoration-[#a8c391] underline-offset-4 hover:text-[#193b30]"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
