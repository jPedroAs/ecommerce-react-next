import axios from 'axios'

const api = axios.create({
    baseURL:"https://eiif5bjnih.execute-api.us-east-1.amazonaws.com",
    headers: {
        'Content-Type': 'application/json', // Garante que o tipo de conteúdo seja JSON
    }
})

export default api 