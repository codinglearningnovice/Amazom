import React, { useEffect, useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
//import { auth } from './firebase';
import { logout } from "./Authentication";
import { useNavigate } from "react-router-dom";
import { use } from "react";

function Header() {
  const [{ basket, authUser }, dispatch] = useStateValue();
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const handleAuthentication = async () => {
    if (authUser) {
      const response = await logout(dispatch);
      if (response.status === 204) {
        navigate("/login");
      }
      //auth.signOut();
    }
  };

  const handleSearch = () => {
    if (search) {
      console.log("search butto clicked");
      navigate(`/search?query=${search}`);
    }
  };

  useEffect(() => {
    if (!basket.length) return;
    localStorage.setItem("basket", JSON.stringify(basket));
  }, [basket]);
  console.log(localStorage.getItem("basket"));
  return (
    <div className="header">
      <Link to="/">
        <img
          className="headretr_lodo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>

      <div className="header_search">
        <input
          className="header_searchIput"
          value={search}
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
        <button className="headerbutton" onClick={handleSearch} type="submit">
          <SearchIcon className="header_searchIcon" />
        </button>
      </div>

      <div className="header_av">
        <Link to={!authUser && "/login"}>
          <div onClick={handleAuthentication} className="header_option">
            <span className="header_option1">Hello {authUser || "Guest"}</span>
            <span className="header_option2">
              {authUser ? "Sign Out" : "Sign in"}
            </span>
          </div>
        </Link>

        <Link
          to={authUser ? "/orders" : "#"}
          onClick={() => {
            if (!authUser) {
              alert("You must be logged in to view orders!");
            }
          }}
        >
          <div className="header_option">
            <span className="header_option1">Returs</span>
            <span className="header_option2">&Orders</span>
          </div>
        </Link>

        <div className="header_option">
          <span className="header_option1">Your</span>
          <span className="header_option2">Prime</span>
        </div>
        <Link to={!authUser ? "/login" : "/checkout"}>
          <div className="header_option_basket">
            <ShoppingBasketIcon />
            <span className="header_option1 header_basketCount">
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
