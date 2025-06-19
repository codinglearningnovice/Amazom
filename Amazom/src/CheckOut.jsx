import React from "react";
import "./CheckOut.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import CheckOutProduct from "./CheckOutProduct";
import { PaystackButton } from "react-paystack";

function CheckOut() {
  const [{ basket, user }] = useStateValue();

  return (
    <div className="checkout">
      <div className="checkout_left">
        <img
          src="https://images-eu.ssl-images-amazon.com/images/G/30/ES-hq/2020/img/Amazon_Payments/es-gil_03-2022_category-page_desktop_1500x150.jpg"
          alt=""
          className="checkout_ad"
        />
        <div>
          <h2 className="checkout_title">Your Shopping Basket</h2>
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
      <div className="checkout_right">
        <Subtotal />
      </div>
    </div>
  );
}

export default CheckOut;
