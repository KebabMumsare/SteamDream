
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  colors: {
    background: string;
    primaryBtn: string;
    primaryBtnHover: string;
  };
}

function Navbar({ colors }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 mt-[3%] py-3 px-8 shadow flex items-center justify-between text-white rounded-full w-[90vw] mx-auto"
      style={{ backgroundColor: colors.background }}
    >
      <span
        className="font-bold text-xl tracking-wide rounded-full px-4 py-2 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: colors.background }}
        onClick={() => navigate("/")}
      >
        <img
          src="/src/assets/Icons/Logo.png"
          alt="Logo"
          className="object-contain"
          style={{ width: '7vw', height: '3vw', minWidth: '40px', minHeight: '24px' }}
        />
      </span>
      <div className="flex-1 flex justify-center">
        <div className="relative" style={{ width: "28vw" }}>
          <img
            src="/src/assets/Icons/Search.gif"
            alt="Search"
            className="absolute"
            style={{
              left: "1vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1.7vw",
              height: "1.7vw",
            }}
            onMouseOver={e => { e.currentTarget.src = `/src/assets/Icons/Search.gif?${Date.now()}`; }}
            
          />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "100%",
              paddingLeft: "3vw",
              paddingRight: "1vw",
              paddingTop: "1.1vw",
              paddingBottom: "0.9vw",
              fontSize: "0.9vw",
            }}
            
            
          />
        </div>
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <div
            className="rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-colors"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "3vw",
              height: "3vw",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
            onClick={() => navigate("/favorite")}
          >
            <img 
              src="/src/assets/Icons/Bookmark.gif" 
              alt="Bookmark" 
              style={{ width: "2vw", height: "2vw" }}
              onMouseOver={e => { e.currentTarget.src = `/src/assets/Icons/Bookmark.gif?${Date.now()}`; }}
              
            />
          </div>
        </li>
        <li>
          <div
            className="rounded-full flex items-center hover:scale-105 justify-center cursor-pointer transition-colors"
            style={{
              backgroundColor: colors.primaryBtn,
              width: "3vw",
              height: "3vw",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
            onClick={() => navigate("/Profile")}
          >
            <img 
              src="/src/assets/Icons/Profile.gif" 
              alt="Profile" 
              style={{ width: "2.2vw", height: "2.2vw" }}
              onMouseOver={e => { e.currentTarget.src = `/src/assets/Icons/Profile.gif?${Date.now()}`; }}
             
            />
          </div>
        </li>
      </ul>
    </nav>
  )
}
export default Navbar