import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login';
import Favorite from './Favorite';
import { getAllGames, getPublicGameInfo } from './service/steamApi';
import { useEffect, useState } from 'react';


function App() {
  const [colors, setColors] = useState({
    background: '#1B2838',
    drawerBg: '#1B2838',
    primaryBtn: '#66C0F4',
    primaryBtnHover: '#2979A8',
    ownedGamesHeader: '#004E7B',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
    headerBg: '#004E7B',
  });

  const swapColors = () => {
    const variants = [
      {ownedGamesHeader: `#8CFC99`, background: '#29BD3B', drawerBg: '#29BD3B', primaryBtn: '#32F349', primaryBtnHover: '#2BCC3E', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#8CFC99'},
      {ownedGamesHeader: `#66007B`, background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#D866F4', primaryBtnHover: '#8A3F9C', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#66007B'},
      {ownedGamesHeader: `#6E6D6E`, background: '#434343', drawerBg: '#434343', primaryBtn: '#B4ADB6', primaryBtnHover: '#747175', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#6E6D6E'},
      {ownedGamesHeader: `#F6965B`, background: '#B95223', drawerBg: '#B95223', primaryBtn: '#F47246', primaryBtnHover: '#9B2913', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#F6965B'},
      {ownedGamesHeader: `#76E391`, background: '#22551F', drawerBg: '#22551F', primaryBtn: '#76E391', primaryBtnHover: '#2BAE2D', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
      {background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#66C0F4', primaryBtnHover: '#2979A8', ownedGamesHeader: '#004E7B', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#004E7B'},
      {ownedGamesHeader: `#2A16FF`, background: '#EAFF03', drawerBg: '#800079', primaryBtn: '#FF7301', primaryBtnHover: '#2A16FF', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},

    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setColors(randomVariant);
    // Update CSS variable for body background
    document.documentElement.style.setProperty('--body-bg', randomVariant.headerBg);
  };

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allGames, setAllGames] = useState<any[]>([]);
  const GAMES_PER_PAGE = 10;

  useEffect(() => {
    getPublicGameInfo('1272080');
    loadAllGames();
  }, []);

  const loadAllGames = async () => {
    setLoading(true);
    try {
      const data = await getAllGames();
      if (data?.applist?.apps) {
        setAllGames(data.applist.apps);
        setTotalPages(Math.ceil(data.applist.apps.length / GAMES_PER_PAGE));
        loadPage(1); // Load first page
      }
    } catch (error) {
      console.log('Error loading games: ', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (pageNumber: number) => {
    const startIndex = (pageNumber - 1) * GAMES_PER_PAGE;
    
    // Load more games than needed to compensate for filtering
    const loadCount = GAMES_PER_PAGE * 3; // Load triple to ensure we get enough games after filtering
    const endIndex = startIndex + loadCount;
    const pageGames = allGames.slice(startIndex, endIndex);
    
    setCurrentPage(pageNumber);
    setLoading(true);

    // Fetch detailed info for each game on this page
    const detailedGames = await Promise.all(
      pageGames.map(async (game) => {
        try {
          const details = await getPublicGameInfo(game.appid.toString());
          const gameData = details[game.appid.toString()];
          
          if (gameData?.success) {
            // Merge basic game info with detailed info
            return {
              ...game,
              ...gameData.data,
              // Ensure we use the detailed info if available
              name: gameData.data.name || game.name,
              header_image: gameData.data.header_image,
              short_description: gameData.data.short_description,
              price_overview: gameData.data.price_overview,
              genres: gameData.data.genres,
              screenshots: gameData.data.screenshots,
              release_date: gameData.data.release_date,
              platforms: gameData.data.platforms
            };
          }
        } catch (error) {
          console.log(`Error loading details for game ${game.appid}:`, error);
        }
        
        // Return basic game info if details fail to load
        return game;
      })
    );

    // Filter to only games, then take exactly GAMES_PER_PAGE
    const gamesOnly = detailedGames
      .filter((game: any) => game.type === 'game')
      .slice(0, GAMES_PER_PAGE);

    setGames(gamesOnly);
    setLoading(false);
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      loadPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 mx-1 rounded text-white ${
            i === currentPage
              ? ''
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
          style={i === currentPage ? { backgroundColor: colors.primaryBtn } : {}}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <BrowserRouter>
      <Navbar colors={colors} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-[90%] mx-auto">
                <div className='z-49 pt-[9vw] w-[100%] fixed left-1/2 transform -translate-x-1/2' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 87%, rgba(0,78,123,0) 100%)` }}>
                  <h1
                    className="text-white font-mono font-bold text-center mt-[2vw] mb-[4vw] underline"
                    style={{ fontSize: "1.9vw" }}
                  >
                    SteamDream
                  </h1>
                </div>
                
                <div className="pt-[15vw] space-y-12">
                  {loading ? (
                    <div className="text-center text-white">Loading games...</div>
                  ) : (
                    games.map((game: any) => (
                      <Card
                        key={game.appid}
                        title={game.name}
                        image={game.capsule_image}
                        description={game.short_description}
                        colors={colors}
                      />
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 mb-8 space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {renderPageNumbers()}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Page Info */}
                {totalPages > 0 && (
                  <div className="text-center text-gray-400 mb-4">
                    Page {currentPage} of {totalPages} ({allGames.length} total games)
                  </div>
                )}
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile colors={colors} swapColors={swapColors} />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite colors={colors} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
