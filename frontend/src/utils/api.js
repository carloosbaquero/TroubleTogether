import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/api`,
  timeout: 5000
})

export default api
