import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCartByUserId,
} from "../controllers/CartControllers.js";

const router = express.Router();

// Add item to cart
router.post("/items", addItemToCart);
router.post("/add", addItemToCart);

// Remove item from cart
router.delete("/items", removeItemFromCart);

// Update item quantity in cart
router.patch("/items", updateCartItemQuantity);
router.post("/update", updateCartItemQuantity);

// Get cart by user ID
router.get("/:userId", getCartByUserId);

export default router;
