import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainCover from "./pages/MainCover";
import Main from "./pages/Main";
import RestaurantMain from "./pages/restaurant/RestaurantMain";
import Login from "./pages/member/Login.jsx";
import Join from "./pages/member/Join.jsx";
import {useEffect} from "react";
import axios from "axios";
import { useAuthStore } from "./store/useAuthStore.js";

function App() {
  //관리자 페이지 로직
  
  const token = useAuthStore((state) => state.token);
  useEffect(()=>{
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("새로고침 후 Axios 헤더 세팅 완료", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      console.log("Axios Authorization 헤더 제거 완료");
    }
  },[token]);

  return (
    <div className="wrap">
      {/* <Header /> */}
      <div className="main">
        <Routes>
          <Route path="/" element={<MainCover />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Join />} />
          <Route path="/restaurantmain" element={<RestaurantMain />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
