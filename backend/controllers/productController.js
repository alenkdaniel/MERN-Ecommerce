import Product from "../models/Products.js";

export const createProducts = async (req, res) => {
  try {
    let { name, price, category, image, description, stock } = req.body;

    name = name?.trim();
    category = category?.trim();

    if (!name || !price || !category || stock == null) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    price = Number(price);
    stock = Number(stock);

    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ message: "Price and stock must be numbers" });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: "Invalid values" });
    }

    const product = await Product.create({
      name,
      price,
      category,
      image,
      description,
      stock,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, admin } = req.query;

    let query = {};

    if (!admin) {
      query.isActive = true;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    let sortOption = {};
    if (sort === "low") sortOption.price = 1;
    if (sort === "high") sortOption.price = -1;

    const products = await Product.find(query).sort(sortOption);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const { name, price, category, image, description, stock, isActive } =
      req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      updateData.price = numPrice;
    }

    if (stock !== undefined) {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0) {
        return res.status(400).json({ message: "Invalid stock" });
      }
      updateData.stock = numStock;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductsStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Status updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product restored",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};