import "./SignupPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "./axios";

function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setError("")

    try {
      const response = await instance.post("/register", {
        firstname,
        lastname,
        user,
        pwd,
        employeeId,
      });

      const clearForm = () => {
        setFirstname("");
        setLastname("");
        setUser("");
        setPwd("");
        setEmployeeId("");
      };

      if (response.status === 201) {
        clearForm();
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("username", response.data.username);
        dispatch({ type: "Set_User", authuser: response.data.username });
        navigate("/postproduct", { replace: true });
      }

      console.log("Response:", response);

    } catch (err) {
      console.error(err);
      setError("registratio failed, please try again")
    }
  };

  return (
    <div className="signup-Page">
      <div className="signup-container">
        <h1 className="signup-title">SignUP</h1>
        <div className="signup-form-container">
          <form className="signup-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                aria-describedby="firstname-error"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                aria-describedby="lastname-error"
              />
            </div>
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                aria-describedby="username-error"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-describedby="password-error"
              />
            </div>
            <div className="form-group">
              <label>employeeId</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                aria-describedby="employeeId-error"
              />
            </div>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            <button className="signup" onClick={signup}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
