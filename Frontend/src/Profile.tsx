import { useState } from 'react';

interface ProfileProps {
    colors: {
        background: string;
        drawerBg: string;
        primaryBtn: string;
        primaryBtnHover: string;
        ownedGamesHeader: string;
        overlayBg: string;
    };
    swapColors: () => void;
}

function Profile({ colors, swapColors }: ProfileProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
            {/* Overlay - only visible at ≤500px */}
            <div
              className={`fixed inset-0 z-[60] backdrop-blur-sm transition-opacity duration-200 max-[500px]:block hidden ${settingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              style={{ backgroundColor: colors.overlayBg }}
              onClick={() => setSettingsOpen(false)}
              aria-hidden={!settingsOpen}
            />

            {/* Settings drawer - only visible at ≤500px */}
            <aside
              className={`fixed top-0 left-0 z-[70] h-screen w-[80vw] max-w-[320px] shadow-2xl transform transition-transform duration-300 ease-out rounded-r-2xl max-[500px]:block hidden ${settingsOpen ? 'translate-x-0' : '-translate-x-full'}`}
              style={{ backgroundColor: colors.drawerBg }}
              role="dialog"
              aria-modal="true"
              aria-label="Settings"
            >
              <div className="pt-[20%] p-4 overflow-y-auto h-full">
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="absolute right-4 top-4 text-white/80 hover:bg-[#661C1D] bg-[#B73234] rounded-[56px] w-9 h-9 place-items-center text-xl text-center flex items-center justify-center"
                  aria-label="Close settings"
                >
                  ✕
                </button>
                <h2 className="text-white underline font-mono text-4xl pb-[20px]">Main Settings:</h2>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] mt-[15px] hover:scale-105 font-mono text-xl pl-[20px] flex items-center gap-2 rounded-full p-2 transition-colors" style={{ backgroundColor: colors.primaryBtn }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors} >Color-scheme: <img src="/src/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[51px] h-[35px]" /></button>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 font-mono text-xl pl-[20px] flex items-center gap-2 rounded-full p-2 transition-colors" style={{ backgroundColor: colors.primaryBtn }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}>Font-family: <img src="/src/assets/Icons/Font.png" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                <h2 className="text-white underline font-mono text-3xl pb-[20px] pt-[50px]">Login:</h2>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 hover:bg-[#661C1D] font-mono text-xl flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/src/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
              </div>
            </aside>

            <main className="flex flex-row gap-[3rem] min-h-screen w-full pt-24 md:pt-28 lg:pt-32 min-[1400px]:pt-[10%] overflow-hidden">
                <section className=" w-1/3 p-4 rounded-tr-[60px] max-[500px]:hidden"
                style={{ backgroundColor: colors.background }}>
                    <h2 className="text-white underline font-mono text-4xl pb-[20px]">Main Settings:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] mt-[15px] hover:scale-105 font-mono text-xl pl-[20px] flex items-center gap-2 rounded-full p-2 transition-colors" style={{ backgroundColor: colors.primaryBtn }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors}>Color-scheme: <img src="/src/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[51px] h-[35px]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 font-mono text-xl pl-[20px] flex items-center gap-2 rounded-full p-2 transition-colors" style={{ backgroundColor: colors.primaryBtn }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}>Font-family: <img src="/src/assets/Icons/Font.png" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                    <h2 className="text-white underline font-mono text-3xl pb-[20px] pt-[50px]">Login:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] hover:scale-105 hover:bg-[#661C1D] font-mono text-xl flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/src/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                    
                </section>
                <section className="z-50 flex-1 p-0 h-[calc(100vh-15%)] overflow-y-auto">
                    <div className="sticky top-0 z-[48]" style={{ backgroundColor: colors.ownedGamesHeader }}>
                        <h1 className="text-white font-mono text-center py-3 font-bold underline">Owned games</h1>
                        <div className="hidden max-[500px]:flex justify-center pb-3">
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="text-white font-mono rounded-full px-3 py-1.5 shadow transition-colors inline-flex items-center gap-2"
                                style={{ backgroundColor: colors.primaryBtn }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
                                aria-haspopup="dialog"
                                aria-expanded={settingsOpen}
                            >
                                <img src="/src/assets/Icons/Settings.png" alt="Settings" className="w-[20px] h-[20px]" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                    <div className='p-4 space-y-4'>
                       
                    </div>
                </section>
            </main>
        </>
    )
}

export default Profile;