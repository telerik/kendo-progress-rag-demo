// API configuration that handles different environments
const getApiBaseUrl = (): string => {
  // In production (GitHub Pages), use the live API URL
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use relative URLs (which get proxied to localhost:5000)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint; // Use relative URL for development (proxied)
};
