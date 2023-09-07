const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    images: {
      type: String
    },
    // seller: {
    //   type: ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    seller: {
      type: String,
     
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
