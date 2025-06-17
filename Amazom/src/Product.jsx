import React from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";

function Product({ id, title, image, price, rating }) {
  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    console.log("Adding to basket:", { id, title, image, price, rating });
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        image,
        price,
        rating,
      },
    });
  };

  return (
    <div className="product">
      <div className="product__info">
        <p className="product__title">{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(Math.round(rating || 0))
            .fill()
            .map((_, i) => (
              <span key={i}>⭐</span>
            ))}
        </div>
      </div>
      <img className="product__image" src={image} alt={title} />
      <button className="product__button" onClick={addToBasket}>
        Add to Basket
      </button>
    </div>
  );
}

export default Product;

