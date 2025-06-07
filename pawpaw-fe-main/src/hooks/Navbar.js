// Navbar.js
import { useState } from "react";

const useNavbarToggle = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);    

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };


    const toggleContact = () => {
        setIsContactOpen((prev) => !prev);
    };


    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    return { isMenuOpen, toggleMenu, isContactOpen, toggleContact, isCartOpen, toggleCart };
};

export default useNavbarToggle;
