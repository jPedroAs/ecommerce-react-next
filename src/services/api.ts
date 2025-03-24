import axios from 'axios'

const api = axios.create({
    baseURL:"https://eiif5bjnih.execute-api.us-east-1.amazonaws.com",
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api 