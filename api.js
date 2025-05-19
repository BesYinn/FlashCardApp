import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.132:5000', // thay bằng địa chỉ IP backend thật
});

export default API;
