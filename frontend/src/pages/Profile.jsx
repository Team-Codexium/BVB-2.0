import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBattle } from '../contexts/BattleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import TrackList from '../components/TrackList';
import BattleCard from '../components/BattleCard';
import { Flame, Trophy, Swords, Crown, Star, Target, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const { battles, loading, getBattleByRapperId } = useBattle();
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch user's battles on mount
  useEffect(() => {
    const fetch = async () => {
      if (user?._id && token) {
        setLocalLoading(true);
        await getBattleByRapperId(user._id, token);
        setLocalLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line
  }, [user?._id, token]);

  // console.log(battles);

  // Filter battles for stats and sections
  const userBattles = useMemo(() => {
    if (!user?._id) return [];
    return (battles || []).filter(
      b => b.contestants?.rapper1?._id === user._id || b.contestants?.rapper2?._id === user._id
    );
  }, [battles, user?._id]);

  // Battle stats (mocked if not available)
  const totalBattles = userBattles.length;
  const wins = userBattles.filter(b => b.winner?._id === user?._id).length;
  const winRate = totalBattles ? Math.round((wins / totalBattles) * 100) : 0;
  const ranking = user?.rank || '#--';
  const score = user?.score || 0;
  const accuracy = 'N/A'; // TODO: If available

  // Recent battles (sorted by createdAt desc)
  const recentBattles = [...userBattles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  // Popular battles (sorted by votes desc)
  const popularBattles = [...userBattles].sort((a, b) => {
    const vA = (a.voting?.rapper1Votes || 0) + (a.voting?.rapper2Votes || 0);
    const vB = (b.voting?.rapper1Votes || 0) + (b.voting?.rapper2Votes || 0);
    return vB - vA;
  }).slice(0, 3);
  
  // Current battle (first active) Sorting based on status
  const currentBattle = userBattles.find(b => b.status === 'active' || b.status === 'started');

  // User's tracks (from all battles)
  const userTracks = userBattles.flatMap(b => {
    if (b.contestants?.rapper1?._id === user._id) return b.rapper1_audio_urls || [];
    if (b.contestants?.rapper2?._id === user._id) return b.rapper2_audio_urls || [];
    return [];
  });

  // Battle stats cards
  const battleStats = [
    { title: 'Total Battles', value: totalBattles, icon: Swords, color: 'text-blue-600', change: '', changeType: 'positive' },
    { title: 'Wins', value: wins, icon: Trophy, color: 'text-yellow-600', change: '', changeType: 'positive' },
    { title: 'Win Rate', value: `${winRate}%`, icon: Flame, color: 'text-red-600', change: '', changeType: 'positive' },
    { title: 'Ranking', value: ranking, icon: Crown, color: 'text-purple-600', change: '', changeType: 'positive' },
    { title: 'Score', value: score, icon: Star, color: 'text-green-600', change: '', changeType: 'positive' },
    { title: 'Accuracy', value: accuracy, icon: Target, color: 'text-indigo-600', change: '', changeType: 'positive' },
  ];

  if (!user) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Skeleton className="w-full h-64" /></div>;
  }

  return (
    <div className="min-h-screen bg-custom-gradient py-10 px-2 md:px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Profile Picture */}
        <Avatar className="w-32 h-32 mb-4 shadow-lg border-4 border-secondary">
          <AvatarImage src={user.image || '/default-avatar.png'} alt={user.fullName || user.username || 'User'} />
          <AvatarFallback>{(user.username || user.fullName || '?')[0]}</AvatarFallback>
        </Avatar>
        {/* Basic Info */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-secondary dark:text-white">{user.fullName || user.username}</div>
          <div className="text-md text-gray-300 mb-1">@{user.username}</div>
          {/* <Badge variant="secondary" className="mb-2">Rank: {user.rank ?? 'N/A'}</Badge> */}
          {/* <div className="text-sm text-gray-400">{user.email}</div> */}
        </div>
        {/* Battle Stats */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {battleStats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    {stat.change && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Separator className="my-6" />
        {/* Current Battle */}
        <div className="w-full mb-8">
          <div className="text-xl font-bold text-secondary mb-2">Current Battle</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32" />
          ) : currentBattle ? (
            <BattleCard battle={currentBattle} />
          ) : (
            <div className="text-gray-400">No current battle.</div>
          )}
        </div>
        <Separator className="my-6" />
        {/* Recent Battles */}
        <div className="w-full mb-8">
          <div className="text-xl font-bold text-secondary mb-2">Recent Battles</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32" />
          ) : recentBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-5">
              {recentBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400">No recent battles.</div>
          )}
        </div>
        <Separator className="my-6" />
        {/* Popular Battles */}
        <div className="w-full mb-8">
          <div className="text-xl font-bold text-secondary mb-2">Popular Battles</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32" />
          ) : popularBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-5">
              {popularBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400">No popular battles.</div>
          )}
        </div>
        <Separator className="my-6" />
        {/* User's Tracks */}
        <div className="w-full mb-8">
          <div className="text-xl font-bold text-secondary mb-2">Your Tracks</div>
          <TrackList tracks={userTracks} canUpload={true} rapperId={user._id} isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default Profile;