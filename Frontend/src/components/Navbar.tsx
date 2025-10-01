import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 mt-10 py-5 px-8 shadow flex items-center justify-between text-white rounded-full w-[90vw] mx-auto"
      style={{ backgroundColor: '#1B2838' }}
    >
      <span className="font-bold text-xl tracking-wide rounded-full px-4 py-2 flex items-center justify-center" style={{ backgroundColor: '#1B2838' }}>
        <img
          src="/src/assets/Icons/Logo.png"
          alt="Logo"
          className="w-14 h-14 object-contain"
          style={{ maxHeight: '3.5rem', maxWidth: '3.5rem' }}
        />
      </span>
      <div className="flex-1 flex justify-center">
        <div className="relative w-[32rem]">
          <img
            src="/src/assets/Icons/Search.png"
            alt="Search"
            className="absolute left-5 top-3/4 -translate-y-1/2 w-8 h-8"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-16 pr-6 py-4 rounded-3xl text-white placeholder-white placeholder:text-xl placeholder:font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ backgroundColor: '#66C0F4' }}
          />
        </div>
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#66C0F4' }}
          >
             <img src="/src/assets/Icons/Bookmark.gif" alt="Bookmark" className="w-12 h-12" />
          </div>
        </li>
        <li>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: '#66C0F4' }}
            onClick={() => navigate("/login")}
          >
            <img src="/src/assets/Icons/Profile.gif" alt="Profile" className="w-14 h-14" />
          </div>
        </li>
      </ul>
    </nav>
  )
}
export default Navbar