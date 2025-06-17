const express = require("express");

router = express.Router();
const orderController = require("../../controller/ordersController");

router

  .post("/", orderController.createNewOrder)
  .get("/", orderController.getAllOrders);



  module.exports = router;
