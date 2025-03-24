import axios from 'axios'
import Cookies from "js-cookie";

const api = axios.create({
    baseURL:"https://santapiapi.onrender.com",
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api 