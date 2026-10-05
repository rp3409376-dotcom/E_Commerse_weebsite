import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useRouteError,
} from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/Checkout";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ProductList from "./admin/productList";
import Navbar from "./components/Navbar";
import OrderSuccess from "./pages/OrderSuccess";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function RouteError() {
  const error = useRouteError();
  const message = error?.statusText || error?.message || "Page not found";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-gray-600">{message}</p>
      <a href="/" className="rounded bg-blue-600 px-4 py-2 text-white">
        Go home
      </a>
    </main>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signin", element: <Signup /> },
      { path: "products/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "cart/:userId", element: <Cart /> },
      { path: "checkout/address", element: <CheckoutAddress /> },
      { path: "checkout-address", element: <CheckoutAddress /> },
      { path: "checkout", element: <Checkout /> },
      { path: "admin", element: <ProductList /> },
      { path: "admin/products", element: <ProductList /> },
      { path: "admin/products/add", element: <AddProduct /> },
      { path: "admin/products/:id/edit", element: <EditProduct /> },
      { path: "order/success/:orderId", element: <OrderSuccess /> },
      { path: "*", element: <RouteError /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
