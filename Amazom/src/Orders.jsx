import React, { useEffect, useState } from "react";
import "./Orders.css";
import { useStateValue } from "./StateProvider";
//import { db } from './firebase'
//import { PaymentElement } from '@stripe/react-stripe-js'
import instance from "./axios";
import Order from "./Order";
import io from "socket.io-client";

const socket = io("https://amazom.onrender.com");

function Orders() {
  const [{ basket, authUser }, dispatch] = useStateValue();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!authUser) {
      console.log("No authUser, skipping fetch");
      setOrders([]);
      return;
    }

    console.log("authUser:", authUser);

    const fetchOrders = async () => {
      try {
        const response = await instance.get("/orders", {
          params: { username: authUser },
        });
        console.log("Response data:", response.data);
        if (!Array.isArray(response.data)) {
          console.error("Invalid response.data:", response.data);

          return;
        }

        const transformedOrders = response.data.map((order) => {
          console.log("Mapping order:", order); // Debug each order
          return {
            id: order._id,
            data: { ...order },
          };
        });
        console.log("Transformed orders:", transformedOrders); // Debug
        setOrders([...transformedOrders]); //
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status !== 404) {
          setOrders([]);
        }
      }
    };
    fetchOrders();

    // WebSocket setup
    socket.emit("join-user", authUser);
    socket.on("orders-updated", (updatedOrders) => {
      console.log("Received real-time order update:", updatedOrders);

      const ordersArray = Array.isArray(updatedOrders)
        ? updatedOrders
        : updatedOrders && typeof updatedOrders === "object"
        ? [updatedOrders]
        : [];
      if (!ordersArray.length) {
        console.error("No valid orders in WebSocket update:", updatedOrders);
        return;
      }
      const transformedOrders = ordersArray.map((order) => ({
        id: order._id,
        data: { ...order },
      }));
      console.log("Transformed WebSocket orders:", transformedOrders);
      setOrders([...transformedOrders]);
    });
    // Cleanup
    return () => {
      socket.off("orders-updated");
      // Optionally leave room: socket.emit('leave-user', user.uid);
    };
  }, [authUser]);

  useEffect(() => {
    console.log("Updated orders state:", orders); // Debug state changes
  }, [orders]);

  return (
    <div className="orders">
      <h1>Your orders</h1>

      {orders.length === 0 || !Array.isArray(orders) ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <Order key={order.id || `order-${index}`} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
