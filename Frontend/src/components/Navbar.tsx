import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 mt-[3%] py-3 px-8 shadow flex items-center justify-between text-white rounded-full w-[90vw] mx-auto"
      style={{ backgroundColor: '#1B2838' }}
    >
      <span
        className="font-bold text-xl tracking-wide rounded-full px-4 py-2 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: '#1B2838' }}
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
        <div className="relative hover:scale-105" style={{ width: "28vw" }}>
          <img
            src="/src/assets/Icons/Search.png"
            alt="Search"
            className="absolute hover:scale-105"
            style={{
              left: "1vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1.7vw",
              height: "1.7vw",
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full text-white placeholder-white placeholder:font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              backgroundColor: "#66C0F4",
              width: "100%",
              paddingLeft: "3vw",
              paddingRight: "1vw",
              paddingTop: "1.1vw",
              paddingBottom: "0.9vw",
              fontSize: "0.9vw", // <-- Ändrar font size på input texten
            }}
          />
        </div>
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <div
            className="rounded-full flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-[#2979A8]"
            style={{
              backgroundColor: "#66C0F4",
              width: "3vw",
              height: "3vw",
            }}
            onClick={() => navigate("/favorite")}
          >
            <img src="/src/assets/Icons/Bookmark.gif" alt="Bookmark" style={{ width: "2vw", height: "2vw" }} />
          </div>
        </li>
        <li>
          <div
            className="rounded-full flex items-center hover:scale-105 hover:bg-[#2979A8] justify-center cursor-pointer"
            style={{
              backgroundColor: "#66C0F4",
              width: "3vw",
              height: "3vw",
            }}
            onClick={() => navigate("/Profile")}
          >
            <img src="/src/assets/Icons/Profile.gif" alt="Profile" style={{ width: "2.2vw", height: "2.2vw" }} />
          </div>
        </li>
      </ul>
    </nav>
  )
}
export default Navbar