// src/axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://86.125.70.138:45871/api',
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
