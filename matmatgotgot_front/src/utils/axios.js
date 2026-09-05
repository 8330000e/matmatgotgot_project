import axios from "axios";
import { useAuthStore } from "../store/useAuthStore"; // Zustand 스토어 경로

// 1. Axios 기본 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER,
  timeout: 10000,
});

// 2. 요청 인터셉터: API 요청 시 자동으로 LocalStorage/Store의 JWT 토큰 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    // Zustand 스토어나 localStorage에서 토큰 가져오기
    const token = useAuthStore.getState().token || localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답 인터셉터: 백엔드 응답에서 인증 에러(401/403) 발생 시 자동 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401(Unauthorized) 또는 403(Forbidden - 만료/권한없음) 에러 감지
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 무한 리다이렉트 방지 플래그
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        console.warn("JWT 토큰이 만료되었거나 유효하지 않습니다. 로그아웃을 진행합니다.");

        // ① Zustand 인증 상태 및 저장소 정리
        const { logout } = useAuthStore.getState();
        if (logout) {
          logout(); // 스토어 내부에서 localStorage.removeItem("token") 등 수행
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        // ② 알림 표시 및 로그인/메인 페이지로 이동
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = "/"; // 메인/로그인 페이지로 강제 리다이렉트
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;