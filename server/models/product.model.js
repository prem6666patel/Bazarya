import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
    },
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    discription: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  discription: "text",
},{name:10,discription:5});

const productModel = mongoose.model("product", productSchema);

export default productModel;
