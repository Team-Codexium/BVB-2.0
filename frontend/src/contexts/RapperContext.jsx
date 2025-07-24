import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const RapperContext = createContext();

export const useRapper = () => {
  const context = useContext(RapperContext);
  if (!context) throw new Error('useRapper must be used within a RapperProvider');
  return context;
};

export const RapperProvider = ({ children }) => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [tracks, setTracks] = useState([]);

  const API_URL = 'http://localhost:4000';

  // Fetch all rappers
  const fetchRappers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/rappers`);
      setRappers(res.data.data);
    } catch {
      setError('Failed to load rappers.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single rapper by ID
  const fetchRapperById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/rappers/${id}`);
      console.log('Rapper fetched:', res);
      // if (!res.data.success) {
      return res.data;
    } catch {
      setError('Failed to load rapper.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchRapperDetails = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/rappers/stats/${id}`);
      // console.log('Stats fetched:', res);
      if (res.data.success) {
        setStats(res.data.stats);
      } else {
        setError('Failed to load stats.');
      }

      return res.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load stats.');
      return null;
    }
  }

  const fetchTracksByRapper = async (rapperId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/media/${rapperId}`);
      console.log('Tracks fetched:', res);
      setTracks(res.data.audioUrls || []);
    } catch {
      setError('Failed to load tracks.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all rappers on mount
  useEffect(() => {
    fetchRappers();
  }, []);

  const value = {
    rappers,
    loading,
    error,
    fetchRappers,
    fetchRapperById,
    stats,
    fetchRapperDetails,
    setStats,
    tracks,
    fetchTracksByRapper,
    setTracks,
  };

  return (
    <RapperContext.Provider value={value}>
      {children}
    </RapperContext.Provider>
  );
};
