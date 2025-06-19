const Order = require("../model/Order");
const {
  emitOrderUpdate,
} = require("./../services/socketService");

const createNewOrder = async (req, res) => {
  const { authUser, basket, amount } = req.body;

  try {
    const result = await Order.create({
      username: String(authUser),
      basket: basket,
      amount: amount,
    });

    console.log("New Order Created:", result);

    await emitOrderUpdate(authUser);
    return res.status(201).json({ message: `New  ${result} created` });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrders = async (req, res) => {
  const { username } = req.query.query;
  console.log("type of query",username);
  if (!username)
    return res.status(401).json({ error: "User not authenticated" });
  try {
    
    const orders = await Order.find({ username }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "this is Server error" });
  }
};
module.exports = { createNewOrder, getAllOrders };
