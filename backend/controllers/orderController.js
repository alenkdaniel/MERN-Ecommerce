import Order from '../models/Orders.js'
import Address from '../models/Address.js'

export const saveAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const existing = await Address.findOne({ userId });

    if (existing) {
      await Address.findOneAndUpdate({ userId }, req.body);
      return res.json({ message: "Address updated" });
    }

    await Address.create({ ...req.body, userId });

    res.json({ message: "Address saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving address" });
  }
};


export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const address = await Address.findOne({ userId });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Error fetching address" });
  }
};


export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { products, totalAmount, address } = req.body;


    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount required" });
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      address,
    });

    res.json({ message: "Order placed successfully", order });

  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({ message: "Error placing order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") 
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    
    res.status(500).json({ message: error.message});
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};