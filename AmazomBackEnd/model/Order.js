const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    basket: Array,
    amount: Number,
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);