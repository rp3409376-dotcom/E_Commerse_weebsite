import Address from "../models/Address.js";
import mongoose from "mongoose";

// save address
export const saveAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.json({ message: "Address saved successfully", address });
  } catch (error) {
    res.status(500).json({ message: "Error saving address", error });
  }
};

// get Addresses by userId
export const getAddress = async (req, res) => {
  try {
    const address = await Address.find({
      userId: req.params.userId,
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || req.body?.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (
      !mongoose.isValidObjectId(req.params.id) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({ message: "Invalid address or user ID" });
    }

    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
};
