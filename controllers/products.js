const Product = require("../models/Product");
// POST Method for new product add
exports.createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!product.name || !product.price || !product.images || !product.stock) {
      const product = await Product().save(product);
      await product.populate(
        "seller",
        "first_name last_name username picture email"
      );
      res.json({
        success: true,
        message: `Successfully Product added ${product.name}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Product
exports.products = async (req, res) => {
  try {
    const products = await Product.find({});
    const singleProduct = await Product.findById(req.params.id).populate(
      "seller",
      "first_name last_name username picture"
    );

    res.json({ products, singleProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//single get Product
exports.singleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({_id: req.params.id});
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// user Product
exports.sellerProducts = async (req, res) => {
  try {
    const email = req.query.email;
    const user = req.user.email;
    if (email === user) {
      const singleProduct = await Product.find({
        email,
      }).populate("seller", "first_name last_name username picture");

      res.json({ singleProduct });
    } else {
      res.status(403).send({ message: "Forbidden Access" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
