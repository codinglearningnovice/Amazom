import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
//import { auth } from './firebase';
import { logout } from "./Authentication";
import { useNavigate } from "react-router-dom";


function Header() {
  const [{ basket, authUser }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const handleAuthentication =async () => {
    if (authUser) {
      const response =await logout(dispatch);
      if (response.status === 204) {
        navigate("/login");
      }
      //auth.signOut();
    }
  };

  return (
    <div className="header">
      <Link to="/">
        <img
          className="headretr_lodo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>

      <div className="header_search">
        <input className="header_searchIput" type="text" />
        <SearchIcon className="header_searchIcon" />
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

        <div className="header_option">
          <span className="header_option1">Returs</span>
          <span className="header_option2">&Orders</span>
        </div>

        <div className="header_option">
          <span className="header_option1">Your</span>
          <span className="header_option2">Prime</span>
        </div>
        <Link to="/checkout">
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
