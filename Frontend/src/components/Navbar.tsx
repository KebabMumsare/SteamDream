// Custom style for mobile placeholder top padding and font size
const mobilePlaceholderStyle = `
  @media (max-width: 450px) {
    .searchbar-mobile-placeholder::placeholder {
      padding-top: 0.7rem;
    }
    .searchbar-mobile-placeholder {
      font-size: 4.3vw !important;
    }
  }
  @media (min-width: 451px) {
    .searchbar-mobile-placeholder::placeholder {
      padding-top: 0;
      line-height: normal;
    }
  }
`;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import { checkAuth } from "../service/steamApi";

interface NavbarProps {
  colors: {
    background: string;
    primaryBtn: string;
    primaryBtnHover: string;
  };
}

function Navbar({ colors }: NavbarProps) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleProfileClick = async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <style>{mobilePlaceholderStyle}</style>
      <nav
        className="fixed top-0 left-0 right-0 z-50 mt-[3%] py-3 px-8 shadow flex items-center justify-between text-white rounded-full w-[90vw] mx-auto"
        style={{ backgroundColor: colors.background }}
      >
      {/* Desktop: show logo, search, bookmark, profile */}
      <span
        className="font-bold text-xl tracking-wide rounded-full px-4 py-2 flex items-center justify-center cursor-pointer max-[450px]:hidden"
        style={{ backgroundColor: colors.background }}
        onClick={() => navigate("/")}
      >
        <img
          src="/assets/Icons/Logo.png"
          alt="Logo"
          className="object-contain"
          style={{ width: '7vw', height: '3vw', minWidth: '40px', minHeight: '24px' }}
        />
      </span>
      <div className="flex-1 flex justify-center">
        <div
          className="relative w-[36vw] max-[450px]:w-[60vw]"
        >
          <img
            src="/assets/Icons/Search.gif"
            alt="Search"
            className="absolute max-[450px]:hidden"
            style={{
              left: "1vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: "2vw",
              height: "2vw",
            }}
            onMouseOver={e => { e.currentTarget.src = `/assets/Icons/Search.gif?${Date.now()}`; }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="searchbar-mobile-placeholder rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-[1.3vw] max-[450px]:text-[5vw] placeholder:text-[1.3vw] max-[450px]:placeholder:text-[5vw]"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "100%",
              paddingLeft: "3.5vw",
              paddingRight: "1vw",
              paddingTop: "1.5vw",
              paddingBottom: "1.2vw",
              fontSize: "1.3vw",
              minHeight: '48px',
             
            }}
          />
        </div>
      </div>
      {/* Desktop: show bookmark/profile, mobile: show hamburger */}
      <ul className="flex gap-8 items-center max-[450px]:hidden">
        <li>
          <div
            className="rounded-full flex items-center justify-center cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "3vw",
              height: "3vw",
              transition: 'all 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
            onClick={() => navigate("/favorite")}
          >
            <img 
              src="/assets/Icons/Bookmark.gif" 
              alt="Bookmark" 
              style={{ width: "2vw", height: "2vw"}}
              onMouseOver={e => { e.currentTarget.src = `/assets/Icons/Bookmark.gif?${Date.now()}`; }}
            />
          </div>
        </li>
        <li>
          <div
            className="rounded-full flex items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 justify-center cursor-pointer"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "3vw",
              height: "3vw",
              transition: 'all 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
            onClick={handleProfileClick}
          >
            <img 
              src="/assets/Icons/Profile.gif" 
              alt="Profile" 
              style={{ width: "2.2vw", height: "2.2vw" }}
              onMouseOver={e => { e.currentTarget.src = `/assets/Icons/Profile.gif?${Date.now()}`; }}
            />
          </div>
        </li>
      </ul>
      {/* Mobile: hide logo, show hamburger menu to right */}
      <button
        className="min-[451px]:hidden flex items-center justify-center ml-2 bg-transparent"
        style={{ background: 'none', boxShadow: 'none' }}
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} colors={colors} />
      </nav>
    </>
  );
}
export default Navbar
