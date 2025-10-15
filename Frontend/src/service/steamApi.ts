// Base URL for backend – prefer Vite env if provided
const BACKEND_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
const API_BASE = `${BACKEND_BASE}/api/steam`;

async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include'
  });
  
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
    throw new Error(errorMessage);
  }
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response (likely HTML). You may not be logged in or the request hit the SPA fallback.');
  }
  
  return response.json();
}

export async function getOwnedGames() {
  return fetchAPI('/owned-games');
}

// Export helper for auth URL so UI can link correctly to backend
export const getSteamLoginUrl = () => `${BACKEND_BASE}/auth/steam`;