import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { useRapper } from "../contexts/RapperContext";
import { useBattle } from "../contexts/BattleContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;

const Rappers = () => {
  const { rappers, loading, error } = useRapper();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(160);

  const { createBattle } = useBattle();
  const { token, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Filter rappers by search
    let filteredRappers = rappers;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filteredRappers = rappers.filter(
        (a) =>
          (a.username && a.username.toLowerCase().includes(s)) ||
          (a.fullName && a.fullName.toLowerCase().includes(s))
      );
    }
    setFiltered(filteredRappers);
    setPage(1); // Reset to first page on search
  }, [search, rappers]);

  const filteredRappers = filtered.filter((rapper) => rapper._id != user._id);

  // Pagination
  const totalPages = Math.ceil(filteredRappers.length / PAGE_SIZE) || 1;
  const paginated = filteredRappers?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleChallenge = async (rapperId) => {
    const data = {
      rapper2Id: rapperId,
      battleTitle: title,
      timeLimit: duration,
    };
    await createBattle(data, token);
  };

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
              Rappers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <Input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 border-yellow-400 bg-gray-900 text-yellow-400 font-orbitron"
              />
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
            {!loading && !error && paginated.length === 0 && (
              <div className="text-center text-gray-400 py-8 font-orbitron">
                No rappers found.
              </div>
            )}
            <div className="grid gap-8 md:grid-cols-2">
              {paginated.map((rapper) => (
                <Card
                  key={rapper._id}
                  className="bg-gradient-to-br from-purple-900 via-black to-pink-900 border-2 border-yellow-400 rounded-2xl shadow-lg"
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2 cursor-pointer" onClick={() => navigate(`/rapper/${rapper._id}`)}>
                    <img
                      src={rapper.image || "/default-avatar.png"}
                      alt={rapper.username || "Rapper"}
                      className="w-20 h-20 rounded-full object-cover border-2 border-pink-400 shadow"
                    />
                    <div>
                      <CardTitle className="text-xl font-orbitron text-yellow-400">
                        {rapper.fullName || rapper.username}
                      </CardTitle>
                      <div className="text-pink-400 font-orbitron text-sm">
                        @{rapper.username}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pt-0">
                    <div>
                      <div className="mb-2 text-sm font-orbitron text-white">
                        <span className="font-bold text-yellow-400">Rank:</span>{" "}
                        <span className="text-pink-400">{rapper.rank || "N/A"}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 px-6 py-2 font-bold shadow hover:bg-yellow-500 hover:text-black transition-all duration-200 rounded-lg"
                        >
                          Challenge
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black/90 text-white border-2 border-yellow-400 rounded-2xl shadow-2xl font-orbitron">
                        <DialogHeader>
                          <DialogTitle className="text-yellow-400">Create Battle</DialogTitle>
                          <DialogDescription className="text-pink-400">
                            Set title and time for this battle. Click Create when you're ready.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                          {/* Battle Title Input */}
                          <div className="grid gap-2">
                            <Label htmlFor="battle-title" className="text-yellow-400">Battle Title</Label>
                            <Input
                              id="battle-title"
                              name="battleTitle"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter battle title"
                              className="bg-gray-900 border-yellow-400 text-yellow-400 font-orbitron"
                            />
                          </div>
                          {/* Time Limit Selector */}
                          <div className="grid gap-2">
                            <Label htmlFor="time-limit" className="text-yellow-400">Time Limit (minutes)</Label>
                            <select
                              id="time-limit"
                              value={duration}
                              onChange={(e) => setDuration(Number(e.target.value))}
                              className="bg-gray-900 text-yellow-400 border-yellow-400 rounded px-3 py-2 font-orbitron"
                            >
                              {[1, 5, 7, 10, 15].map((val) => (
                                <option key={val} value={val}>
                                  {val} minutes
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 rounded-lg">
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 rounded-lg"
                              onClick={() => handleChallenge(rapper._id)}
                            >
                              Create Battle
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
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
  );
};

export default Rappers;
