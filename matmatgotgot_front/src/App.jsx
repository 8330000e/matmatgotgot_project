import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainCover from "./pages/MainCover";
import Main from "./pages/Main";
import RestaurantMain from "./pages/restaurant/RestaurantMain";
import RestaurantDetailSearch from "./pages/restaurant/RestaurantDetailSearch.jsx";
import Login from "./pages/member/Login.jsx";
import Join from "./pages/member/Join.jsx";
import RestaurantRegist from "./pages/restaurant/RestaurantRegist.jsx";
import RestaurantView from "./pages/restaurant/RestaurantView.jsx";

function App() {
  return (
    <div className="wrap">
      {/* <Header /> */}
      <div className="main">
        <Routes>
          <Route path="/" element={<MainCover />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Join />} />
          <Route path="/rest" element={<RestaurantMain />} />
          <Route
            path="/rest/detailsearch"
            element={<RestaurantDetailSearch />}
          />
          <Route path="/rest/regist" element={<RestaurantRegist />} />
          <Route path="/rest/view" element={<RestaurantView />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
