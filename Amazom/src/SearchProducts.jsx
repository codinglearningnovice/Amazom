import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SearchProducts.css";
import instance from "./axios";
import Product from "./Product";

function SearchProducts() {
  const [searchTerm, setsearchTerm] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) {
      setsearchTerm(query);
      fetchSearchResult(query);
    }
  }, [location.search]);

  const fetchSearchResult = async (query) => {
    if (!query.trim()) {
      setsearchResult([]);
      return;
    }
    setloading(true);
    setError(null);
    try {
      const response = await instance.get(`/product/search?query=${query}`);
      console.log(response);

      const data = await response.data;
      console.log("", data);
      setsearchResult(Array.isArray(data) ? data : [response.data]);
    } catch (err) {
      console.error("Fetching search results failed :", err);
      setError("Failed to load search results, please try again");
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (!searchTerm.trim()) return;
    const handler = setTimeout(() => {
      fetchSearchResult(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  return (
    <div className="search_product">
      <h2 className="search_product_headig">Search Results for: {searchTerm}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="search_products">
        {searchResult.length > 0 ? (
          searchResult.map((product) => (
            <Product
              key={product.product_id}
              id={product.product_id}
              title={product.product_name}
              image={product.product_img}
              price={product.product_price}
              rating={product.product_rating}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;
