import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VotePanel = ({ rapper1, rapper2, votes1, votes2, onVote, userVote, loading }) => {
  const [anim, setAnim] = useState('');

  const handleVote = (side) => {
    setAnim(side);
    onVote(side);
    setTimeout(() => setAnim(''), 1000);
  };

  return (
    <div className="flex items-center justify-between gap-4 my-4">
      <div className="flex flex-col items-center flex-1">
        <Button
          size="lg"
          className={`bg-red-600 w-24 ${anim === 'r1' ? 'animate-pulse' : ''}`}
          onClick={() => handleVote('r1')}
          disabled={loading || userVote === 'r1'}
        >
          Vote {rapper1?.username || 'Rapper 1'}
        </Button>
        <Badge variant="secondary" className="mt-2">{votes1} votes</Badge>
      </div>
      <div className="mx-2 text-2xl font-bold text-secondary">VS</div>
      <div className="flex flex-col items-center flex-1">
        <Button
          size="lg"
          className={`bg-red-600 w-24 ${anim === 'r2' ? 'animate-pulse' : ''}`}
          onClick={() => handleVote('r2')}
          disabled={loading || userVote === 'r2'}
        >
          Vote {rapper2?.username || 'Rapper 2'}
        </Button>
        <Badge variant="secondary" className="mt-2">{votes2} votes</Badge>
      </div>
    </div>
  );
};

export default VotePanel; 