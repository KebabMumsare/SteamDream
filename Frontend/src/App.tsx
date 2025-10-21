import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login';
import Favorite from './Favorite';
import FilterButton from './components/FilterButton';
import type { FilterState } from './components/FilterButton';
import { useEffect, useState } from 'react';
import { getAllGames, getFavorites, addFavorite, removeFavorite, getPreferences, updatePreferences } from './service/steamApi';

interface Game {
  appid: number;
  name: string;
  price_before_discount?: number;
  price_after_discount?: number;
  discount_percent?: number;
  image_url?: string;
  platforms?: any;
  tags?: string[];
  categories?: string[];
  description?: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    discountMin: 0,
    discountMax: 100,
    priceMin: 0,
    priceMax: 1000,
    selectedGenres: [],
  });
  
  const [colors, setColors] = useState({
    background: '#1B2838',
    drawerBg: '#1B2838',
    primaryBtn: '#66C0F4',
    primaryBtnHover: '#2979A8',
    ownedGamesHeader: '#004E7B',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
    headerBg: '#004E7B',
  });

  const swapColors = async () => {
    const variants = [
      {ownedGamesHeader: `#66007B`, background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#D866F4', primaryBtnHover: '#8A3F9C', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#66007B'},
      {ownedGamesHeader: `#6E6D6E`, background: '#434343', drawerBg: '#434343', primaryBtn: '#B4ADB6', primaryBtnHover: '#747175', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#6E6D6E'},
      {ownedGamesHeader: `#F6965B`, background: '#B95223', drawerBg: '#B95223', primaryBtn: '#F47246', primaryBtnHover: '#9B2913', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#F6965B'},
      {ownedGamesHeader: `#76E391`, background: '#22551F', drawerBg: '#22551F', primaryBtn: '#76E391', primaryBtnHover: '#2BAE2D', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
      {background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#66C0F4', primaryBtnHover: '#2979A8', ownedGamesHeader: '#004E7B', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#004E7B'},
      {ownedGamesHeader: `#2A16FF`, background: '#EAFF03', drawerBg: '#800079', primaryBtn: '#FF7301', primaryBtnHover: '#2A16FF', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setColors(randomVariant);
    document.documentElement.style.setProperty('--body-bg', randomVariant.headerBg);
    
    // Save to backend
    try {
      await updatePreferences(randomVariant, font.font);
      console.log('✅ Color preferences saved');
    } catch (error) {
      console.error('❌ Failed to save color preferences:', error);
    }
  };

  const [font, setFont] = useState({font: 'font-mono'});

  const swapFont = async () => {
    const fonts = ["font-mono", "font-sans", "font-serif"];
    const randomfonts = fonts[Math.floor(Math.random() * fonts.length)];
    setFont({font: randomfonts});
    
    // Save to backend
    try {
      await updatePreferences(colors, randomfonts);
      console.log('✅ Font preferences saved');
    } catch (error) {
      console.error('❌ Failed to save font preferences:', error);
    }
  };

  // Fetch games from database
  useEffect(() => {
    async function fetchGames() {
      try {
        console.log('🎮 Fetching games from database...');
        setLoading(true);
        const data = await getAllGames(503, 0);
        console.log('✅ Games fetched:', data);
        
        setGames(data.games || []);
      } catch (error) {
        console.error('❌ Failed to fetch games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, []);

  // Fetch user's favorites
  useEffect(() => {
    async function fetchFavorites() {
      try {
        console.log('❤️ Fetching user favorites...');
        const data = await getFavorites();
        console.log('❤️ Favorites data received:', data);
        const favoriteAppIds = data.favorites.map((fav: any) => fav.appid);
        console.log('❤️ Favorite app IDs:', favoriteAppIds);
        setFavorites(favoriteAppIds);
      } catch (error) {
        console.error('❌ Failed to fetch favorites:', error);
      }
    }
    
    fetchFavorites();
  }, []);

  // Fetch user's preferences (colors and font)
  useEffect(() => {
    async function fetchPreferences() {
      try {
        console.log('⚙️ Fetching user preferences...');
        const data = await getPreferences();
        console.log('⚙️ Preferences data received:', data);
        
        if (data.preferences) {
          const { colorScheme, font } = data.preferences;
          
          if (colorScheme) {
            console.log('🎨 Applying saved color scheme:', colorScheme);
            setColors(colorScheme);
            document.documentElement.style.setProperty('--body-bg', colorScheme.headerBg);
          }
          
          if (font) {
            console.log('🔤 Applying saved font:', font);
            setFont({ font });
          }
        } else {
          console.log('ℹ️ No saved preferences found, using defaults');
        }
      } catch (error) {
        console.error('❌ Failed to fetch preferences:', error);
      }
    }
    
    fetchPreferences();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (appid: number, isFavorite: boolean): Promise<boolean> => {
    try {
      console.log(`🔄 Toggle favorite - appid: ${appid}, isFavorite: ${isFavorite}`);
      
      if (isFavorite) {
        const result = await addFavorite(appid);
        console.log('✅ Add favorite result:', result);
        setFavorites(prev => [...prev, appid]);
        console.log(`✅ Added game ${appid} to favorites`);
        return true;
      } else {
        const result = await removeFavorite(appid);
        console.log('✅ Remove favorite result:', result);
        setFavorites(prev => prev.filter(id => id !== appid));
        console.log(`✅ Removed game ${appid} from favorites`);
        return true;
      }
    } catch (error: any) {
      console.error('❌ Failed to toggle favorite:', error);
      // Show error message
      if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
        alert('You must be logged in to add favorites. Please log in with Steam first.');
      } else {
        alert(`Failed to update favorite: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  };

  return (
    <BrowserRouter>
      <div className={font.font}>
        <Navbar colors={colors} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <style>{`

              @media (max-width: 2000px) {
                  .header-mobile-padding {
                    padding-top: 12vw !important;
                  }
                }

                @media (max-width: 500px) {
                  .header-mobile-padding {
                    padding-top: 30vw !important;
                  }
                  .header-mobile-title {
                    font-size: 8vw !important;
                  }
                  .cards-mobile-padding {
                    padding-top: 50vw !important;
                  }
                  .header-mobile-layout {
                    flex-direction: column !important;
                    gap: 1rem !important;
                  }
                  .filter-button-mobile {
                    position: static !important;
                  }
                }
                
                
              `}</style>
              <div className='header-mobile-padding z-49 pt-0 pb-[3vw] w-[90vw] fixed top-0 left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 70%, rgba(0,78,123,0) 100%)`, paddingTop: '10vw' }}>
                <div className="header-mobile-layout relative flex justify-center items-center">
                  <h1
                    className="header-mobile-title text-white font-bold underline text-center"
                    style={{ fontSize: "1.9vw" }}
                  >
                    SteamDream
                  </h1>
                  {/* Filter button positioned absolutely on the right */}
                  <div className="filter-button-mobile absolute right-8">
                    <FilterButton 
                      games={games}
                      onFilterChange={setFilters}
                      colors={colors}
                    />
                  </div>
                </div>
              </div>
              <div className="max-w-[90%] mx-auto min-h-screen">
                <div className="cards-mobile-padding pt-[14vw] space-y-12 pb-8 flex flex-col items-start">
                  {loading ? (
                    <div className="text-center py-12 w-full">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#66C0F4] border-t-transparent"></div>
                      <p className="text-white/70 mt-4">Loading games...</p>
                    </div>
                  ) : games.length === 0 ? (
                    <div className="text-center py-12 w-full">
                      <p className="text-white/70">No games found in database.</p>
                    </div>
                  ) : (
                    games
                      .filter(game => 
                        game.name.toLowerCase().startsWith(searchTerm.toLowerCase())
                      )
                      .filter(game => {
                        // Discount filter
                        const discount = game.discount_percent || 0;
                        if (discount < filters.discountMin || discount > filters.discountMax) {
                          return false;
                        }

                        // Price filter (using price_after_discount or price_before_discount)
                        const price = game.price_after_discount || game.price_before_discount || 0;
                        if (price < filters.priceMin || price > filters.priceMax) {
                          return false;
                        }

                        // Genre filter
                        if (filters.selectedGenres.length > 0) {
                          const gameTags = game.tags || [];
                          const hasMatchingGenre = filters.selectedGenres.some(genre => 
                            gameTags.includes(genre)
                          );
                          if (!hasMatchingGenre) {
                            return false;
                          }
                        }

                        return true;
                      })
                      .map((game) => (
                        <Card 
                          imageUrl={game.image_url}
                          key={game.appid}
                          appid={game.appid}
                          title={game.name}
                          genre={game.categories?.slice(0, 2).join(' & ') || ''}
                          originalPrice={game.price_before_discount}
                          currentPrice={game.price_after_discount}
                          discountPercent={game.discount_percent}
                          platforms={game.platforms || {}}
                          tags={game.tags || []}
                          description={game.description || ''}
                          steamUrl={`https://store.steampowered.com/app/${game.appid}`}
                          isFavorite={favorites.includes(game.appid)}
                          onFavoriteToggle={handleFavoriteToggle}
                          colors={{
                            background: colors.background,
                            primaryBtn: colors.primaryBtn,
                            primaryBtnHover: colors.primaryBtnHover
                          }}
                        />
                      ))
                  )}
                </div>
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile colors={colors} swapColors={swapColors} swapFont={swapFont} />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite colors={colors} searchTerm={searchTerm} />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
