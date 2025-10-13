import React from "react";
import { useNavigate } from "react-router-dom";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  colors: {
    background: string;
    primaryBtn: string;
    primaryBtnHover: string;
  };
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, colors }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div
      className="fixed top-0 right-0 h-full w-4/5 max-w-xs flex flex-col items-start pt-6 px-4 transition-transform duration-300 shadow-2xl"
      style={{
        backgroundColor: '#232c36',
        borderTopLeftRadius: '2rem',
        borderBottomLeftRadius: '2rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        zIndex: 50,
      }}
    >
      <button
        className="mb-2 text-4xl font-bold text-white self-end pr-2 rounded-xl shadow-md"
        onClick={onClose}
        aria-label="Close menu"
        style={{ lineHeight: 1, backgroundColor: colors.primaryBtn, padding: '0.2em 0.7em' }}
      >
        ×
      </button>
      <div className="w-full flex flex-col items-center mt-2">
        <div className="text-white text-3xl font-extrabold mb-6 underline" style={{ letterSpacing: 1 }}>Menu</div>
        <button
          className="w-full flex items-center gap-4 text-white font-extrabold text-2xl rounded-xl py-3 px-6 mb-6 shadow-md"
          style={{ backgroundColor: colors.primaryBtn }}
          onClick={() => { navigate('/'); onClose(); }}
        >
          <img src="/src/assets/Icons/Home.png" alt="Home" style={{ width: 38, height: 38 }} />
          <span className="text-white underline">Home</span>
        </button>
        <button
          className="w-full flex items-center gap-4 text-white font-extrabold text-2xl rounded-xl py-3 px-6 mb-6 shadow-md"
          style={{ backgroundColor: colors.primaryBtn }}
          onClick={() => { navigate('/favorite'); onClose(); }}
        >
          <img src="/src/assets/Icons/Bookmark.gif" alt="Favorites" style={{ width: 38, height: 38 }} />
          <span className="text-white underline">Favorites</span>
        </button>
        <button
          className="w-full flex items-center gap-4 text-white font-extrabold text-2xl rounded-xl py-3 px-6 shadow-md"
          style={{ backgroundColor: colors.primaryBtn }}
          onClick={() => { navigate('/Profile'); onClose(); }}
        >
          <img src="/src/assets/Icons/Profile.gif" alt="Profile" style={{ width: 38, height: 38 }} />
          <span className="text-white underline">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
