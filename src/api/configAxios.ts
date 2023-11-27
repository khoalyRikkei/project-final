import axios from "axios";

const API = import.meta.env.VITE_API;
const token = localStorage.getItem("token");

const axiosInstace = axios.create({
  baseURL: API,
  headers: {
    // Luôn đưa token gửi trong request header
    Authorization: "Bearer " + token,
    // Kiểu dữ liệu gửi của request body  (có thể không cần)
    "Content-Type": "application/json",
  },
});

export default axiosInstace;
