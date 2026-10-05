import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCartByUserId,
} from "../controllers/CartControllers.js";

const router = express.Router();

router.post("/items", addItemToCart);
router.post("/add", addItemToCart);
router.delete("/items", removeItemFromCart);
router.patch("/items", updateCartItemQuantity);
router.post("/update", updateCartItemQuantity);
router.get("/:userId", getCartByUserId);

export default router;
