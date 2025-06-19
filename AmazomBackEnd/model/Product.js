const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    employee_id: {
      type: Object,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_desc: {
      type: String,
      required: true,
    },
    product_img: {
      
      type: String,
      required: true,
    },
    product_rating: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    category:{
      type: String,
    }
  },
  { timestamps: true }
);




module.exports = mongoose.model("Product",productSchema);