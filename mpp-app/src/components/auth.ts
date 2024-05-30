import axios from 'axios';

const API_URL = 'https://mpp-2m2u.onrender.com/api';

export const signup = async (username: string, password: string) => {
    return axios.post(`${API_URL}/signup`, { username, password });
};

export const login = async (username: string, password: string) => {
    return axios.post(`${API_URL}/login`, { username, password });
};
