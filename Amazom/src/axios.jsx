import axios from "axios";

const instance = axios.create({
  baseURL: "https://amazom.onrender.com",
});

export default instance;
