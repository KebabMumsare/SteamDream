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