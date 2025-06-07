import React from "react";
import useNavbarToggle from "../hooks/Navbar";
import { FaShoppingCart } from "react-icons/fa";
import Keranjang from "./Keranjang";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
    console.log("Status login di Navbar:", isLoggedIn);
    const { isMenuOpen, toggleMenu, isCartOpen, toggleCart } = useNavbarToggle();

    return (
        <nav className="bg-amber-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-20">
            
            {/* KIRI - Logo */}
            <Link to="/" className="flex items-center space-x-3">
            <img src="/assets/logo.png" className="h-10" alt="PlanEaten Logo" />
            <span className="text-2xl font-semibold text-white">PlanEaten</span>
            </Link>

            {/* TENGAH - Menu Navigasi */}
            {isLoggedIn && (
            <div className="hidden md:flex space-x-8">
                <a href="#home" className="text-white hover:text-amber-300">Home</a>
                <a href="#menu" className="text-white hover:text-amber-300">Menu</a>
                <a href="#schedule" className="text-white hover:text-amber-300">Schedule</a>
            </div>
            )}

            {/* KANAN - Cart dan Logout/Login */}
            <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                <>
                <button
                    onClick={toggleCart}
                    className="text-white hover:text-amber-300"
                >
                    <FaShoppingCart className="text-xl" />
                </button>
                <button
                    onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    window.location.href = "/login";
                    }}
                    className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-amber-800"
                >
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link to="/register" className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-amber-800">Register</Link>
                <Link to="/login" className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-amber-800">Login</Link>
                </>
            )}
            
            {/* Tombol menu untuk mobile */}
                {isLoggedIn && (
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                )}
            </div>
        </div>

        {/* Menu Mobile */}
        {isLoggedIn && isMenuOpen && (
            <div
                className="md:hidden w-full p-4"
                id="navbar-sticky"    
                >
                <ul className="flex flex-col p-4 mt- font-medium border border-amber-100 rounded-lg bg-amber-50 dark:bg-amber-800 dark:border-amber-700 space-y-2">
                <li>
                    <a
                    href="#home"
                    className="block py-2 px-3 text-white bg-amber-700 rounded-sm dark:bg-amber-700 dark:text-white"
                    aria-current="page"
                    >
                    Home
                    </a>
                </li>
                <li>
                    <a
                    href="#menu"
                    className="block py-2 px-3 text-amber-900 rounded-sm hover:bg-amber-100 dark:text-white dark:hover:bg-amber-700"
                    >
                    Menu
                    </a>
                </li>
                <li>
                    <a
                    href="#schedule"
                    className="block py-2 px-3 text-amber-900 rounded-sm hover:bg-amber-100 dark:text-white dark:hover:bg-amber-700"
                    >
                    Schedule
                    </a>
                </li>
                </ul>
            </div>
            )}



        {/* Keranjang Pop-up */}
        {isCartOpen && isLoggedIn && (
            <div className="absolute right-4 top-20 bg-white p-4 shadow-md rounded-lg text-amber-700">
            <Keranjang />
            </div>
        )}
        </nav>
    );
};

export default Navbar;
