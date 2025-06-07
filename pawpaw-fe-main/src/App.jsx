import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Menu from "./components/Menu";
import Schedule from "./components/schedule";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./Home";

const AppContent = () => {
  const [data, setData] = useState([]);
  const location = useLocation();

  // Cek apakah user sudah login
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Ambil data menu saat pertama kali load
  useEffect(() => {
    fetch("http://localhost/my-api/get-menus.php")
      .then((res) => res.json())
      .then((result) => {
        setData(result.menus);
      })
      .catch((error) => {
        console.error("Gagal mengambil data menu:", error);
      });
  }, []);

  // Tampilkan Navbar hanya jika bukan di halaman login/register
  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard data={data} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
