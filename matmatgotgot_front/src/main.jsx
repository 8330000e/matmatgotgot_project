import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";

import axios from 'axios'
import { useAuthStore } from './store/useAuthStore'

console.log("아이디: ", useAuthStore.getState().memberId, "\n토큰: ", useAuthStore.getState().token);

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;

//     // 401 / 403 에러 처리
//     // 단, 로그인 요청은 제외
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403) &&
//       !originalRequest.url.includes("/members/login")
//     ) {
//       console.log(
//         "아이디: ",
//         useAuthStore.getState().memberId,
//         "\n토큰: ",
//         useAuthStore.getState().token
//       );

//       // 중복 알림/리다이렉트 방지
//       if (!originalRequest._retry) {
//         originalRequest._retry = true;

//         console.warn("JWT 토큰이 만료되었거나 유효하지 않습니다.");

//         const logout = useAuthStore.getState().logout;

//         if (logout) {
//           logout();
//         } else {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         }

//         alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

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
