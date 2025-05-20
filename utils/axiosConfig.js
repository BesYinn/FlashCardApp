import axios from 'axios';
import { API_URL } from '@env';

const axiosInstance = axios.create({
  baseURL: "http://192.168.172.118:5000",
  timeout: 5000,
});

export default axiosInstance;
