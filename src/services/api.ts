import axios from 'axios'

const api = axios.create({
    // baseURL:"https://eiif5bjnih.execute-api.us-east-1.amazonaws.com",
    baseURL:"https://santapiapi.onrender.com",
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api 