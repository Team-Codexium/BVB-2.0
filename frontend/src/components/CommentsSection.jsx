import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const CommentsSection = ({ comments = [], onAddComment, user, loading }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onAddComment(text);
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <div className="font-semibold mb-2">Comments</div>
      <div className="space-y-4 mb-4">
        {comments.length === 0 && <div className="text-xs text-gray-400">No comments yet. Be the first!</div>}
        {comments.map((c, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={c.user?.image || '/default-avatar.png'} />
              <AvatarFallback>{(c.user?.username || '?')[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-bold">{c.user?.username || 'User'}</div>
              <div className="text-sm text-gray-200">{c.text}</div>
              <div className="text-[10px] text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
            </div>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            disabled={submitting || loading}
            className="flex-1"
          />
          <Button type="submit" disabled={submitting || loading || !text.trim()} className="bg-red-600">Post</Button>
        </form>
      )}
    </div>
  );
};

export default CommentsSection; 