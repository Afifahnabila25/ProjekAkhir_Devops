import React from 'react';
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { SiShopee, SiGooglemaps, SiGojek, SiGrab } from "react-icons/si";

// ini function untuk bantuin nyari section berdasarkan id 
const Footer = () => {

    return (
        <footer className="bg-gray-900 text-gray-400 w-full p-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                    <div className="mb-6 sm:mb-0">
                        {/* ini logo dan nama */}
                        <div className="flex items-center gap-2">
                            <img src="assets/logo.png" className="h-8" alt="CanEaten Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PlanEaten</span>
                        </div>
                    </div>

                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {/* ini untuk pilihan yang ketika di klik bisa langsung ke section nya */}
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
                        <li>
                            <a href="#home" className="block py-2 px-3 hover:text-white cursor-pointer">Home</a>
                        </li>
                        <li>
                            <a href="#menu" className="block py-2 px-3 hover:text-white cursor-pointer">Menu</a>
                        </li>
                        <li>
                            <a href="#schedule" className="block py-2 px-3 hover:text-white cursor-pointer">Schedule</a>
                        </li>
                    </ul>
                </div>
                </div>

                {/* sosial media yang dimiliki oleh restoran ini */}
                <div className="pt-8 border-t border-gray-700 text-center">
                    <div className="flex flex-col items-center justify-center gap-5">
                        <ul className="flex items-center justify-center gap-6">
                            <li className="hover:text-white cursor-pointer"><FaInstagram size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><FaFacebook size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><FaTiktok size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><SiShopee size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><SiGooglemaps size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><SiGojek size={20} /></li>
                            <li className="hover:text-white cursor-pointer"><SiGrab size={35} /></li>
                        </ul>
                        <p className="text-sm font-semibold">Made with ♡</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;