import axios from 'axios';

// 서버의 주소 등의 네트워크를 설정합니다.

const api = axios.create({
  baseURL: 'http://43.200.160.144:8080/api',
  withCredentials: true,
});

//공통 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;