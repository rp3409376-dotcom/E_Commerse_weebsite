import product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const products = await product.create({
      ...req.body,
      image: req.body.image?.trim(),
    });
    res.json({
      message: "Product created successfully",
      product: products,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all products
export const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      const categoryPatterns = {
        laptop: "laptop|macbook|notebook",
        mobiles: "phone|mobile|iphone|samsung",
        tables: "table|desk",
      };
      const normalizedCategory = category.trim().toLowerCase();
      const titlePattern = categoryPatterns[normalizedCategory];

      query.$or = [
        { category: { $regex: `^${category.trim()}$`, $options: "i" } },
        ...(titlePattern
          ? [{ title: { $regex: titlePattern, $options: "i" } }]
          : []),
      ];
    }
    const products = await product.find(query).sort({ createdAt: -1 });
    res.json({
      message: "Products retrieved successfully",
      products: products,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productById = await product.findById(req.params.id);
    if (!productById) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(productById);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
