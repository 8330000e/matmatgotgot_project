import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import "./App.css";
import axios from "axios";
import Header from "./components/commons/Header.jsx";
import Footer from "./components/commons/Footer.jsx";
import Main from "./pages/Main";
import LoginPage from "./pages/member/LoginPage.jsx";
import JoinPage from "./pages/member/JoinPage.jsx";
import RestaurantMain from "./pages/restaurant/RestaurantMain";
import RestaurantDetailSearch from "./pages/restaurant/RestaurantDetailSearch.jsx";
import RestaurantRegist from "./pages/restaurant/RestaurantRegist.jsx";
import RestaurantView from "./pages/restaurant/RestaurantView.jsx";
import MypagePage from "./pages/MypagePage.jsx";
import ReviewRegist from "./pages/restaurant/ReviewRegist.jsx";
import ReviewView from "./pages/restaurant/ReviewView.jsx";
import TripMain from "./pages/trip/TripMain.jsx";

function App() {
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // console.log("새로고침 후 Axios 헤더 세팅 완료", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      // console.log("Axios Authorization 헤더 제거 완료");
    }
  }, [token]);

  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" element={<MainCover />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<JoinPage />} />
          <Route path="/rest" element={<RestaurantMain />} />
          <Route
            path="/rest/detailsearch"
            element={<RestaurantDetailSearch />}
          />
          <Route path="/rest/regist" element={<RestaurantRegist />} />
          <Route path="/rest/view" element={<RestaurantView />} />
          <Route path="/rest/review/regist" element={<ReviewRegist />} />
          <Route path="/rest/review/view" element={<ReviewView />} />
          <Route path="/mypage" element={<MypagePage />} />
          <Route path="/trip" element={<TripMain />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
