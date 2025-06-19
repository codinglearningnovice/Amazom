import React from "react";
import "./Subtotal.css";
//import CurrencyFormat from "react-currency-format";
import { formatCurrency } from "./CurrencyFormat";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useNavigate } from "react-router-dom";

function Subtotal() {
  const navigate = useNavigate();
  const [{ basket, authUser }, dispatch] = useStateValue();
  console.log("this is callig from subtoal:", authUser);

  return (
    <div className="subtotal">
      <p>
        Subtotal ({basket?.length} items)::
        <strong>{formatCurrency(getBasketTotal(basket))}</strong>
      </p>
      <small className="subtotal_gift">
        <input type="checkbox" /> This order contains a gift
      </small>

      <button
        className="button"
        onClick={(e) =>
          basket?.length > 0 ? navigate("/payment") : alert("basket is empty")
        }
      >
        proceed to payment
      </button>
    </div>
  );
}

export default Subtotal;
