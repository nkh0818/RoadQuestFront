import axios from 'axios';

// 서버의 주소 등의 네트워크를 설정합니다.

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export default api;