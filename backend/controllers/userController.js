import mongoose from "mongoose";
import User from "../models/User.js";


export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalUsers = await User.countDocuments(keyword);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "Invalid value" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked === isBlocked) {
      return res.json({
        success: true,
        message: isBlocked ? "User already blocked" : "User already unblocked",
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({
      success: true,
      message: isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.json({
        success: true,
        message: "User already deactivated",
      });
    }

    user.isActive = false;
    user.deactivatedAt = new Date(); 
    await user.save();

    res.json({
      success: true,
      message: "User deactivated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive) {
      return res.json({
        success: true,
        message: "User already active",
      });
    }

    user.isActive = true;
    user.deactivatedAt = null;
    await user.save();

    res.json({
      success: true,
      message: "User activated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};