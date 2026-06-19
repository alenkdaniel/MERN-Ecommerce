import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deactivateUser,
  activateUser,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";


router.get("/", protect, adminOnly, getAllUsers);

router.get("/:id", protect, adminOnly, getUserById);

router.patch("/:id/block", protect, adminOnly, toggleBlockUser);

router.patch("/:id/deactivate", protect, adminOnly, deactivateUser);

router.patch("/:id/activate", protect, adminOnly, activateUser);

export default router;