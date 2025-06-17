import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:3600",
    withCredentials: true,
})





export default instance