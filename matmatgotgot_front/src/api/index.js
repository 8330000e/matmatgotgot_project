// api/index.js
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER || '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: Zustand Store에서 토큰 가져와 첨부
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 401/403 처리 일원화
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !error.config.url.includes("/members/login")
    ) {
      const logout = useAuthStore.getState().logout;
      
      // 중복 실행 방지
      if (!error.config._retry) {
        error.config._retry = true;
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;