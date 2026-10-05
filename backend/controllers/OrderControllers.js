import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;
    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "pincode",
    ];

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "A valid userId is required" });
    }

    if (
      !address ||
      requiredAddressFields.some(
        (field) => !String(address[field] || "").trim(),
      )
    ) {
      return res.status(400).json({
        message: "A complete delivery address is required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cannot place an empty order" });
    }

    const orderItems = cart.items.map((item) => ({
      name: item.productId.title,
      qty: item.quantity,
      price: item.productId.price,
      product: item.productId._id,
    }));
    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );

    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress: Object.fromEntries(
        requiredAddressFields.map((field) => [field, address[field].trim()]),
      ),
      paymentMethod: req.body.paymentMethod || "Cash on Delivery",
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
