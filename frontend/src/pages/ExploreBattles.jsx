import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { useBattle } from '../contexts/BattleContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import BattleCard from '../components/BattleCard';
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
  const navigate = useNavigate();

  useEffect(() => {
    const getBattles = async(token) => {
      await getAllBattles(token);
    }
    getBattles(token);
  }, [])

  // console.table(battles)

  const filteredBattles = battles.filter(battle => {
    const rapper1Id = battle.contestants.rapper1._id;
    const rapper2Id = battle.contestants.rapper2._id;

    return rapper1Id != user._id && rapper2Id != user._id && battle.status !== "pending";
  })


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
    <div className="min-h-screen p-6">
    
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 bg-">
          <CardHeader>
            <CardTitle className="text-2xl text-secondary text-center">Explore Battles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex gap-2 items-center">
                <label htmlFor="sort" className="text-white">Sort by:</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-md bg-transparent border border-secondary px-2 py-1 text-white"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option className='text-primary' key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="status" className="text-white">Status:</label>
                <select
                  id="status"
                  value={status}
                  onChange={handleStatusChange}
                  className="rounded-md bg-transparent border border-secondary px-2 py-1 text-white"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option className='text-primary' key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading && (
              <div className="flex justify-center items-center min-h-[10rem]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!loading && !error && filteredBattles.length === 0 && (
              <div className="text-center text-gray-400 py-8">No battles found.</div>
            )}
            <div className="flex flex-col flex-wrap gap-5">
              {filteredBattles.map((battle) => (
                <BattleCard battle={battle} />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={handlePrev} disabled={page === 1} className="bg-primary/80">Prev</Button>
                <span className="text-white self-center">Page {page} of {totalPages}</span>
                <Button onClick={handleNext} disabled={page === totalPages} className="bg-primary/80">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExploreBattles;