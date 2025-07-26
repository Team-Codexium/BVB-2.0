import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBattle } from '../contexts/BattleContext';
import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from "react-router-dom";
import {BattleCard} from '../components';
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'votes', label: 'Most Voted' }
];
const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'started', label: 'Started' },
  { value: 'completed', label: 'Completed' },
  { value: "cancelled", label: "Cancelled" }
];
const PAGE_SIZE = 20;

const ExploreBattles = () => {
  const { token, user } = useAuth();
  const { battles, getAllBattles, loading, error } = useBattle();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const getBattles = async(token) => {
      await getAllBattles(token);
    }
    getBattles(token);
  }, [token])

  // Filter battles based on status and user
  const filteredBattles = battles.filter(battle => {
    const rapper1Id = battle.rapper1?._id;
    const rapper2Id = battle.rapper2?._id;
    // Only show battles where user is not a contestant and status matches
    const notContestant = rapper1Id !== user._id && rapper2Id !== user._id;
    const statusMatch = status === '' || battle.status?.toLowerCase() === status.toLowerCase();
    return notContestant && statusMatch;
  });

  // Sort battles
  const sortedBattles = [...filteredBattles].sort((a, b) => {
    if (sort === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sort === 'votes') {
      const aVotes = (a.rapper1Votes || 0) + (a.rapper2Votes || 0);
      const bVotes = (b.rapper1Votes || 0) + (b.rapper2Votes || 0);
      return bVotes - aVotes;
    }
    return 0;
  });

  // Pagination
  useEffect(() => {
    setTotalPages(Math.ceil(sortedBattles.length / PAGE_SIZE));
    setPage(1);
  }, [sortedBattles.length]);

  const paginatedBattles = sortedBattles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden py-8 px-2">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      <div className="max-w-5xl mx-auto z-10 relative">
        <Card className="mb-10 bg-black/60 border-2 border-yellow-400 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-4xl font-orbitron text-yellow-400 text-center glitch py-4">
              Explore Battles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex gap-2 items-center">
                <label htmlFor="sort" className="text-yellow-400 font-orbitron">Sort by:</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-md bg-gray-900 border-yellow-400 px-3 py-2 text-yellow-400 font-orbitron"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option className='text-yellow-400' key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="status" className="text-yellow-400 font-orbitron">Status:</label>
                <select
                  id="status"
                  value={status}
                  onChange={handleStatusChange}
                  className="rounded-md bg-gray-900 border-yellow-400 px-3 py-2 text-yellow-400 font-orbitron"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option className='text-yellow-400' key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading && (
              <div className="flex justify-center items-center min-h-[10rem]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            )}
            {error && (
              <div className="flex justify-center mb-4">
                <span className="text-red-400 font-orbitron">{error}</span>
              </div>
            )}
            {!loading && !error && paginatedBattles.length === 0 && (
              <div className="text-center text-gray-400 py-8 font-orbitron">
                No battles found.
              </div>
            )}
            <div className="grid gap-8">
              {paginatedBattles.map((battle) => (
                <BattleCard key={battle._id} battle={battle} />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-10">
                <Button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 rounded-lg"
                >
                  Prev
                </Button>
                <span className="text-yellow-400 font-orbitron self-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 rounded-lg"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .glitch {
            animation: glitch 1.5s infinite linear alternate-reverse;
            position: relative;
            color: transparent;
            background: linear-gradient(90deg,#facc15,#f472b6,#a78bfa);
            background-clip: text;
            -webkit-background-clip: text;
            text-shadow: 0 0 8px #facc15, 0 0 2px #fff;
          }
          @keyframes glitch {
            0% { text-shadow: 2px 0 #facc15, -2px 0 #f472b6; }
            20% { text-shadow: -2px 2px #a78bfa, 2px -2px #fff; }
            40% { text-shadow: 2px 2px #facc15, -2px -2px #f472b6; }
            60% { text-shadow: -2px 0 #a78bfa, 2px 0 #fff; }
            80% { text-shadow: 2px -2px #facc15, -2px 2px #f472b6; }
            100% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
          }
        `}
      </style>
    </div>
  )
};

export default ExploreBattles;