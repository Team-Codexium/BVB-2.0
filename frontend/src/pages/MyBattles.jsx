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
        <div className="min-h-screen p-6 bg-custom-gradient">
            <div className="max-w-5xl mx-auto">
                <Card className="border-secondary/30 bg-black/20 text-white backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-secondary text-center">My Battles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                {localLoading || loading ? (
                                    <div className="flex flex-col gap-4">
                                        <Skeleton className="h-32 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                ) : error ? (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                ) : filteredBattles.length > 0 ? (
                                    filteredBattles.map(battle => (
                                        <BattleCard key={battle._id} battle={battle} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No battles found.</p>
                                )}
                            </TabsContent>
                            <TabsContent value="pending">
                                {localLoading || loading ? (
                                    <div className="flex flex-col gap-4">
                                        <Skeleton className="h-32 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                ) : error ? (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                ) : filteredBattles.length > 0 ? (
                                    filteredBattles.map(battle => (
                                        <BattleCard key={battle._id} battle={battle} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No pending battles.</p>
                                )}
                            </TabsContent>
                            <TabsContent value="active">
                                {localLoading || loading ? (
                                    <div className="flex flex-col gap-4">
                                        <Skeleton className="h-32 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                ) : error ? (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                ) : filteredBattles.length > 0 ? (
                                    filteredBattles.map(battle => (
                                        <BattleCard key={battle._id} battle={battle} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No active battles.</p>
                                )}
                            </TabsContent>
                            <TabsContent value="completed">
                                {localLoading || loading ? (
                                    <div className="flex flex-col gap-4">
                                        <Skeleton className="h-32 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                ) : error ? (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                ) : filteredBattles.length > 0 ? (
                                    filteredBattles.map(battle => (
                                        <BattleCard key={battle._id} battle={battle} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No completed battles.</p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MyBattles;