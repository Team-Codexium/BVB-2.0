import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useBattle } from '../contexts/BattleContext';
import { useAuth } from '../contexts/AuthContext';
import RapperInfoCard from '../components/RapperInfoCard';
import TrackList from '../components/TrackList';
import VotePanel from '../components/VotePanel';
import BattleInfoHeader from '../components/BattleInfoHeader';
import CommentsSection from '../components/CommentsSection';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy comments for now
const dummyComments = [
  // { user: { username: 'fan1', image: '' }, text: 'This is fire!', createdAt: new Date() },
];

export default function BattleDetails() {
  const { battleId } = useParams();
  const { getBattleById, battle, loading, error } = useBattle();
  const { token, user } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [comments, setComments] = useState(dummyComments);
  const [voteLoading, setVoteLoading] = useState(false);
  const [userVote, setUserVote] = useState(null); // 'r1' or 'r2'

  // Fetch battle on mount
  useEffect(() => {
    const fetchBattle = async () => {
      setLocalLoading(true);
      await getBattleById(battleId, token);
      setLocalLoading(false);
    };
    if (battleId && token) fetchBattle();
  }, [battleId, token]);

  // Dummy vote handler (replace with real API call)
  const handleVote = useCallback((side) => {
    setVoteLoading(true);
    setTimeout(() => {
      setUserVote(side);
      setVoteLoading(false);
    }, 800);
  }, []);

  // Dummy comment handler (replace with real API call)
  const handleAddComment = async (text) => {
    setComments([
      ...comments,
      { user, text, createdAt: new Date() },
    ]);
  };

  if (localLoading || loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Skeleton className="w-full h-64" /></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }
  if (!battle) {
    return <div className="text-center text-gray-400 mt-10">Battle not found.</div>;
  }

  const r1 = battle.contestants?.rapper1 || {};
  const r2 = battle.contestants?.rapper2 || {};
  const v1 = battle.voting?.rapper1Votes ?? 0;
  const v2 = battle.voting?.rapper2Votes ?? 0;
  const tracks1 = battle.rapper1_audio_urls || [];
  const tracks2 = battle.rapper2_audio_urls || [];
  const isRapper1 = user && user._id === r1._id;
  const isRapper2 = user && user._id === r2._id;
  const canUpload1 = isRapper1 && battle.status === 'active';
  const canUpload2 = isRapper2 && battle.status === 'active';

  return (
    <div className="min-h-[90vh] w-full bg-custom-gradient flex flex-col items-center py-10 px-2 md:px-0">
      <div className="w-full max-w-5xl mx-auto">
        <BattleInfoHeader
          status={battle.status}
          createdAt={battle.createdAt}
          timeLimit={battle.timeLimit}
          endTime={battle.endTime}
          votes1={v1}
          votes2={v2}
        />
        <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-between mt-8">
          {/* Rapper 1 Side */}
          <section className="flex-1 flex flex-col items-center bg-primary/30 rounded-2xl p-6 md:p-8 shadow-lg border border-secondary/30 min-w-[260px]">
            <RapperInfoCard rapper={r1} />
            <TrackList
              tracks={tracks1}
              canUpload={canUpload1}
              onUpload={() => getBattleById(battleId, token)}
              rapperId={r1._id}
              battleId={battle._id}
              isOwner={isRapper1}
            />
          </section>
          {/* Center VS and Voting */}
          <section className="flex flex-col items-center justify-center min-w-[120px]">
            <VotePanel
              rapper1={r1}
              rapper2={r2}
              votes1={v1}
              votes2={v2}
              onVote={handleVote}
              userVote={userVote}
              loading={voteLoading}
            />
          </section>
          {/* Rapper 2 Side */}
          <section className="flex-1 flex flex-col items-center bg-primary/30 rounded-2xl p-6 md:p-8 shadow-lg border border-secondary/30 min-w-[260px]">
            <RapperInfoCard rapper={r2} />
            <TrackList
              tracks={tracks2}
              canUpload={canUpload2}
              onUpload={() => getBattleById(battleId, token)}
              rapperId={r2._id}
              battleId={battle._id}
              isOwner={isRapper2}
            />
          </section>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-12">
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            user={user}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
