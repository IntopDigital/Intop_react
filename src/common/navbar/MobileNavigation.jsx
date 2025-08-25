import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { HiMenu, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

const MobileNavigation = ({
  navLinks,
  navbarRef,
  activeDropdown,
  setIsBackdropVisible,
  closeAllMenus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubmenus, setOpenMobileSubmenus] = useState({});

  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const hamburgerIconRef = useRef(null);
  const crossIconRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleMobileSubmenu = (identifier) => {
    setOpenMobileSubmenus((prev) => ({
      ...prev,
      [identifier]: !prev[identifier],
    }));
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setOpenMobileSubmenus({});
    closeAllMenus();
  };

  // Main effect for mobile menu animation
  useEffect(() => {
    const menuElement = mobileMenuRef.current;
    const buttonElement = mobileMenuButtonRef.current;
    const navElement = navbarRef.current;

    if (menuElement && buttonElement && navElement) {
      gsap.killTweensOf(menuElement);
      const navRect = navElement.getBoundingClientRect();
      const buttonRect = buttonElement.getBoundingClientRect();
      const clipOriginX = buttonRect.left + buttonRect.width / 2;
      const clipOriginY =
        buttonRect.top + buttonRect.height / 2 - navRect.height;

      if (mobileMenuOpen) {
        gsap.set(menuElement, {
          display: "block",
          opacity: 0,
          clipPath: `circle(0% at ${clipOriginX}px ${clipOriginY}px)`,
        });
        gsap.to(menuElement, {
          opacity: 1,
          clipPath: `circle(150% at ${clipOriginX}px ${clipOriginY}px)`,
          duration: 0.5,
          ease: "power3.out",
          onStart: () => setIsBackdropVisible(true),
        });
      } else {
        if (gsap.getProperty(menuElement, "opacity") > 0) {
          gsap.to(menuElement, {
            opacity: 0,
            clipPath: `circle(0% at ${clipOriginX}px ${clipOriginY}px)`,
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => {
              gsap.set(menuElement, { display: "none", clipPath: "" });
              if (!activeDropdown) setIsBackdropVisible(false);
            },
          });
        } else {
          if (!activeDropdown) setIsBackdropVisible(false);
        }
      }
    }
  }, [mobileMenuOpen, activeDropdown, setIsBackdropVisible]);

  // Combined effect for hamburger/cross icon animation
  useEffect(() => {
    const hamIconElement = hamburgerIconRef.current;
    const crossIconElement = crossIconRef.current;

    if (hamIconElement && crossIconElement) {
      gsap.killTweensOf([hamIconElement, crossIconElement]);
      const duration = 0.3;
      const ease = "power2.inOut";

      if (mobileMenuOpen) {
        gsap.to(hamIconElement, {
          opacity: 0,
          rotate: "180deg",
          scale: 0.5,
          duration,
          ease,
        });
        gsap.fromTo(
          crossIconElement,
          { opacity: 0, rotate: "-180deg", scale: 0.5 },
          { opacity: 1, rotate: "0deg", scale: 1, duration, ease, delay: 0.05 }
        );
      } else {
        gsap.to(crossIconElement, {
          opacity: 0,
          rotate: "180deg",
          scale: 0.5,
          duration,
          ease,
        });
        gsap.fromTo(
          hamIconElement,
          { opacity: 0, rotate: "-180deg", scale: 0.5 },
          { opacity: 1, rotate: "0deg", scale: 1, duration, ease, delay: 0.05 }
        );
      }
    }
  }, [mobileMenuOpen]);

  // Effect to handle window resize for closing mobile menu on desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setOpenMobileSubmenus({});
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          ref={mobileMenuButtonRef}
          onClick={toggleMobileMenu}
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <div className="relative w-6 h-6">
            <span
              ref={hamburgerIconRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HiMenu className="block h-6 w-6" aria-hidden="true" />
            </span>
            <span
              ref={crossIconRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HiX className="block h-6 w-6" aria-hidden="true" />
            </span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 top-16 z-[999] bg-[#412a63]/10 backdrop-blur-md`}
        id="mobile-menu"
      >
        <div className="bg-[#412a63] px-2 pt-2 pb-3 space-y-1 sm:px-3 h-full">
          {navLinks.map((link) => (
            <div key={link.name} className="py-1">
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => toggleMobileSubmenu(link.dropdownIdentifier)}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700 flex justify-between items-center"
                    aria-expanded={
                      !!openMobileSubmenus[link.dropdownIdentifier]
                    }
                  >
                    {link.name}
                    <MdKeyboardArrowDown
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        openMobileSubmenus[link.dropdownIdentifier]
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {openMobileSubmenus[link.dropdownIdentifier] && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-700 ml-3">
                      {link.dropdown.map((section, sectionIndex) => (
                        <div
                          key={section.sectionTitle || sectionIndex}
                          className="py-1"
                        >
                          {section.sectionTitle && (
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">
                              {section.sectionTitle}
                            </h3>
                          )}
                          {section.links.map((subLink) => (
                            <Link
                              key={subLink.name}
                              to={subLink.href}
                              onClick={handleMobileMenuClose}
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700"
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.href}
                  onClick={handleMobileMenuClose}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
