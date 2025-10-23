import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Game from './components/game';
import { getOwnedGames, getSteamLoginUrl, logout } from './service/steamApi';
import Musica from './assets/Musica.png';


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
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [games, setGames] = useState<OwnedGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGames() {
            try {
                setLoading(true);
                const data = await getOwnedGames();
                setGames(data.games || []);
                setError(null); // Clear any previous errors
            } catch (err: any) {
                console.error('Failed to fetch owned games:', err);
                
                // If 401 Unauthorized, user needs to login - redirect to login page
                if (err.message?.includes('401')) {
                    console.log('User not authenticated, redirecting to login...');
                    navigate('/login');
                    return;
                }
                
                setError('Failed to load your games. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, [navigate]);



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
              className={`fixed top-0 left-0 z-[70] h-screen w-[80vw] shadow-2xl transform transition-transform duration-300 ease-out rounded-r-2xl max-[500px]:block hidden ${settingsOpen ? 'translate-x-0' : '-translate-x-full'}`}
              style={{ backgroundColor: colors.drawerBg, maxWidth: '20vw' }}
              role="dialog"
              aria-modal="true"
              aria-label="Settings"
            >
              <div className="overflow-y-auto h-full" style={{ paddingTop: '20%', padding: '1vw' }}>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="absolute text-white/80 hover:bg-[#661C1D] bg-[#B73234] place-items-center text-xl text-center flex items-center justify-center"
                  style={{ right: '1vw', top: '1vw', borderRadius: '3.5vw', width: '2.5vw', height: '2.5vw' }}
                  aria-label="Close settings"
                >
                  ✕
                </button>
                <h2 className="text-white underline" style={{ fontSize: '8vw', paddingBottom: '1.5vw' }}>Main Settings:</h2>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-xl flex items-center rounded-full" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', marginTop: '1vw', paddingLeft: '1.5vw', gap: '0.5vw', padding: '0.5vw' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors} >Color-scheme: <img src="/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[4vw] h-[2.5vw]" /></button>
                <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-xl flex items-center rounded-full" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', width: '16vw', marginTop: '1.5vw', paddingLeft: '1.5vw', gap: '0.5vw', padding: '0.5vw' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}>Font-family: <img src="/assets/Icons/Font.png" alt="Color Scheme" className="w-[2.5vw] h-[2.5vw]" /></button>
                <h2 className="text-white underline" style={{ fontSize: '8vw', paddingBottom: '1.5vw', paddingTop: '3.5vw' }}>Login:</h2>
                <button onClick={logout} className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-xl flex items-center justify-center bg-[#B73234] rounded-full" style={{ width: '16vw', marginTop: '1.5vw', gap: '0.5vw', padding: '0.5vw' }}>Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[2.5vw] h-[2.5vw]" /></button>
              </div>
            </aside>

            <main className="flex flex-row h-screen w-full overflow-hidden" style={{ gap: '3vw', paddingTop: '6vw' }}>
                <section className=" w-1/3 rounded-tr-[60px] max-[500px]:hidden"
                style={{ backgroundColor: colors.background, padding: '1vw' }}>
                    <h2 className="text-white underline" style={{ fontSize: '1.9vw', paddingBottom: '1.5vw' }}>Main Settings:</h2>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 text-[0.8vw] flex items-center rounded-full" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', marginTop: '1vw', paddingLeft: '1.5vw', gap: '0.5vw', padding: '0.5vw' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapColors}>Color-scheme: <img src="/assets/Icons/colorscheme.png" alt="Color Scheme" className="w-[2vw] h-[1.3vw]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] transition delay-150 duration-300 ease-in-out hover:-translate-y-1  text-[0.8vw] flex items-center rounded-full" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', marginTop: '1.5vw', paddingLeft: '1.5vw', gap: '0.5vw', padding: '0.5vw' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}>Font-family: <img src="/assets/Icons/Font.png" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    <button className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] transition delay-150 duration-300 ease-in-out hover:-translate-y-1  text-[0.8vw] flex items-center rounded-full" style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', marginTop: '1.5vw', paddingLeft: '1.5vw', gap: '0.5vw', padding: '0.5vw' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn} onClick={swapFont}> <img src={Musica} alt="Musica" className="w-[1vw] h-[1vw]" /></button>
                    <h2 className="text-white underline" style={{ fontSize: '1.9vw', paddingBottom: '1.5vw', paddingTop: '3.5vw' }}>Login:</h2>
                    <button onClick={logout} className="shadow-[0_35px_35px_rgba(0,0,0,0.25)] w-[13vw] h-[2.5vw] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#661C1D] text-[0.8vw] flex items-center justify-center bg-[#B73234] rounded-full" style={{ marginTop: '1.5vw', gap: '0.5vw', padding: '0.5vw' }}>Log-out <img src="/assets/Icons/Logout.svg" alt="Color Scheme" className="w-[1vw] h-[1vw]" /></button>
                    
                    
                </section>
                <section className="z-49 flex-1 overflow-y-auto" style={{ padding: 0 }}>
                    <div className="sticky top-0 z-[48]" style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)`, paddingBottom: '1.5vw' }}>
                        <h1 className="text-white text-center font-bold underline" style={{ fontSize: '1.9vw', paddingTop: '0.8vw', paddingBottom: '0.8vw' }}>Owned games</h1>

                        <div className="hidden max-[500px]:flex justify-center" style={{ paddingBottom: '0.8vw' }}>
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="text-white rounded-full z-49 shadow inline-flex items-center"
                                style={{ backgroundColor: colors.primaryBtn, transition: 'all 0.3s ease-in-out', paddingLeft: '0.8vw', paddingRight: '0.8vw', paddingTop: '0.4vw', paddingBottom: '0.4vw', gap: '0.5vw' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
                                aria-haspopup="dialog"
                                aria-expanded={settingsOpen}
                            >
                                <img src="/assets/Icons/Settings.png" alt="Settings" className="w-[1.5vw] h-[1.5vw]" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
              <div className='mx-auto' style={{ padding: '1vw', maxWidth: '90%', paddingBottom: '2vw', display: 'flex', flexDirection: 'column', gap: '1vw' }}>
                    {/* Loading state */}
                        {loading && (
                            <div className="text-center" style={{ paddingTop: '3vw', paddingBottom: '3vw' }}>
                                <div className="inline-block animate-spin rounded-full border-4 border-[#66C0F4] border-t-transparent" style={{ height: '3vw', width: '3vw' }}></div>
                                <p className="text-white/70" style={{ marginTop: '1vw' }}>Loading your games...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="text-center" style={{ paddingTop: '3vw', paddingBottom: '3vw' }}>
                                <p className="text-red-400" style={{ marginBottom: '1vw' }}>{error}</p>
                                <a 
                                    href={getSteamLoginUrl()}
                                    className="inline-block bg-[#66C0F4] hover:bg-[#2979A8] text-white font-bold transition"
                                    style={{ paddingTop: '0.8vw', paddingBottom: '0.8vw', paddingLeft: '1.5vw', paddingRight: '1.5vw', borderRadius: '0.5vw' }}
                                >
                                    Login with Steam
                                </a>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && games.length === 0 && (
                            <div className="text-center" style={{ paddingTop: '3vw', paddingBottom: '3vw' }}>
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
                                        has_community_visible_stats={game.has_community_visible_stats}/>
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
