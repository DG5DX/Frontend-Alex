import axios from 'axios';
const token = localStorage.getItem('token') || '';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    "token": token
  }
});

export default apiClient;