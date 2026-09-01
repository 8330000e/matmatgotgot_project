import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";

import axios from 'axios'
import { useAuthStore } from './store/useAuthStore'

// Axios 전역 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    // 💡 로그아웃 요청에는 만료된 토큰을 첨부하지 않음 (무한 루프 방지)
    if (config.url.includes('/members/logout')) {
      delete config.headers.Authorization;
      return config;
    }

    const token = useAuthStore.getState().token || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // 401/403 인증 실패 시
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 💡 요청 URL이 이미 로그아웃 요청인 경우 재요청을 하지 않고 즉시 정리 (무한 루프 차단)
      if (originalRequest.url.includes('/members/logout')) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // 1. 클라이언트 인증 정보 즉시 제거 (로컬 처리)
        const logout = useAuthStore.getState().logout;
        if (logout) {
          logout();
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        
        // 2. 메인 페이지로 이동 (서버 로그아웃 호출 시 URL 중복 주의)
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
