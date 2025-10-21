import { useEffect, useState } from 'react';
import Card from './components/Card';
import { getFavoriteGames, addFavorite, removeFavorite } from './service/steamApi';

interface FavoriteProps {
    colors: {
        background: string;
        primaryBtn: string;
        primaryBtnHover: string;
        headerBg: string;
    };
    searchTerm: string;
}

interface Game {
    appid: number;
    name: string;
    price_before_discount?: number;
    price_after_discount?: number;
    discount_percent?: number;
    image_url?: string;
    platforms?: any;
    tags?: string[];
    description?: string;
     categories?: string[];
}

function Favorite({ colors, searchTerm }: FavoriteProps) {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch favorite games from backend
    useEffect(() => {
        async function fetchFavorites() {
            try {
                const data = await getFavoriteGames();
                setGames(data.games || []);
            } catch (error) {
                console.error('❌ Failed to fetch favorite games:', error);
                setGames([]);
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, []);

    // Handle favorite toggle (remove from favorites)
    const handleFavoriteToggle = async (appid: number, isFavorite: boolean) => {
        try {
            if (isFavorite) {
                await addFavorite(appid);
            } else {
                await removeFavorite(appid);
                // Remove from local state
                setGames(prev => prev.filter(game => game.appid !== appid));
            }
        } catch (error) {
            console.error('❌ Failed to toggle favorite:', error);
            alert('Failed to update favorite. Please try again.');
        }
    };

    const filteredGames = games.filter(game => 
        game.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
         <>
            <div className='z-49 pt-0 pb-[3vw] w-[90vw] fixed top-0 left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 70%, rgba(0,78,123,0) 100%)`, paddingTop: '10vw' }}>
                <h1
                  className="text-white font-bold text-center underline"
                  style={{ fontSize: "1.9vw" }}
        >
                  Favorites
                </h1>
            </div>
            <div className="max-w-[90%] mx-auto min-h-screen">
                <div className="pt-[14vw] space-y-12 pb-8 flex flex-col items-start">
                    {loading ? (
                        <div className="text-center py-12 w-full">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#66C0F4] border-t-transparent"></div>
                            <p className="text-white/70 mt-4">Loading favorites...</p>
                        </div>
                    ) : filteredGames.length === 0 ? (
                        <div className="text-center py-12 w-full">
                            <p className="text-white/70">No favorite games yet. Start adding some!</p>
                        </div>
                    ) : (
                        filteredGames.map((game) => (
                            <Card 
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
                                imageUrl={game.image_url}
                                isFavorite={true}
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
    );
}

export default Favorite;
