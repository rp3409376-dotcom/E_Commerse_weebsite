import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

// Route to create a new product
router.post("/", createProduct);

// Route to get all products
router.get("/", getAllProducts);

router.get("/:id", getProductById);

// Route to update a product
router.put("/:id", updateProduct);

// Route to delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
