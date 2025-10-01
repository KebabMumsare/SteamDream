

function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 mx-10 mt-10 py-6 px-8 shadow flex items-center justify-between text-white rounded-full"
      style={{ backgroundColor: '#1B2838' }}
    >
      <span className="font-bold text-xl tracking-wide rounded-full px-4 py-2" style={{ backgroundColor: '#1B2838' }}>
        SteamDream
      </span>
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[32rem] px-16 py-4 rounded-3xl text-white placeholder-white placeholder:text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ backgroundColor: '#66C0F4' }}
        />
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#66C0F4' }}
          >
             <img src="/src/components/Icons/Bookmark.gif" alt="Bookmark" className="w-12 h-12" />
          </div>
        </li>
        <li>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#66C0F4' }}
          >
            <img src="/src/components/Icons/Profile.gif" alt="Profile" className="w-14 h-14" />
          </div>
        </li>
      </ul>
    </nav>
  )
}
export default Navbar