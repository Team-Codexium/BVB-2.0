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
import { Flame, Trophy, Swords, Crown, Star, Target, TrendingUp, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import UpdateProfile from '../components/UpdateProfile';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const { battles, loading, getBattleByRapperId } = useBattle();
  const [localLoading, setLocalLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

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

  // Filter battles for stats and sections
  const userBattles = useMemo(() => {
    if (!user?._id) return [];
    return (battles || []).filter(
      b => b.rapper1?._id === user._id || b.rapper2?._id === user._id
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
    const vA = (a.rapper1Votes || 0) + (a.rapper2Votes || 0);
    const vB = (b.rapper1Votes || 0) + (b.rapper2Votes || 0);
    return vB - vA;
  }).slice(0, 3);

  // Current battle (first active) Sorting based on status
  const currentBattle = userBattles.find(b => b.status === 'active' || b.status === 'started');

  // User's tracks (from all battles)
  const userTracks = userBattles.flatMap(b => {
    if (b.rapper1?._id === user._id) return b.rapper1Tracks || [];
    if (b.rapper2?._id === user._id) return b.rapper2Tracks || [];
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden py-10 px-2 md:px-4">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10 relative">
        {/* Profile Picture & Info */}
        <div className="relative flex flex-col items-center w-full">
          <Avatar className="w-32 h-32 mb-4 shadow-lg border-4 border-yellow-400">
            <AvatarImage src={user.image || '/default-avatar.png'} alt={user.fullName || user.username || 'User'} />
            <AvatarFallback>{(user.username || user.fullName || '?')[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center mb-6">
            <div className="text-3xl font-orbitron font-bold text-yellow-400 glitch">{user.fullName || user.username}</div>
            <div className="text-md text-pink-400 mb-1 font-orbitron">@{user.username}</div>
          </div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="absolute top-2 right-2 font-orbitron border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                size="icon"
                aria-label="Edit Profile"
              >
                <Pencil className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-2 border-yellow-400 rounded-2xl font-orbitron max-w-md">
              <DialogHeader>
                <DialogTitle className="text-yellow-400">Edit Profile</DialogTitle>
              </DialogHeader>
              <UpdateProfile user={user} onClose={() => setEditOpen(false)} onUpdate={updateUser} />
              <DialogFooter>
                {/* Save/Cancel handled in UpdateProfile */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

        <Separator className="my-8 bg-yellow-400" />

        {/* Current Battle */}
        <div className="w-full mb-12">
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Current Battle</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32 rounded-2xl bg-gray-800/60" />
          ) : currentBattle ? (
            <BattleCard battle={currentBattle} />
          ) : (
            <div className="text-gray-400 font-orbitron">No current battle.</div>
          )}
        </div>

        <Separator className="my-8 bg-yellow-400" />

        {/* Recent Battles */}
        <div className="w-full mb-12">
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Recent Battles</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32 rounded-2xl bg-gray-800/60" />
          ) : recentBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {recentBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No recent battles.</div>
          )}
        </div>

        <Separator className="my-8 bg-yellow-400" />

        {/* Popular Battles */}
        <div className="w-full mb-12">
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Popular Battles</div>
          {localLoading || loading ? (
            <Skeleton className="w-full h-32 rounded-2xl bg-gray-800/60" />
          ) : popularBattles.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-6">
              {popularBattles.map(b => <BattleCard key={b._id} battle={b} />)}
            </div>
          ) : (
            <div className="text-gray-400 font-orbitron">No popular battles.</div>
          )}
        </div>

        <Separator className="my-8 bg-yellow-400" />

        {/* User's Tracks */}
        <div className="w-full mb-12">
          <div className="text-xl font-orbitron font-bold text-yellow-400 mb-4 glitch">Your Tracks</div>
          <TrackList tracks={userTracks} canUpload={true} rapperId={user._id} isOwner={true} />
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

export default Profile;