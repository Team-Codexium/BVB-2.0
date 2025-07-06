import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const RapperInfoCard = ({ rapper }) => {
  if (!rapper) return null;
  return (
    <Card className="bg-primary/70 border border-secondary text-white mb-4">
      <CardContent className="flex flex-col items-center p-4">
        <Avatar className="w-20 h-20 mb-2">
          <AvatarImage src={rapper.image || '/default-avatar.png'} alt={rapper.username || rapper.fullName || 'Rapper'} />
          <AvatarFallback>{(rapper.username || rapper.fullName || '?')[0]}</AvatarFallback>
        </Avatar>
        <div className="font-bold text-lg">{rapper.fullName || rapper.username}</div>
        <div className="text-xs text-gray-300 mb-1">@{rapper.username}</div>
        <Badge variant="secondary" className="mb-2">Rank: {rapper.rank ?? 'N/A'}</Badge>
        {/* Add more stats if available */}
        <Button size="sm" variant="outline" className="mt-2" asChild>
          <a href={`/dashboard/artists?search=${rapper.username}`}>View Profile</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RapperInfoCard; 