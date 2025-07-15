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
        <div className="w-full flex justify-center mb-2">
            <Card
                className="bg-primary/80 border border-secondary text-white cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full sm:w-full lg:max-w-3xl lg:w-[100%] xl:w-[100%] px-2 sm:px-4 py-2"
                onClick={() => navigate(`/dashboard/battle/${battle._id}`)}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg w-full text-center">{battle.title || 'Untitled Battle'}</CardTitle>
                    <div>
                        <Badge
                            variant="outline"
                            className={
                                battle.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' :
                                battle.status === 'active' ? 'bg-green-500/20 border-green-500 text-green-300' :
                                battle.status === 'completed' ? 'bg-gray-500/20 border-gray-500 text-gray-300' : ''
                            }
                        >
                            {battle.status ? battle.status.charAt(0).toUpperCase() + battle.status.slice(1) : 'Unknown'}
                        </Badge>
                        {canAccept && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 h-auto py-1 px-2 text-xs backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
                                onClick={handleAccept}
                                disabled={battleLoading}
                            >{battleLoading ? 'Accepting...' : 'Accept'}</Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-6">
                        {/* Rapper 1 */}
                        <div className={`flex gap-5 justify-center items-center flex-1 ${leading === 'r1' ? 'bg-secondary/30 rounded-lg p-2' : ''}`}>
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={r1.image || '/default-avatar.png'} alt={r1.username || r1.fullName || 'Rapper 1'} />
                                <AvatarFallback>{(r1.username || r1.fullName || '?')[0]}</AvatarFallback>
                            </Avatar>
                            <div>

                            <div className="font-semibold text-base truncate max-w-[7rem]">{r1.fullName || r1.username || 'Rapper 1'}</div>
                            <Badge variant="secondary" className={`mt-1 ${leading === 'r1' ? 'border-2 border-yellow-400' : ''}`}>{v1} votes</Badge>
                            </div>
                        </div>
                        {/* VS */}
                      
                        <div className="mx-2 text-2xl font-bold text-secondary">VS</div>
                        {/* Rapper 2 */}
                        <div className={`flex gap-5 justify-center items-center flex-1 ${leading === 'r2' ? 'bg-secondary/30 rounded-lg p-2' : ''}`}>
                            <div>
                                <div className="font-semibold text-base truncate max-w-[7rem]">{r2.fullName || r2.username || 'Rapper 2'}</div>
                                <Badge variant="secondary" className={`mt-1 ${leading === 'r2' ? 'border-2 border-yellow-400' : ''}`}>{v2} votes</Badge>
                            </div>
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={r2.image || '/default-avatar.png'} alt={r2.username || r2.fullName || 'Rapper 2'} />
                                <AvatarFallback>{(r2.username || r2.fullName || '?')[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-300 text-center">
                        <span><span className="font-semibold">Date:</span> {battle.createdAt ? new Date(battle.createdAt).toLocaleString() : 'Unknown'}</span>
                        
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BattleCard