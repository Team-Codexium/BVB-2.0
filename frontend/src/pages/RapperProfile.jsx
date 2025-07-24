import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRapper } from "../contexts/RapperContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Swords, Trophy, Crown, Star, Target } from "lucide-react";
import TrackList from "../components/TrackList";
import BattleCard from "../components/BattleCard";
import { Button } from "@/components/ui/button";
import axios from "axios";

const PAGE_SIZE = 5;

const RapperProfile = () => {
  const { id } = useParams();
  const { fetchRapperDetails, fetchTracksByRapper, tracks, stats, loading, error } = useRapper();
  const [rapper, setRapper] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [tracksPage, setTracksPage] = useState(1);

  // Battle pagination states(TO BE DONE)
  const [recentPage, setRecentPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);

  useEffect(() => {
    const fetchProfile = async () => {
      setLocalLoading(true);
      setRapper(null);
      const data = await fetchRapperDetails(id);
      if (data) setRapper(data.rapper);
      setLocalLoading(false);
    };
    fetchProfile();
    fetchTracksByRapper(id);
    // eslint-disable-next-line
  }, [id]);


  const battleStats = stats.map((stat) => {
    let icon = Star, color = "text-green-600";
    switch (stat.title) {
      case "Total Battles": icon = Swords; color = "text-blue-600"; break;
      case "Wins": icon = Trophy; color = "text-yellow-600"; break;
      case "Win Rate": icon = Flame; color = "text-red-600"; break;
      case "Ranking": icon = Crown; color = "text-purple-600"; break;
      case "Total Score": icon = Star; color = "text-green-600"; break;
      case "Losses": icon = Target; color = "text-pink-600"; break;
      case "Draws": icon = Target; color = "text-indigo-600"; break;
      case "Tier": icon = Crown; color = "text-yellow-400"; break;
      case "Active Battles": icon = Flame; color = "text-orange-400"; break;
      case "Pending Battles": icon = Swords; color = "text-gray-400"; break;
      case "Completed Battles": icon = Trophy; color = "text-green-400"; break;
      case "Votes Received": icon = Star; color = "text-yellow-400"; break;
      default: icon = Star; color = "text-green-600";
    }
    return { ...stat, icon, color, change: '', changeType: 'positive' };
  });

  // Battle sections logic
  const allBattles = rapper?.recentBattles || [];

  // Recent Battles: sorted by createdAt desc
  const recentBattles = [...allBattles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const displayedRecentBattles = recentBattles.slice(0, recentPage * PAGE_SIZE);
  const hasMoreRecent = displayedRecentBattles.length < recentBattles.length;

  // Active Battles: status === 'active'
  const activeBattles = allBattles.filter(b => b.status === "active");
  const displayedActiveBattles = activeBattles.slice(0, activePage * PAGE_SIZE);
  const hasMoreActive = displayedActiveBattles.length < activeBattles.length;

  // Popular Battles: sorted by total votes desc
  const popularBattles = [...allBattles].sort((a, b) => {
    const vA = (a.rapper1Votes || 0) + (a.rapper2Votes || 0);
    const vB = (b.rapper1Votes || 0) + (b.rapper2Votes || 0);
    return vB - vA;
  });
  const displayedPopularBattles = popularBattles.slice(0, popularPage * PAGE_SIZE);
  const hasMorePopular = displayedPopularBattles.length < popularBattles.length;

  // Tracks pagination logic
  const displayedTracks = tracks?.slice(0, tracksPage * PAGE_SIZE);
  const hasMoreTracks = displayedTracks.length < tracks.length;

  if (localLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Neon blurred shapes for loading */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>
      <div className="z-10 flex flex-col items-center">
        <Skeleton className="w-32 h-32 rounded-full mb-6 bg-yellow-400/30" />
        <div className="text-2xl font-orbitron font-bold text-yellow-400 mb-2 animate-pulse">Loading Profile...</div>
        <Skeleton className="w-64 h-8 mb-4 bg-pink-400/20" />
        <Skeleton className="w-full max-w-xl h-40 rounded-2xl bg-gray-800/60 mb-4" />
        <Skeleton className="w-full max-w-xl h-40 rounded-2xl bg-gray-800/60" />
      </div>
    </div>
    );
  }

  if (error || !rapper) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-red-400 font-orbitron">
        {error || "Rapper not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden py-10 px-2 md:px-4">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10 relative">
        {/* Profile Picture & Info */}
        <Avatar className="w-32 h-32 mb-4 shadow-lg border-4 border-yellow-400">
          <AvatarImage src={rapper.image || "/default-avatar.png"} alt={rapper.fullName || rapper.username || "Rapper"} />
          <AvatarFallback>{(rapper.username || rapper.fullName || "?")[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center mb-6">
          <div className="text-3xl font-orbitron font-bold text-yellow-400 glitch">{rapper.fullName || rapper.username}</div>
          <div className="text-md text-pink-400 mb-1 font-orbitron">@{rapper.username}</div>
          {rapper.bio && <div className="text-gray-300 mt-2">{rapper.bio}</div>}
        </div>

        {/* Battle Stats */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {battleStats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Card key={idx} className="bg-black/60 border-2 border-yellow-400 rounded-2xl hover:shadow-lg transition-shadow duration-200 font-orbitron">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-yellow-400">{stat.title}</CardTitle>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Battles */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-orbitron font-bold text-yellow-400 glitch">Recent Battles</div>
            {hasMoreRecent && (
              <Button
                variant="outline"
                className="font-orbitron border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => setRecentPage(recentPage + 1)}
              >
                See More
              </Button>
            )}
          </div>
          {displayedRecentBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {displayedRecentBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No recent battles.</div>
          )}
        </div>

        {/* Active Battles */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-orbitron font-bold text-yellow-400 glitch">Active Battles</div>
            {hasMoreActive && (
              <Button
                variant="outline"
                className="font-orbitron border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => setActivePage(activePage + 1)}
              >
                See More
              </Button>
            )}
          </div>
          {displayedActiveBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {displayedActiveBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No active battles.</div>
          )}
        </div>

        {/* Popular Battles */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-orbitron font-bold text-yellow-400 glitch">Popular Battles</div>
            {hasMorePopular && (
              <Button
                variant="outline"
                className="font-orbitron border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => setPopularPage(popularPage + 1)}
              >
                See More
              </Button>
            )}
          </div>
          {displayedPopularBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {displayedPopularBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No popular battles.</div>
          )}
        </div>

        {/* Tracks (show 5, see more loads 5 more) */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-orbitron font-bold text-yellow-400 glitch">Tracks</div>
            {hasMoreTracks && (
              <Button
                variant="outline"
                className="font-orbitron border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => setTracksPage(tracksPage + 1)}
              >
                See More
              </Button>
            )}
          </div>
          <TrackList tracks={displayedTracks} canUpload={false} rapperId={rapper._id} isOwner={false} />
        </div>
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

export default RapperProfile;