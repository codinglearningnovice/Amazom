const Order = require("../model/Order");

let io;

function initialize(socketIoInstance) {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-user", (username) => {
      socket.join(username);
      console.log(`User ${username} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

async function emitOrderUpdate(username) {
  try {
    const orders = await Order.find({ username }).sort({ created: -1 });
    io.to(username).emit("orders-updated", orders);
    console.log(`Emitted orders-updated to user ${username}`);
  } catch (error) {
    console.error("Error emitting order update:", error);
  }
}

module.exports = {
  initialize,
  emitOrderUpdate,
};
