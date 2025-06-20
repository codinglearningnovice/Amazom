import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
//import Product from "./Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckOut from "./CheckOut";
import Login from "./Login";
//import { auth } from "./firebase";
//import { onAuthStateChanged } from "firebase/auth";
import { onAuthStateChanged } from "./Authentication";
import { useStateValue } from "./StateProvider";
import PPayment from "./PPayment";
//import { loadStripe } from "@stripe/stripe-js";
//import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";
import SearchProducts from "./SearchProducts";

/*const promise = loadStripe(
  "pk_test_51QeLNOPDBn2nIcH7qbr02rv7Yi5FLQtPiefUSzKyvsnomANGSTnw8nYjs10iAToCivELFA1sFEjWIhDuCm15bSYL00uNDL0F8i"
);*/

function App() {
  const [authUser, setauthUser] = useState(null);
  const [{ basket }, dispatch] = useStateValue();

  useEffect(() => {
    onAuthStateChanged(setauthUser);
  }, []);

  useEffect(() => {
    if (authUser !== null) {
      dispatch({
        type: "SET_INAPPUSER",
        authUser: authUser,
      });
    } else {
      dispatch({
        type: "SET_INAPPUSER",
        authUser: null,
      });
    }
  }, [authUser]);
  useEffect(() => {
    const storedBasket = localStorage.getItem("basket");
    console.log("kkdjrjrjr", storedBasket);
    if (storedBasket) {
      try {
        dispatch({
          type: "SET_BASKET",
          basket: JSON.parse(storedBasket),
        });
        console.log("tkis is the item here", JSON.parse(storedBasket));
      } catch (error) {
        console.error("Error parsing basket from localStorage", error);
      }
    }
  }, []);

  console.log("this is the user", authUser);
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/checkout"
            element={
              <>
                <Header />
                <CheckOut />
              </>
            }
          ></Route>
          <Route
            path="/payment"
            element={
              <>
                <Header />
                <PPayment />
              </>
            }
          ></Route>

          <Route
            path="/orders"
            element={
              <>
                <Header />
                <Orders />
              </>
            }
          ></Route>
          <Route
            path="/search"
            element={
              <>
                <Header />
                <SearchProducts />
              </>
            }
          ></Route>

          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
