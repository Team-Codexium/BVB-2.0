import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const BattleContext = createContext();

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) throw new Error('useBattle must be used within a BattleProvider');
  return context;
};

export const BattleProvider = ({ children }) => {
  const [battles, setBattles] = useState([]);
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:4000/api';

  // Get all battles
  const getAllBattles = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/battles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattles(res.data.data || []);
      return res.data.data;
    } catch {
      setError('Failed to load all battles.');
      setBattles([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get battle by ID
  const getBattleById = async (battleId, token) => {
    console.log("getBattleby id fucntion running in context");
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/battles/${battleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattle(res.data.data);
      console.log("getBattleById response:", res.data); 
      return res.data.data;
    } catch {
      setError('Failed to load battle.');
      setBattle(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get battles by rapper ID
  const getBattleByRapperId = async (rapperId, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/battles/rapper/${rapperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattles(res.data.data || []);
      return res.data.data;
    } catch {
      setError('Failed to load battles by rapper.');
      setBattles([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get battles by status
  const getBattleByStatus = async (status, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/battles/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattles(res.data.data || []);
      return res.data.data;
    } catch {
      setError('Failed to load battles by status.');
      setBattles([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get battles with query (pagination, sorting, status)
  const getQueryBattle = async (params, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/battles/query`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattles(res.data.battles || []);
      return res.data;
    } catch {
      setError('Failed to load battles with query.');
      setBattles([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new battle
  const createBattle = async (battleData, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/battles/create`, battleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattle(res.data.data);
      return res.data;
    } catch {
      setError('Failed to create battle.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Accept a battle
  const acceptBattle = async (battleId, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/battles/accept/${battleId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattle(res.data.data);
      return res.data;
    } catch {
      setError('Failed to accept battle.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle time limit expiration
  const handleTimeLimitExpiration = async (battleId, token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/battles/expire/${battleId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBattle(res.data.data);
      return res.data;
    } catch {
      setError('Failed to handle time limit expiration.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBattles();
    console.log(battles)
  },[])

  const value = {
    battles,
    battle,
    loading,
    error,
    getAllBattles,
    getBattleById,
    getBattleByRapperId,
    getBattleByStatus,
    getQueryBattle,
    createBattle,
    acceptBattle,
    handleTimeLimitExpiration,
  };

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
};
