// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Menu from './components/Menu';
import Schedule from './components/Schedule';
import Footer from './components/Footer';


function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    console.log("Status login saat Home tampil:", loginStatus);
  }, []);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection />
      <Footer />
    </div>
  );
}

export default Home;
