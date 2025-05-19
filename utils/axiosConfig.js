// utils/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.132:5000", // Đặt đúng IP và cổng server bạn đang chạy
  timeout: 5000,
});

export default instance;
