import React, { useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckOutProduct from "./CheckOutProduct";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import { PaystackButton } from "react-paystack";
import instance from "./axios";

function PPayment() {
  const [{ basket, authUser }, dispatch] = useStateValue();
  const paystack_key = import.meta.env.VITE_PAYSTACK_SECRET;

  const config = {
    reference: new Date().getTime().toString(),
    email: String(authUser),
    amount: getBasketTotal(basket), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: paystack_key,
  };
  const amount = getBasketTotal(basket)
  const data = { authUser,basket, amount  };
  const postOrders = async () => {
    try {
        const response = await instance.post("/orders", data);
        if (response.status === 201) {
            alert("Thanks for your purchase");
        }
    } catch (e) {console.log("database error",e)}
  };
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    postOrders();

    dispatch({
      type: "EMPTY_BASKET",
      basket: [],
    });
    navigate("/orders", { replace: true });
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    alert("Payment not completed");
    console.log("closed");
  };

  const componentProps = {
    ...config,
    text: "Make Payment",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  const navigate = useNavigate();
  return (
    <div className="paymet">
      <div className="paymet_cotaier">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="paymet_sectio">
          <div className="paymet_title">
            <h3>Delivery Address</h3>
          </div>
          <div className="paymet_address">
            <p>{authUser}</p>
            <p>51 Coimbra</p>
            <p>Portugal</p>
          </div>
        </div>
        <div className="paymet_sectio">
          <div className="paymet_title">
            <h3>Review items and Delivery</h3>
          </div>
          <div className="paymet_items">
            {basket.map((item) => (
              <CheckOutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="paymet_sectio">
          <div className="paymet_title">
            <h3>Payment Method</h3>
          </div>
          <div className="paymet_details">
            <CurrencyFormat
              renderText={(value) => <h3>Order Total: {value}</h3>}
              decimalScale={2}
              value={getBasketTotal(basket)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </div>
          <PaystackButton {...componentProps} />
        </div>
      </div>
    </div>
  );
}

export default PPayment;
