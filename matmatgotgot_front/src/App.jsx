import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import './App.css';
import axios from 'axios';
import Header from './components/commons/Header.jsx';
import Footer from './components/commons/Footer.jsx';
import LoginPage from './pages/member/LoginPage.jsx';
import JoinPage from './pages/member/JoinPage.jsx';
import RestaurantMain from './pages/restaurant/RestaurantMain';
import RestaurantDetailSearch from './pages/restaurant/RestaurantDetailSearch.jsx';
import RestaurantRegist from './pages/restaurant/RestaurantRegist.jsx';
import RestaurantView from './pages/restaurant/RestaurantView.jsx';
import MypagePage from '../src/components/mypage/Mypage.jsx';
import ReviewRegist from './pages/restaurant/ReviewRegist.jsx';
import ReviewView from './pages/restaurant/ReviewView.jsx';
import TripMain from './pages/trip/TripMain.jsx';
import Main from './pages/Main.jsx';
import BoardListPage from './pages/board/BoardListPage';
import BoardWritePage from './pages/board/BoardWritePage';
import BoardViewPage from './pages/board/BoardViewPage.jsx';
import NaverSearch from './pages/board/NaverSearch.jsx';
import BoardAddress from './pages/board/BoardAddress.jsx';
import BoardModifyPage from './pages/board/BoardModifyPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import NaverCallbackPage from './pages/member/NaverCallbackPage.jsx';
import Finding from './pages/member/Finding.jsx';

function App() {
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // console.log("새로고침 후 Axios 헤더 세팅 완료", token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      // console.log("Axios Authorization 헤더 제거 완료");
    }
  }, [token]);

  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<JoinPage />} />
          <Route path="/rest" element={<RestaurantMain />} />
          <Route
            path="/login/oauth2/code/naver"
            element={<NaverCallbackPage />}
          />
          <Route path="/finding" element={<Finding />} />
          <Route
            path="/rest/detailsearch"
            element={<RestaurantDetailSearch />}
          />
          <Route path="/rest/regist" element={<RestaurantRegist />} />
          <Route path="/rest/view" element={<RestaurantView />} />
          <Route path="/rest/review/regist" element={<ReviewRegist />} />
          <Route path="/rest/review/view" element={<ReviewView />} />
          <Route path="/mypage" element={<MypagePage />} />
          <Route path="/board/list" element={<BoardListPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />
          <Route path="/board/view/:boardNo" element={<BoardViewPage />} />
          <Route path="/boardNavermap" element={<NaverSearch />} />
          <Route path="/boardAddress" element={<BoardAddress />} />
          <Route path="/board/modify/:boardNo" element={<BoardModifyPage />} />
          <Route path="/trip" element={<TripMain />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
