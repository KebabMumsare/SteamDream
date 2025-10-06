const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY;

export const getPublicGameInfo = async (appId: string) => {
  // Use proxy for development
  const response = await fetch(`/api/store/api/appdetails?appids=${appId}&l=english`);
  const data = await response.json();
  console.log(data);
  return data;
};

// Alternative: Get app list
export const getAllGames = async () => {
  const response = await fetch(`/api/steam/ISteamApps/GetAppList/v0002/`);
  const data = await response.json();
  console.log(data);
  return data;
};

export const getPlayerSummaries = async (steamIds: string[]) => {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not found. Please set VITE_STEAM_API_KEY in your .env file');
  }

  try {
    const ids = steamIds.join(',');
    const response = await fetch(`/api/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${ids}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching player summaries:', error);
    return null;
  }
};

export const getPlayerGames = async (steamId: string) => {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not found');
  }

  try {
    const response = await fetch(`/api/steam/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching player games:', error);
    return null;
  }
};