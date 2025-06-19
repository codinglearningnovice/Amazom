import React from "react";
import instance from "./axios";
import { useNavigate } from "react-router-dom";

export const createUserWithEmailAndPassword = async (user, pwd) => {
  const response = await fetch("https://amazomecommerc.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user, pwd }),
  });
  const status = await response.status;

  const data = await response.json();

  console.log("register status", status);
  localStorage.setItem("username", JSON.stringify(data.username));
  localStorage.setItem("accessToken", data.accessToken);

  triggerAuthStateChanged();

  return { status, data };
};

export const signInWithEmailAndPassword = async (user, pwd) => {
  const response = await fetch("https://amazomecommerc.onrender.com/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user, pwd }),
  });
  const status = await response.status;
  const data = await response.json();
  localStorage.setItem("username", JSON.stringify(data.username));
  localStorage.setItem("accessToken", data.accessToken);
  triggerAuthStateChanged();

  return { status, data };
};

/*export const signInWithEmailAndPassword = async(user, pwd) => {
  
  const response = await fetch("http://localhost:3600/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pwd }),
  });
  const status = response.status;

  const data = await response.json();

  dispatch({
    type: "SET_USER",
    user: data,
  });

  if (status === 200) {
    localStorage.setItem("authData", JSON.stringify(data.username));
  }

  console.log(JSON.parse(localStorage.getItem("authData")));

  return { status, data };
}*/

export const onAuthStateChanged = (callback) => {
  // Initial check

  try {
    const userData = JSON.parse(localStorage.getItem("username"));
    callback(userData);
  } catch {
    console.log("error");
  }

  const handleStorageChange = (event) => {
    if (event.key === "username" || event.key === null) {
      const newUserData = JSON.parse(localStorage.getItem("username"));
      callback(newUserData);
    }
  };

  const handleAuthChange = () => {
    const newUserData = JSON.parse(localStorage.getItem("username"));
    callback(newUserData);
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("authStateChanged", handleAuthChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("authStateChanged", handleAuthChange);
  };
};

export const triggerAuthStateChanged = () => {
  window.dispatchEvent(new Event("authStateChanged"));
};

export const logout = async (dispatch) => {
  //const navigate = useNavigate()
  try {
    const response = await fetch("http://localhost:3600/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: "include",
    });
    console.log("Logout response:", response);
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("basket");
    dispatch({ type: "SET_USER", user: null });
    console.log("i got here");
    return { status: 204 };
  } catch (error) {
    console.error("Logout error:", error);
  }
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await instance.post(
          "/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
