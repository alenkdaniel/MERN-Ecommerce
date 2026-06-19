import express from "express";
const router = express.Router();

import {
  getCart,
  addToCart,
  updateQty,
  removeItem
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.put("/cart", protect, updateQty);
router.delete("/cart/:productId", protect, removeItem);

export default router;