import { useState, useEffect } from 'react';
import Game from './components/game';
import { getOwnedGames, getSteamLoginUrl, logout } from './service/steamApi';


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
interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
  rtime_last_played?: number;
  has_community_visible_stats?: boolean;
}

function Profile({ colors, swapColors, swapFont }: ProfileProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [games, setGames] = useState<OwnedGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGames() {
            try {
                console.log('🎮 Profile page loaded - Fetching games...');
                setLoading(true);
                
                const data = await getOwnedGames();
                console.log('✅ Games data received:', data);
                console.log('✅ Number of games:', data.games?.length || 0);
                
                setGames(data.games || []);
                setError(null); // Clear any previous errors
            } catch (err: any) {
                console.error('❌ Failed to fetch owned games:', err);
                
                // If 401 Unauthorized, user needs to login
                if (err.message?.includes('401')) {
                    console.log('❌ Not authenticated - need to login');
                    setError('Please login with Steam to view your games.');
                    setLoading(false);
                    return;
                }
                
                setError('Failed to load your games. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, []);



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
                <button onClick={logout} className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[230px] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-xl flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[35px] h-[35px]" /></button>
              </div>
            </aside>

            <main className="flex flex-row gap-[3rem] h-screen w-full pt-24 md:pt-28 lg:pt-32 min-[1400px]:pt-[10%] overflow-hidden">
                <section className=" w-1/3 p-4 rounded-tr-[60px] max-[500px]:hidden"
                style={{ backgroundColor: colors.background }}>
                    <h2 className="text-white underline pb-[20px]" style={{ fontSize: '1.9vw' }}>Main Settings:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw]  mt-[15px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-[0.8vw] pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors}>Color-scheme: <img src="/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[2vw] h-[1.3vw]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1  text-[0.8vw] pl-[20px] flex items-center gap-2 rounded-full p-2" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}>Font-family: <img src="/assets/Icons/Font.png" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    <h2 className="text-white underline pb-[20px] pt-[50px]" style={{ fontSize: '1.9vw' }}>Login:</h2>
                    <button onClick={logout} className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] mt-[20px] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-[0.8vw] flex items-center justify-center gap-2 bg-[#B73234] rounded-full p-2">Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    
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
                    {/* Loading state */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#66C0F4] border-t-transparent"></div>
                                <p className="text-white/70 mt-4">Loading your games...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="text-center py-12">
                                <p className="text-red-400 mb-4">{error}</p>
                                <a 
                                    href={getSteamLoginUrl()}
                                    className="inline-block bg-[#66C0F4] hover:bg-[#2979A8] text-white font-bold py-3 px-6 rounded-lg transition"
                                >
                                    Login with Steam
                                </a>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && games.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-white/70">No games found in your library.</p>
                            </div>
                        )}

                        {/* Games list - Loop through each game and pass as props */}
                        {!loading && !error && games.length > 0 && (
                            <>
                             <p className="text-white/70 text-center mb-4">
                                    You own {games.length} game{games.length !== 1 ? 's' : ''}
                                </p>
                                {games.map((game) => (
                            <Game
                                        key={game.appid}
                                        appid={game.appid}
                                        name={game.name}
                                        playtime_forever={game.playtime_forever}
                                        img_icon_url={game.img_icon_url}
                                        img_logo_url={game.img_logo_url}
                                        rtime_last_played={game.rtime_last_played}
                                        has_community_visible_stats={game.has_community_visible_stats}
                                        colors={{
                                            cardBg: colors.background,
                                            titleBg: colors.primaryBtn,
                                            descriptionBg: colors.primaryBtn,
                                            textColor: 'white'
                                        }}
                                    />
                                ))}
                            </>
                         )}
                    </div>
                </section>

            </main>
        </>
    )
}

export default Profile;
