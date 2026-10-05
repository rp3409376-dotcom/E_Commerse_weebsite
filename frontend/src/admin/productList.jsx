import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { getProductImage } from "../utils/productImages";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const productList = Array.isArray(response.data)
        ? response.data
        : response.data.products;
      setProducts(productList || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Products could not be loaded",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId, productTitle) => {
    if (!window.confirm(`Delete ${productTitle}?`)) {
      return;
    }

    try {
      setDeletingId(productId);
      const response = await api.delete(`/products/${productId}`);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId),
      );
      setMessage(response.data.message || "Product deleted successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Product delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <h1 className="text-2xl font-bold">Product List</h1>
          <div className="flex flex-col items-end gap-2">
            <Link
              to="/admin/products/add"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Add New Product
            </Link>
            <button
              type="button"
              onClick={fetchProducts}
              className="rounded border border-gray-300 bg-white px-4 py-2 font-semibold hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <p className="mb-4 rounded bg-blue-100 p-3 text-blue-700">
            {message}
          </p>
        )}

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="rounded bg-white p-6">No products found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-4 py-3">
                      <img
                        src={
                          product.image ||
                          getProductImage(product.title, product.category)
                        }
                        alt={product.title}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getProductImage(
                            product.title,
                            product.category,
                          );
                        }}
                        className="h-14 w-18 rounded object-contain bg-gray-100 p-1"
                      />
                    </td>
                    <td className="px-4 py-3">{product.title}</td>
                    <td
                      className="max-w-xs px-4 py-3"
                      title={product.description}
                    >
                      <span className="line-clamp-2">
                        {product.description || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="mr-4 text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${product.title}`}
                        onClick={() => handleDelete(product._id, product.title)}
                        disabled={deletingId === product._id}
                        title={`Delete ${product.title}`}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
