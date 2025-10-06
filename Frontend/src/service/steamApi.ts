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