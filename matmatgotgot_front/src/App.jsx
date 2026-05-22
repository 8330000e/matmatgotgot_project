import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainCover from "./pages/MainCover";
import Main from "./pages/Main";
import RestaurantMain from "./pages/restaurant/RestaurantMain";
import Login from "./pages/member/Login.jsx";
import Join from "./pages/member/Join.jsx";

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
          <Route path="/restaurantmain" element={<RestaurantMain />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
