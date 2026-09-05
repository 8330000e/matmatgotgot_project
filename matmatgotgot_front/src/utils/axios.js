import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// 1. Axios 기본 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER,
  timeout: 10000,
});

// 2. 요청 인터셉터: API 요청 시 자동으로 LocalStorage/Store의 JWT 토큰 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답 인터셉터: 로그인/회원가입 요청을 제외한 API에서 401/403 발생 시에만 자동 로그아웃 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest = requestUrl.includes("/members/login") || requestUrl.includes("/members/join");

    if (
      error.response && 
      (error.response.status === 401 || error.response.status === 403) &&
      !isAuthRequest
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        console.warn("JWT 토큰이 만료되었거나 유효하지 않습니다. 로그아웃을 진행합니다.");

        const { logout } = useAuthStore.getState();
        if (logout) {
          logout();
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;