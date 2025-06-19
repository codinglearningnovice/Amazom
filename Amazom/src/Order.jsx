import moment from 'moment'
import React, { useState } from 'react'
import CheckOutProduct from './CheckOutProduct'
//import CurrencyFormat from 'react-currency-format';
import "./Order.css"
import { useStateValue } from './StateProvider';
import { formatCurrency } from './CurrencyFormat';


/*istall moment for passig timestamp*/
function Order({ order }) {
  if (
    !order ||
    !order.id ||
    !order.data ||
    !order.data.createdAt ||
    !order.data.basket ||
    !Array.isArray(order.data.basket)
  ) {
    console.warn("Invalid order prop:", order);
    return null;
  }

  const { id, data } = order;

  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment(data.createdAt).format("MMMM Do YYYY, h:mma")}</p>
      <p className="order_id">
        <small>{order.id}</small>
      </p>

      {order.data.basket?.map((item) => (
        <CheckOutProduct
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hideButton
        />
      ))}

      
          <>
            <h3 className="order_total">
              Order Total: {formatCurrency(order.data.amount )}
            </h3>
          </>
        
    </div>
  );
}

export default Order