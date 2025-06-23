import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ArtistContext = createContext();

export const useArtist = () => {
  const context = useContext(ArtistContext);
  if (!context) throw new Error('useArtist must be used within an ArtistProvider');
  return context;
};

export const ArtistProvider = ({ children }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:4000';

  // Fetch all artists
  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/rappers`);
      // console.log("res", res)
      setArtists(res.data.data);
    } catch {
      setError('Failed to load artists.');
    } finally {
      setLoading(false);
    }
  };

  // Optionally, fetch a single artist by ID
  const fetchArtistById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/rappers/${id}`);
      return res.data;
    } catch {
      setError('Failed to load artist.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all artists on mount
  useEffect(() => {
    fetchArtists();
    console.log("Context",artists)
  }, []);

  const value = {
    artists,
    loading,
    error,
    fetchArtists,
    fetchArtistById,
  };

  return (
    <ArtistContext.Provider value={value}>
      {children}
    </ArtistContext.Provider>
  );
};
