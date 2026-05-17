import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainCover from "./pages/MainCover";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Join from "./pages/Join";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainCover/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Join />} />
      </Routes>
    </>
  );
}

export default App;
