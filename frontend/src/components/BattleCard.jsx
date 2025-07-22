import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBattle } from '../contexts/BattleContext';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BattleCard = ({ battle }) => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { acceptBattle, loading: battleLoading } = useBattle();

    const r1 = battle.contestants?.rapper1 || {};
    const r2 = battle.contestants?.rapper2 || {};
    const v1 = battle.voting?.rapper1Votes ?? 0;
    const v2 = battle.voting?.rapper2Votes ?? 0;
    const leading = v1 === v2 ? null : v1 > v2 ? 'r1' : 'r2';

    const handleAccept = async (e) => {
        e.stopPropagation();
        if (!token || !battle._id) return;
        const res = await acceptBattle(battle._id, token);
        // You might want to refresh the list of battles here
        if (res) {
            console.log("Accepted");
        }

    }
    // console.log(battles)
    //Checking if current rapper is opponent 2
    const isRapper2 = user && user._id === r2._id;
    const canAccept = battle.status === 'pending' && isRapper2;


    return (
        <div className="w-full flex justify-center mb-6">
            <Card
                className="bg-black/70 border-2 border-yellow-400 text-white cursor-pointer hover:shadow-2xl transition-shadow duration-200 w-full sm:w-full lg:max-w-3xl px-4 py-4 rounded-2xl font-orbitron"
                onClick={() => navigate(`/battle/${battle._id}`)}
            >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl w-full text-center text-yellow-400 glitch">{battle.title || 'Untitled Battle'}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={
                                battle.status === 'pending'
                                ? 'bg-yellow-400/10 border-yellow-400 text-yellow-300 font-orbitron'
                                : battle.status === 'active'
                                ? 'bg-green-400/10 border-green-400 text-green-300 font-orbitron'
                                : battle.status === 'completed'
                                ? 'bg-gray-400/10 border-gray-400 text-gray-300 font-orbitron'
                                : 'font-orbitron'
                            }
                        >
                            {battle.status ? battle.status.charAt(0).toUpperCase() + battle.status.slice(1) : 'Unknown'}
                        </Badge>
                        {canAccept && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 h-auto py-1 px-3 text-xs bg-yellow-400 text-black border-yellow-400 font-orbitron rounded-lg hover:bg-yellow-500 hover:text-black transition"
                                onClick={handleAccept}
                                disabled={battleLoading}
                            >
                                {battleLoading ? 'Accepting...' : 'Accept'}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                        {/* Rapper 1 */}
                        <div className={`flex gap-5 justify-center items-center flex-1 ${leading === 'r1' ? 'bg-yellow-400/10 rounded-xl p-2' : ''}`}>
                            <Avatar className="w-16 h-16 border-2 border-pink-400 shadow">
                                <AvatarImage src={r1.image || '/default-avatar.png'} alt={r1.username || r1.fullName || 'Rapper 1'} />
                                <AvatarFallback>{(r1.username || r1.fullName || '?')[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold text-base text-yellow-400 truncate max-w-[7rem]">{r1.fullName || r1.username || 'Rapper 1'}</div>
                                <Badge variant="secondary" className={`mt-1 font-orbitron ${leading === 'r1' ? 'border-2 border-yellow-400' : ''}`}>{v1} votes</Badge>
                            </div>
                        </div>
                        {/* VS */}
                        <div className="mx-2 text-2xl font-bold text-pink-400 font-orbitron select-none">VS</div>
                        {/* Rapper 2 */}
                        <div className={`flex gap-5 justify-center items-center flex-1 ${leading === 'r2' ? 'bg-yellow-400/10 rounded-xl p-2' : ''}`}>
                            <div>
                                <div className="font-bold text-base text-yellow-400 truncate max-w-[7rem]">{r2.fullName || r2.username || 'Rapper 2'}</div>
                                <Badge variant="secondary" className={`mt-1 font-orbitron ${leading === 'r2' ? 'border-2 border-yellow-400' : ''}`}>{v2} votes</Badge>
                            </div>
                            <Avatar className="w-16 h-16 border-2 border-pink-400 shadow">
                                <AvatarImage src={r2.image || '/default-avatar.png'} alt={r2.username || r2.fullName || 'Rapper 2'} />
                                <AvatarFallback>{(r2.username || r2.fullName || '?')[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-4 text-xs text-gray-300 text-center">
                        <span>
                            <span className="font-semibold text-yellow-400">Date:</span>{" "}
                            {battle.createdAt ? new Date(battle.createdAt).toLocaleString() : 'Unknown'}
                        </span>
                    </div>
                </CardContent>
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
            </Card>
        </div>
    )
}

export default BattleCard