import axios from "axios";

const instance = axios.create({
  baseURL: "https://amazomecommerc.onrender.com",
});

export default instance;
