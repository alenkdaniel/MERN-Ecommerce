import Cart from '../models/Cart.js'


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { product } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existing = cart.items.find(
      (i) => i.productId.toString() === product._id
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};


export const updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) item.qty = qty;

    await cart.save();

    res.json(cart);
  } catch {
    res.status(500).json({ message: "Error updating cart" });
  }
};


export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch {
    res.status(500).json({ message: "Error removing item" });
  }
};