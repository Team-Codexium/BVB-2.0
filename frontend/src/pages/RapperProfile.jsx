import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRapper } from "../contexts/ArtistContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Swords, Trophy, Crown, Star, Target } from "lucide-react";
import TrackList from "../components/TrackList";
import BattleCard from "../components/BattleCard";

const RapperProfile = () => {
  const { id } = useParams();
  const { fetchRapperById, loading, error } = useRapper();
    const [rapper, setRapper] = useState(null);
    const [stats, setStats] = useState(null);
    const [battles, setBattles] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLocalLoading(true);
      const data = await fetchRapperById(id);
      console.log(data);
     
      setRapper(data.rapper);
      setStats(data.stats);
      setLocalLoading(false);
    };
    fetch();
    // eslint-disable-next-line
  }, [id]);

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Skeleton className="w-full h-64" />
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

  // Example stats, adjust as needed
  const battleStats = [
    { title: "Total Battles", value: rapper.totalBattles, icon: Swords, color: "text-blue-600" },
    { title: "Wins", value: rapper.wins, icon: Trophy, color: "text-yellow-600" },
    { title: "Win Rate", value: rapper.winRate + "%", icon: Flame, color: "text-red-600" },
    { title: "Ranking", value: rapper.ranking, icon: Crown, color: "text-purple-600" },
    { title: "Score", value: rapper.score, icon: Star, color: "text-green-600" },
    { title: "Accuracy", value: rapper.accuracy, icon: Target, color: "text-indigo-600" },
  ];

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
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Recent Battles</div>
          {rapper.recentBattles && rapper.recentBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {rapper.recentBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No recent battles.</div>
          )}
        </div>

        {/* Tracks */}
        <div className="w-full mb-12">
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Tracks</div>
          <TrackList tracks={rapper.tracks || []} canUpload={false} rapperId={rapper._id} isOwner={false} />
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

export default RapperProfile