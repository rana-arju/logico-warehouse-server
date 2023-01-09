const express = require("express");
const {
  createProduct,
  products,
  sellerProducts,
  deleteProduct,
  singleProduct,
} = require("../controllers/products");
const { auth } = require("../middleware/auth");

const router = express.Router();
router.post("/createProduct", auth, createProduct);
router.get("/products",  products);
router.get("/singleProduct/:id", singleProduct);
router.get("/sellerProducts",auth, sellerProducts);
router.delete("/deleteProduct/:id",  deleteProduct);
module.exports = router;
