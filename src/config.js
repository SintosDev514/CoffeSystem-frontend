// config.js - provides API URL from build-time env vars
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

