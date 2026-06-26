import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Request mein token add karo
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ✅ PERMANENT FIX — 401 aaye to auto clear karo
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto clear karo
            localStorage.clear()
            // Login page pe bhejo
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default API