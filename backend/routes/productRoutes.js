import express from "express";
const router = express.Router();

import {
  createProducts,
  getProducts,
  getProductsById,
  updateProducts,
  updateProductsStatus,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";


router.get("/products", getProducts);

router.get("/products/:id", getProductsById);


router.post("/products", protect, adminOnly, createProducts);

router.put("/products/:id", protect, adminOnly, updateProducts);

router.patch("/products/:id", protect, adminOnly, updateProductsStatus);

router.delete("/products/:id", protect, adminOnly, deleteProduct);

export default router;