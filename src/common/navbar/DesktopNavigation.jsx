// import React, { useRef, useEffect } from "react"; // Removed unnecessary imports, added useEffect
// import gsap from "gsap";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { Link } from "react-router-dom";

// // -------------------- HELPER COMPONENT FOR THE NEW GSAP ANIMATION --------------------
// const AnimatedNavLink = ({ link }) => {
//   const linkRef = useRef(null);
//   const timelineRef = useRef(null);

//   useEffect(() => {
//     // Set the initial state of the hover text. It's positioned below, ready to enter.
//     gsap.set(linkRef.current.querySelectorAll(".hover-char"), { y: "100%" });
//   }, []);

//   const handleMouseEnter = () => {
//     if (timelineRef.current) {
//       timelineRef.current.kill();
//     }

//     timelineRef.current = gsap.timeline();

//     timelineRef.current
//       // 1. Original word animates UP and OUT.
//       .to(linkRef.current.querySelectorAll(".original-char"), {
//         y: "-100%",
//         duration: 0.1, // Faster duration
//         ease: "power3.in",
//         stagger: {
//           amount: 0.05,
//         },
//       })
//       // 2. Italic word animates IN from the BOTTOM.
//       // This starts immediately after the previous animation completes (no overlap).
//       .fromTo(
//         linkRef.current.querySelectorAll(".hover-char"),
//         { y: "100%" }, // 'from' state
//         {
//           y: "0%",
//           duration: 0.1, // Faster duration
//           ease: "power3.out",
//           stagger: {
//             amount: 0.05,
//           },
//         }
//       );
//   };

//   const handleMouseLeave = () => {
//     if (timelineRef.current) {
//       timelineRef.current.kill();
//     }

//     timelineRef.current = gsap.timeline();

//     timelineRef.current
//       // 1. Italic word animates DOWN and OUT.
//       .to(linkRef.current.querySelectorAll(".hover-char"), {
//         y: "100%", // Animate downwards
//         duration: 0.25,
//         ease: "power3.in",
//         stagger: {
//           amount: 0.05,
//           from: "end",
//         },
//       })
//       // 2. Original word animates IN from the TOP.
//       .fromTo(
//         linkRef.current.querySelectorAll(".original-char"),
//         { y: "-100%" }, // 'from' state (starts from above)
//         {
//           y: "0%",
//           duration: 0.25,
//           ease: "power3.out",
//           stagger: {
//             amount: 0.05,
//             from: "end",
//           },
//         }
//       );
//   };

//   return (
//     <Link
//       ref={linkRef}
//       to={link.href}
//       className="relative  text-base lg:text-xl 3xl:text-2xl 4k:text-4xl font-semibold text-white flex items-center overflow-hidden"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Container for the original text */}
//       <span className="flex">
//         {link.name.split("").map((char, index) => (
//           <span className="original-char inline-block" key={index}>
//             {char === " " ? "\u00A0" : char}
//           </span>
//         ))}
//       </span>

//       {/* Container for the hover text */}
//       <span className="absolute left-0 right-0 px-4 flex justify-center italic font-light">
//         {link.name.split("").map((char, index) => (
//           <span className="hover-char inline-block" key={index}>
//             {char === " " ? "\u00A0" : char}
//           </span>
//         ))}
//       </span>

//       {/* Dropdown arrow */}
//       {link.dropdown && <MdKeyboardArrowDown className="w-5 h-5 ml-1" />}
//     </Link>
//   );
// };

// // -------------------- DROPDOWN COMPONENT (Unchanged) --------------------
// const DropdownMenu = React.forwardRef(
//   (
//     {
//       items,
//       identifier,
//       iconUrl,
//       isVisible,
//       position,
//       onMouseEnterArea,
//       onMouseLeaveArea,
//     },
//     ref
//   ) => {
//     const dropdownContentRef = useRef(null);
//     const iconRef = useRef(null);

//     // This useEffect ensures the forwarded ref points to the actual dropdown container
//     useEffect(() => {
//       if (dropdownContentRef.current) {
//         if (typeof ref === "function") {
//           ref(dropdownContentRef.current.parentElement);
//         } else if (ref) {
//           ref.current = dropdownContentRef.current.parentElement;
//         }
//       }
//     }, [ref]);

//     // This useEffect handles the smooth animation for the dropdown menu
//     useEffect(() => {
//       const contentElement = dropdownContentRef.current;
//       const illustrativeIcon = iconRef.current;

//       if (contentElement) {
//         gsap.killTweensOf(contentElement);
//         if (isVisible) {
//           gsap.set(contentElement, { display: "block", opacity: 0, y: -15 });
//           gsap.to(contentElement, {
//             opacity: 1,
//             y: 0,
//             duration: 0.5,
//             ease: "power2.out",
//           });
//         } else {
//           gsap.to(contentElement, {
//             opacity: 0,
//             y: -15,
//             duration: 0.5,
//             ease: "power2.in",
//             onComplete: () => {
//               if (
//                 !isVisible &&
//                 gsap.getProperty(contentElement, "opacity") < 0.1
//               ) {
//                 gsap.set(contentElement, { display: "none" });
//               }
//             },
//           });
//         }
//       }

//       if (illustrativeIcon) {
//         gsap.killTweensOf(illustrativeIcon);
//         if (isVisible && typeof iconUrl === "string" && iconUrl) {
//           gsap.set(illustrativeIcon, { display: "block", opacity: 0, y: 20 });
//           gsap.to(illustrativeIcon, {
//             opacity: 1,
//             y: 0,
//             duration: 0.35,
//             delay: 0.1,
//             ease: "power2.out",
//           });
//         } else {
//           gsap.to(illustrativeIcon, {
//             opacity: 0,
//             y: 20,
//             duration: 0.3,
//             ease: "power2.in",
//             onComplete: () => {
//               if (
//                 !isVisible &&
//                 gsap.getProperty(illustrativeIcon, "opacity") < 0.1
//               ) {
//                 gsap.set(illustrativeIcon, { display: "none" });
//               }
//             },
//           });
//         }
//       }
//     }, [isVisible, iconUrl]);

//     if (!items || items.length === 0) return null;

//     const isMultiColumn =
//       items.some((item) => item.sectionTitle) && identifier === "service";

//     let contentHtml;
//     if (isMultiColumn) {
//       contentHtml = (
//         <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-5">
//           {items.map((section, index) => (
//             <div key={section.sectionTitle || index} className="space-y-2">
//               {section.sectionTitle && (
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
//                   {section.sectionTitle}
//                 </h3>
//               )}
//               <ul className="space-y-1">
//                 {section.links.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       to={link.href}
//                       className="block text-sm text-gray-200 hover:text-white p-1 rounded-md transition-colors duration-150"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       );
//     } else {
//       const singleSection = items[0];
//       contentHtml = (
//         <div className="p-4">
//           <ul className="space-y-1">
//             {singleSection?.links?.map((link) => (
//               <li key={link.name}>
//                 <Link
//                   to={link.href}
//                   className="block text-sm text-gray-200 hover:text-white p-2 rounded-md transition-colors duration-150"
//                 >
//                   {link.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       );
//     }

//     const defaultIconStyles = {
//       width: "100px",
//       bottom: "-20px",
//       right: "-30px",
//     };

//     return (
//       <div
//         ref={ref}
//         style={{
//           left: position?.left !== undefined ? `${position.left}px` : "auto",
//           top: position?.top !== undefined ? `${position.top}px` : "auto",
//           transform: position?.transform || "none",
//         }}
//         className="absolute z-[110] mt-3"
//         onMouseEnter={onMouseEnterArea}
//         onMouseLeave={onMouseLeaveArea}
//       >
//         <div
//           ref={dropdownContentRef}
//           className={`w-auto min-w-[200px] bg-[#1d0e2b] rounded-lg shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none relative backdrop-blur-md ${
//             identifier === "service" ? "max-w-2xl" : "max-w-xs"
//           } `}
//           style={{
//             display: "none",
//             opacity: 0,
//           }}
//         >
//           {contentHtml}
//         </div>
//         {iconUrl && typeof iconUrl === "string" && (
//           <img
//             ref={iconRef}
//             src={iconUrl}
//             alt=""
//             className="absolute pointer-events-none"
//             style={{
//               ...defaultIconStyles,
//               display: "none",
//             }}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src =
//                 "https://placehold.co/100x100/1d0e2b/ffffff?text=Icon";
//             }}
//           />
//         )}
//       </div>
//     );
//   }
// );
// DropdownMenu.displayName = "DropdownMenu";

// // -------------------- DESKTOP NAVIGATION COMPONENT (Main component, unchanged logic) --------------------
// const DesktopNavigation = ({
//   navLinks,
//   navbarRef,
//   activeDropdown,
//   setActiveDropdown,
//   setIsBackdropVisible,
//   dropdownPosition,
//   setDropdownPosition,
// }) => {
//   const navItemRefs = useRef({});
//   const leaveTimeoutRef = useRef(null);

//   const handleMouseEnterNavItem = (identifier, navItemElement) => {
//     if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
//     if (navItemElement && navbarRef.current) {
//       const navItemRect = navItemElement.getBoundingClientRect();
//       const navbarRect = navbarRef.current.getBoundingClientRect();
//       const dropdownTop = navItemRect.bottom - navbarRect.top;
//       const dropdownLeft =
//         navItemRect.left - navbarRect.left + navItemRect.width / 2;
//       setDropdownPosition({
//         top: dropdownTop,
//         left: dropdownLeft,
//         transform: "translateX(-50%)",
//       });
//       setActiveDropdown(identifier);
//       setIsBackdropVisible(true);
//     }
//   };

//   const handleMouseLeaveWithDelay = () => {
//     leaveTimeoutRef.current = setTimeout(() => {
//       setActiveDropdown(null);
//       setIsBackdropVisible(false);
//     }, 200);
//   };

//   const handleMouseEnterDropdownArea = () => {
//     if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
//     setIsBackdropVisible(true);
//   };

//   const currentDropdownLinkData = navLinks.find(
//     (link) => link.dropdownIdentifier === activeDropdown
//   );
//   const currentDropdownContent = currentDropdownLinkData?.dropdown;
//   const currentIconUrl = currentDropdownLinkData?.iconUrl;

//   return (
//     <>
//       <div className="hidden md:flex items-center gap-8">
//         {navLinks.map((link) => (
//           <div
//             key={link.name}
//             className="relative"
//             ref={(el) =>
//               (navItemRefs.current[link.dropdownIdentifier || link.name] = el)
//             }
//             onMouseEnter={() =>
//               link.dropdown &&
//               handleMouseEnterNavItem(
//                 link.dropdownIdentifier,
//                 navItemRefs.current[link.dropdownIdentifier || link.name]
//               )
//             }
//             onMouseLeave={handleMouseLeaveWithDelay}
//           >
//             {/* Using the updated AnimatedNavLink component */}
//             <AnimatedNavLink link={link} />
//           </div>
//         ))}
//       </div>

//       <DropdownMenu
//         items={currentDropdownContent}
//         identifier={activeDropdown}
//         iconUrl={currentIconUrl}
//         isVisible={!!activeDropdown && !!currentDropdownContent}
//         position={dropdownPosition}
//         onMouseEnterArea={handleMouseEnterDropdownArea}
//         onMouseLeaveArea={handleMouseLeaveWithDelay}
//       />
//     </>
//   );
// };

// export default DesktopNavigation;

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

// -------------------- HELPER COMPONENT FOR THE NEW GSAP ANIMATION --------------------
// This component now conditionally renders a <Link> or a <button>
const AnimatedNavLink = ({ link, onMouseEnter, onMouseLeave }) => {
  const linkRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    gsap.set(linkRef.current.querySelectorAll(".hover-char"), { y: "100%" });
  }, []);

  const handleMouseEnter = () => {
    if (timelineRef.current) timelineRef.current.kill();
    timelineRef.current = gsap.timeline();
    timelineRef.current
      .to(linkRef.current.querySelectorAll(".original-char"), {
        y: "-100%",
        duration: 0.1,
        ease: "power3.in",
        stagger: { amount: 0.05 },
      })
      .fromTo(
        linkRef.current.querySelectorAll(".hover-char"),
        { y: "100%" },
        {
          y: "0%",
          duration: 0.1,
          ease: "power3.out",
          stagger: { amount: 0.05 },
        }
      );
  };

  const handleMouseLeave = () => {
    if (timelineRef.current) timelineRef.current.kill();
    timelineRef.current = gsap.timeline();
    timelineRef.current
      .to(linkRef.current.querySelectorAll(".hover-char"), {
        y: "100%",
        duration: 0.25,
        ease: "power3.in",
        stagger: { amount: 0.05, from: "end" },
      })
      .fromTo(
        linkRef.current.querySelectorAll(".original-char"),
        { y: "-100%" },
        {
          y: "0%",
          duration: 0.25,
          ease: "power3.out",
          stagger: { amount: 0.05, from: "end" },
        }
      );
  };

  // Common props for both Link and button
  const commonProps = {
    ref: linkRef,
    className:
      "relative text-base lg:text-xl 3xl:text-2xl 4k:text-4xl font-semibold text-white flex items-center overflow-hidden cursor-pointer",
    onMouseEnter: () => {
      handleMouseEnter();
      if (onMouseEnter) onMouseEnter(); // Forward the event
    },
    onMouseLeave: () => {
      handleMouseLeave();
      if (onMouseLeave) onMouseLeave(); // Forward the event
    },
  };

  // The content is the same for both elements
  const content = (
    <>
      <span className="flex">
        {link.name.split("").map((char, index) => (
          <span className="original-char inline-block" key={index}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="absolute left-0 right-0 px-4 flex justify-center italic font-light">
        {link.name.split("").map((char, index) => (
          <span className="hover-char inline-block" key={index}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      {link.dropdown && <MdKeyboardArrowDown className="w-5 h-5 ml-1" />}
    </>
  );

  // ** THE FIX IS HERE **
  // If href is '#', render a button. Otherwise, render a Link.
  if (link.href === "#") {
    return (
      <button type="button" {...commonProps}>
        {content}
      </button>
    );
  }

  return (
    <Link to={link.href} {...commonProps}>
      {content}
    </Link>
  );
};

// -------------------- DROPDOWN COMPONENT (Unchanged) --------------------
const DropdownMenu = React.forwardRef(
  (
    {
      items,
      identifier,
      iconUrl,
      isVisible,
      position,
      onMouseEnterArea,
      onMouseLeaveArea,
    },
    ref
  ) => {
    const dropdownContentRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
      if (dropdownContentRef.current) {
        if (typeof ref === "function") {
          ref(dropdownContentRef.current.parentElement);
        } else if (ref) {
          ref.current = dropdownContentRef.current.parentElement;
        }
      }
    }, [ref]);

    useEffect(() => {
      const contentElement = dropdownContentRef.current;
      const illustrativeIcon = iconRef.current;

      if (contentElement) {
        gsap.killTweensOf(contentElement);
        if (isVisible) {
          gsap.set(contentElement, { display: "block", opacity: 0, y: -15 });
          gsap.to(contentElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        } else {
          gsap.to(contentElement, {
            opacity: 0,
            y: -15,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              if (
                !isVisible &&
                gsap.getProperty(contentElement, "opacity") < 0.1
              ) {
                gsap.set(contentElement, { display: "none" });
              }
            },
          });
        }
      }

      if (illustrativeIcon) {
        gsap.killTweensOf(illustrativeIcon);
        if (isVisible && typeof iconUrl === "string" && iconUrl) {
          gsap.set(illustrativeIcon, { display: "block", opacity: 0, y: 20 });
          gsap.to(illustrativeIcon, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            delay: 0.1,
            ease: "power2.out",
          });
        } else {
          gsap.to(illustrativeIcon, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              if (
                !isVisible &&
                gsap.getProperty(illustrativeIcon, "opacity") < 0.1
              ) {
                gsap.set(illustrativeIcon, { display: "none" });
              }
            },
          });
        }
      }
    }, [isVisible, iconUrl]);

    if (!items || items.length === 0) return null;

    const isMultiColumn =
      items.some((item) => item.sectionTitle) && identifier === "service";

    let contentHtml;
    if (isMultiColumn) {
      contentHtml = (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-5">
          {items.map((section, index) => (
            <div key={section.sectionTitle || index} className="space-y-2">
              {section.sectionTitle && (
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {section.sectionTitle}
                </h3>
              )}
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="block text-sm text-gray-200 hover:text-white p-1 rounded-md transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } else {
      const singleSection = items[0];
      contentHtml = (
        <div className="p-4">
          <ul className="space-y-1">
            {singleSection?.links?.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="block text-sm text-gray-200 hover:text-white p-2 rounded-md transition-colors duration-150"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const defaultIconStyles = {
      width: "100px",
      bottom: "-20px",
      right: "-30px",
    };

    return (
      <div
        ref={ref}
        style={{
          left: position?.left !== undefined ? `${position.left}px` : "auto",
          top: position?.top !== undefined ? `${position.top}px` : "auto",
          transform: position?.transform || "none",
        }}
        className="absolute z-[110] mt-3"
        onMouseEnter={onMouseEnterArea}
        onMouseLeave={onMouseLeaveArea}
      >
        <div
          ref={dropdownContentRef}
          className={`w-auto min-w-[200px] bg-[#1d0e2b] rounded-lg shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none relative backdrop-blur-md ${
            identifier === "service" ? "max-w-2xl" : "max-w-xs"
          } `}
          style={{
            display: "none",
            opacity: 0,
          }}
        >
          {contentHtml}
        </div>
        {iconUrl && typeof iconUrl === "string" && (
          <img
            ref={iconRef}
            src={iconUrl}
            alt=""
            className="absolute pointer-events-none"
            style={{
              ...defaultIconStyles,
              display: "none",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/100x100/1d0e2b/ffffff?text=Icon";
            }}
          />
        )}
      </div>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

// -------------------- DESKTOP NAVIGATION COMPONENT --------------------
const DesktopNavigation = ({
  navLinks,
  navbarRef,
  activeDropdown,
  setActiveDropdown,
  setIsBackdropVisible,
  dropdownPosition,
  setDropdownPosition,
}) => {
  const navItemRefs = useRef({});
  const leaveTimeoutRef = useRef(null);

  const handleMouseEnterNavItem = (identifier, navItemElement) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    if (navItemElement && navbarRef.current) {
      const navItemRect = navItemElement.getBoundingClientRect();
      const navbarRect = navbarRef.current.getBoundingClientRect();
      const dropdownTop = navItemRect.bottom - navbarRect.top;
      const dropdownLeft =
        navItemRect.left - navbarRect.left + navItemRect.width / 2;
      setDropdownPosition({
        top: dropdownTop,
        left: dropdownLeft,
        transform: "translateX(-50%)",
      });
      setActiveDropdown(identifier);
      setIsBackdropVisible(true);
    }
  };

  const handleMouseLeaveWithDelay = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setIsBackdropVisible(false);
    }, 200);
  };

  const handleMouseEnterDropdownArea = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsBackdropVisible(true);
  };

  const currentDropdownLinkData = navLinks.find(
    (link) => link.dropdownIdentifier === activeDropdown
  );
  const currentDropdownContent = currentDropdownLinkData?.dropdown;
  const currentIconUrl = currentDropdownLinkData?.iconUrl;

  return (
    <>
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <div
            key={link.name}
            className="relative"
            ref={(el) =>
              (navItemRefs.current[link.dropdownIdentifier || link.name] = el)
            }
          >
            <AnimatedNavLink
              link={link}
              onMouseEnter={() =>
                link.dropdown &&
                handleMouseEnterNavItem(
                  link.dropdownIdentifier,
                  navItemRefs.current[link.dropdownIdentifier || link.name]
                )
              }
              onMouseLeave={handleMouseLeaveWithDelay}
            />
          </div>
        ))}
      </div>

      <DropdownMenu
        items={currentDropdownContent}
        identifier={activeDropdown}
        iconUrl={currentIconUrl}
        isVisible={!!activeDropdown && !!currentDropdownContent}
        position={dropdownPosition}
        onMouseEnterArea={handleMouseEnterDropdownArea}
        onMouseLeaveArea={handleMouseLeaveWithDelay}
      />
    </>
  );
};

export default DesktopNavigation;