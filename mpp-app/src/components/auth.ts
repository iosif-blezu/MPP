import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = async (username: string, password: string) => {
    return axios.post(`${API_URL}/signup`, { username, password });
};

export const login = async (username: string, password: string) => {
    return axios.post(`${API_URL}/login`, { username, password });
};
