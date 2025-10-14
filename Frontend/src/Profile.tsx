import { useState } from 'react';
import Game from './components/game';


interface ProfileProps {
    colors: {
        background: string;
        drawerBg: string;
        primaryBtn: string;
        primaryBtnHover: string;
        ownedGamesHeader: string;
        overlayBg: string;
        headerBg: string;
    };
    
    swapColors: () => void;
    swapFont: () => void;
}

function Profile({ colors, swapColors, swapFont }: ProfileProps) {
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
                <h2 className="text-white underline pb-[20px]" style={{ fontSize: '8vw' }}>Main Settings:</h2>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] mt-[15px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-xl pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors} >Color-scheme: <img src="/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[51px] h-[35px]" /></button>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-xl pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}>Font-family: <img src="/assets/Icons/Font.png" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
                <h2 className="text-white underline pb-[20px] pt-[50px]" style={{ fontSize: '8vw' }}>Login:</h2>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-xl flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
              </div>
            </aside>

            <main className="flex flex-row gap-[3rem] h-screen w-full pt-24 md:pt-28 lg:pt-32 min-[1400px]:pt-[10%] overflow-hidden">
                <section className=" w-1/3 p-4 rounded-tr-[60px] max-[500px]:hidden"
                style={{ backgroundColor: colors.background }}>
                    <h2 className="text-white underline pb-[20px]" style={{ fontSize: '1.9vw' }}>Main Settings:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw]  mt-[15px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-[0.8vw] pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors}>Color-scheme: <img src="/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[2vw] h-[1.3vw]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1  text-[0.8vw] pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}>Font-family: <img src="/assets/Icons/Font.png" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    <h2 className="text-white underline pb-[20px] pt-[50px]" style={{ fontSize: '1.9vw' }}>Login:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-[0.8vw] flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    
                </section>
                <section className="z-49 flex-1 p-0 overflow-y-auto">
                    <div className="sticky pb-[20px] top-0 z-[48]" style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)` }}>
                        <h1 className="text-white text-center font-bold underline py-3" style={{ fontSize: '1.9vw' }}>Owned games</h1>

                        <div className="hidden max-[500px]:flex justify-center pb-3">
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="text-white rounded-full z-49 px-3 py-1.5 shadow inline-flex items-center gap-2"
                                style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
                                aria-haspopup="dialog"
                                aria-expanded={settingsOpen}
                            >
                                <img src="/assets/Icons/Settings.png" alt="Settings" className="w-[20px] h-[20px]" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
              <div className='p-4 space-y-4 max-w-[90%] mx-auto pb-8'>
                       <Game />
                       <Game />
                       <Game />
                       <Game />
                       <Game />  
                       <Game />

                    </div>
                </section>

            </main>
        </>
    )
}

export default Profile;
