import express from "express";
import {
  saveAddress,
  getAddress,
  deleteAddress,
} from "../controllers/AddressController.js";

const router = express.Router();

router.post("/add", saveAddress);
router.get("/:userId", getAddress);
router.delete("/:id", deleteAddress);
router.delete("/:id/:userId", deleteAddress);

export default router;
