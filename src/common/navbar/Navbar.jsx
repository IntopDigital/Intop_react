import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

import IntopLogoAnimate from "../../ui/IntopLogoAnimate";

// -------------------- DATA --------------------
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Service",
    href: "#",
    dropdownIdentifier: "service",
    iconUrl: "/images/cartoon.png", // Make sure this path is correct
    dropdown: [
      {
        sectionTitle: "RESOURCES",
        links: [
          { name: "Website Development", href: "/services/web-development" },
          { name: "App Development", href: "/services/comming-soon" },
          { name: "Digital Marketing", href: "/services/comming-soon" },
          { name: "Business Automation", href: "/services/comming-soon" },
          { name: "Advertising & Promotions", href: "/services/comming-soon" },
          { name: "Content & Copywriting", href: "/services/comming-soon" },
          {
            name: "Branding & Creative Design",
            href: "/services/comming-soon",
          },
          { name: "Analytics & Reporting", href: "/services/comming-soon" },
        ],
      },
    ],
  },
  { name: "Contact", href: "/contact" },
];

// -------------------- MAIN NAVBAR COMPONENT --------------------
const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navbarRef = useRef(null);

  // Effect to handle scroll-based styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setIsBackdropVisible(false);
  };

  return (
    <>
      {/* The backdrop for both desktop dropdowns and mobile menu */}
      {isBackdropVisible && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
          onClick={closeAllMenus}
        />
      )}
      <nav
        ref={navbarRef}
        className={`fixed top-0 z-[60] w-full text-white transition-all duration-300 ease-in-out ${
          isScrolled ? "bg-transparent" : "bg-transparent"
        }`}
      >
        {/* Main container for side padding */}
        <div className="w-full mx-auto px-5 sm:px-10 md:px-20 pt-5">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <IntopLogoAnimate />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center">
              <DesktopNavigation
                navLinks={navLinks}
                navbarRef={navbarRef}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                setIsBackdropVisible={setIsBackdropVisible}
                dropdownPosition={dropdownPosition}
                setDropdownPosition={setDropdownPosition}
              />
              <MobileNavigation
                navLinks={navLinks}
                navbarRef={navbarRef}
                activeDropdown={activeDropdown}
                setIsBackdropVisible={setIsBackdropVisible}
                closeAllMenus={closeAllMenus}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
