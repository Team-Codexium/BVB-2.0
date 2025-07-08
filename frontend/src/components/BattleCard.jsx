import React from 'react'
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BattleCard = ({ battle }) => {


    const navigate = useNavigate();
    const r1 = battle.contestants?.rapper1 || {};
    const r2 = battle.contestants?.rapper2 || {};
    const v1 = battle.voting?.rapper1Votes ?? 0;
    const v2 = battle.voting?.rapper2Votes ?? 0;
    const leading = v1 === v2 ? null : v1 > v2 ? 'r1' : 'r2';


    return (
        <div className="w-full flex justify-center">
            <Card
                className="bg-primary/80 border border-secondary text-white cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full sm:w-full lg:max-w-3xl lg:w-[100%] xl:w-[100%] px-2 sm:px-4 py-2"
                onClick={() => navigate(`/dashboard/battle/${battle._id}`)}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    {/* <CardTitle className="text-lg w-full text-center">{battle.title || 'Untitled Battle'}</CardTitle> */}
                    <Badge variant={
                        battle.status === 'open' ? 'outline' :
                            battle.status === 'ongoing' ? 'secondary' :
                                'default'
                    }>
                        {battle.status ? battle.status.charAt(0).toUpperCase() + battle.status.slice(1) : 'Unknown'}
                    </Badge>
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