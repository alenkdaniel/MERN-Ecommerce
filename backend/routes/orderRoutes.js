import express from "express";
const router = express.Router();

import {
  saveAddress,
  getAddress,
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, adminOnly  } from "../middleware/authMiddleware.js";

router.post("/address", protect, saveAddress);
router.get("/address", protect, getAddress);

router.post("/order", protect, placeOrder);
router.get("/orders", protect, getUserOrders);

router.get("/admin/orders", protect, adminOnly, getAllOrders);
router.put("/admin/orders/:id", protect, adminOnly, updateOrderStatus);

export default router;
