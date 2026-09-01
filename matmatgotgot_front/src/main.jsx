import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";

import axios from 'axios'
import { useAuthStore } from './store/useAuthStore'

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 리턴
  (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 또는 403 Forbidden 에러 감지
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 중복 알림/리다이렉트 방지
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        console.warn("JWT 토큰이 만료되었거나 유효하지 않습니다.");

        // 스토어 상태 및 Storage 초기화
        const logout = useAuthStore.getState().logout;
        if (logout) {
          logout();
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = "/"; // 메인/로그인 페이지로 이동
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
