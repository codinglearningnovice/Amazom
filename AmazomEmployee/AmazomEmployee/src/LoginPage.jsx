import "./Login.css";
import { useEffect, useState } from "react";
import React from "react";
import instance from "./axios";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function LoginPage() {
  const [user, setUsername] = useState("");
  const [pwd, setPassword] = useState("");
  const [error, setError] = useState("");
  const [state,dispatch] = useStateValue("");

  const authuser = state.authuser; 

  /*useEffect(() => {
    console.log("Updated authuser:", authuser);
  }, [authuser]);*/

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await instance.post("/auth", {
        user,
        pwd,
      });
      //console.log("this is the respose",response.data);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("username", response.data.username);
        //userDetails = {}
        dispatch({ type: "Set_User", authuser: response.data.username });
        
        navigate("/postproduct", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>
        <div className="form">
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                value={user}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
                aria-describedby="username-error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                aria-describedby="password-error"
              />
            </div>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <button className="login-button" onClick={submit}>
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
