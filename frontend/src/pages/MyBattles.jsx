import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBattle } from '../contexts/BattleContext';
import BattleCard from '../components/BattleCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MyBattles = () => {
    const { user, token } = useAuth();
    const { battles, loading, error, getBattleByRapperId } = useBattle();
    const [filteredBattles, setFilteredBattles] = useState([]);
    const [localLoading, setLocalLoading] = useState(true);

    // Fetch user's battles
    useEffect(() => {
        const fetchBattles = async () => {
            if (user?._id && token) {
                setLocalLoading(true);
                await getBattleByRapperId(user._id, token);
                setLocalLoading(false);
            }
        };
        fetchBattles();
    }, [token]);
    // console.log(battles)

    // Filter battles by status
    const filterBattlesByStatus = (status) => {
        return (battles || []).filter(battle => {
            const isParticipant = battle.contestants?.rapper1?._id === user?._id || battle.contestants?.rapper2?._id === user?._id;
            return isParticipant && (status === 'all' || battle.status === status);
        });
    };

    // Update filtered battles when battles change
    useEffect(() => {
        setFilteredBattles(filterBattlesByStatus('all'));
    }, [battles, user?._id]);

    const handleTabChange = (value) => {
        setFilteredBattles(filterBattlesByStatus(value));
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
                            My Battles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
                            <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/40 border border-yellow-400 rounded-xl">
                                <TabsTrigger value="all" className="font-orbitron text-yellow-400">All</TabsTrigger>
                                <TabsTrigger value="pending" className="font-orbitron text-yellow-400">Pending</TabsTrigger>
                                <TabsTrigger value="active" className="font-orbitron text-yellow-400">Active</TabsTrigger>
                                <TabsTrigger value="completed" className="font-orbitron text-yellow-400">Completed</TabsTrigger>
                            </TabsList>
                            {["all", "pending", "active", "completed"].map((tab) => (
                                <TabsContent key={tab} value={tab}>
                                    {localLoading || loading ? (
                                        <div className="flex flex-col gap-4">
                                            <Skeleton className="h-32 w-full rounded-2xl bg-gray-800/60" />
                                            <Skeleton className="h-32 w-full rounded-2xl bg-gray-800/60" />
                                        </div>
                                    ) : error ? (
                                        <div className="flex justify-center mb-4">
                                            <span className="text-red-400 font-orbitron">{error}</span>
                                        </div>
                                    ) : filteredBattles.length > 0 ? (
                                        <div className="flex flex-col gap-8">
                                            {filteredBattles.map(battle => (
                                                <BattleCard key={battle._id} battle={battle} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-center py-8 font-orbitron">
                                            {tab === "all"
                                                ? "No battles found."
                                                : tab === "pending"
                                                    ? "No pending battles."
                                                    : tab === "active"
                                                        ? "No active battles."
                                                        : "No completed battles."}
                                        </p>
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
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

export default MyBattles;