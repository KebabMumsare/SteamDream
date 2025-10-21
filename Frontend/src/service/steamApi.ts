// Base URL for backend – prefer Vite env if provided
// Since frontend is served by the backend, use empty string for same-origin requests
const BACKEND_BASE = (import.meta as any).env?.VITE_BACKEND_URL || '';
const API_BASE = `${BACKEND_BASE}/api/steam`;

async function fetchAPI(endpoint: string) {
  console.log(`🌐 Fetching: ${API_BASE}${endpoint}`);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include'
  });
  
  console.log(`📡 Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If JSON parsing fails, use status message
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    console.error('❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('❌ Non-JSON response received');
    throw new Error('Server returned non-JSON response (likely HTML). You may not be logged in or the request hit the SPA fallback.');
  }
  
  return response.json();
}

export async function getOwnedGames() {
  console.log('🎯 getOwnedGames() called');
  return fetchAPI('/owned-games');
}

// Get all games from database
export async function getAllGames(limit = 100, offset = 0) {
  console.log('🎮 getAllGames() called');
  const response = await fetch(`${BACKEND_BASE}/api/games?limit=${limit}&offset=${offset}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.status}`);
  }
  
  return response.json();
}

// Search games across entire database
export async function searchGames(searchTerm: string, limit = 20, offset = 0) {
  console.log('🔍 searchGames() called with term:', searchTerm);
  const response = await fetch(`${BACKEND_BASE}/api/games/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to search games: ${response.status}`);
  }
  
  return response.json();
}

// Filter games across entire database
export async function filterGames(filters: {
  discountMin: number;
  discountMax: number;
  priceMin: number;
  priceMax: number;
  selectedGenres: string[];
}, limit = 20, offset = 0) {
  console.log('🎯 filterGames() called with filters:', filters);
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    discountMin: filters.discountMin.toString(),
    discountMax: filters.discountMax.toString(),
    priceMin: filters.priceMin.toString(),
    priceMax: filters.priceMax.toString(),
  });
  
  if (filters.selectedGenres.length > 0) {
    params.append('genres', filters.selectedGenres.join(','));
  }
  
  const response = await fetch(`${BACKEND_BASE}/api/games/filter?${params.toString()}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to filter games: ${response.status}`);
  }
  
  return response.json();
}

// Check if user is authenticated
export async function checkAuth(): Promise<boolean> {
  try {
    console.log('Checking authentication...');
    const response = await fetch('/auth/user', {
      credentials: 'include'
    });
    
    if (response.ok) {
      console.log('User is authenticated');
      return true;
    } else {
      console.log('User is not authenticated');
      return false;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Logout function
export async function logout() {
  try {
    console.log('🚪 Logging out...');
    // Redirect to the logout endpoint which will clear the session
    window.location.href = '/auth/logout';
  } catch (error) {
    console.error('❌ Logout error:', error);
  }
}

// Export helper for auth URL so UI can link correctly to backend
export const getSteamLoginUrl = () => `${BACKEND_BASE}/auth/steam`;

// ===== FAVORITES API =====

// Get user's favorite app IDs
export async function getFavorites() {
  console.log('❤️ getFavorites() called');
  const response = await fetch(`${BACKEND_BASE}/api/favorites`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      console.log('Not authenticated');
      return { favorites: [] };
    }
    throw new Error(`Failed to fetch favorites: ${response.status}`);
  }
  
  return response.json();
}

// Get user's favorite games with full details
export async function getFavoriteGames() {
  console.log('🎮❤️ getFavoriteGames() called');
  const response = await fetch(`${BACKEND_BASE}/api/favorites/games`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      console.log('Not authenticated');
      return { games: [] };
    }
    throw new Error(`Failed to fetch favorite games: ${response.status}`);
  }
  
  return response.json();
}

// Add a game to favorites
export async function addFavorite(appid: number) {
  console.log(`➕ addFavorite(${appid}) called`);
  const response = await fetch(`${BACKEND_BASE}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ appid }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to add favorite: ${response.status}`);
  }
  
  return response.json();
}

// Remove a game from favorites
export async function removeFavorite(appid: number) {
  console.log(`➖ removeFavorite(${appid}) called`);
  const response = await fetch(`${BACKEND_BASE}/api/favorites/${appid}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to remove favorite: ${response.status}`);
  }
  
  return response.json();
}

// ===== USER PREFERENCES API =====

// Get user preferences
export async function getPreferences() {
  console.log('⚙️ getPreferences() called');
  const response = await fetch(`${BACKEND_BASE}/api/preferences`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      console.log('Not authenticated');
      return { preferences: null };
    }
    throw new Error(`Failed to fetch preferences: ${response.status}`);
  }
  
  return response.json();
}

// Update user preferences
export async function updatePreferences(colorScheme: any, font: string) {
  console.log('💾 updatePreferences() called', { colorScheme, font });
  const response = await fetch(`${BACKEND_BASE}/api/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ colorScheme, font }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to update preferences: ${response.status}`);
  }
  
  return response.json();
}