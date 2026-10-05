import Cart from "../models/Cart.js";
import mongoose from "mongoose";

// Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(productId)
    ) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    let cart = await Cart.findOne({ userId });
    const itemQuantity = Number(quantity) || 1;
    const existingItem = cart?.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += itemQuantity;
    } else if (cart) {
      cart.items.push({ productId, quantity: itemQuantity });
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: itemQuantity }],
      });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Add to cart failed:", error);
    res.status(500).json({ message: "Unable to add item to cart" });
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart failed:", error);
    res.status(500).json({ message: "Unable to remove item from cart" });
  }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const nextQuantity = Number(quantity);

    if (!userId || !productId || !Number.isInteger(nextQuantity)) {
      return res.status(400).json({
        message: "userId, productId, and an integer quantity are required",
      });
    }

    const update =
      nextQuantity <= 0
        ? { $pull: { items: { productId } } }
        : { $set: { "items.$[item].quantity": nextQuantity } };

    const options =
      nextQuantity <= 0
        ? { new: true }
        : { new: true, arrayFilters: [{ "item.productId": productId }] };

    const cart = await Cart.findOneAndUpdate({ userId }, update, options);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart quantity updated", cart });
  } catch (error) {
    console.error("Cart quantity update failed:", error);
    res.status(500).json({ message: "Unable to update cart quantity" });
  }
};

// Get cart by user ID
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price image",
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart failed:", error);
    res.status(500).json({ message: "Unable to get cart" });
  }
};
