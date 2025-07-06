import React from 'react';
import { Badge } from '@/components/ui/badge';

const BattleInfoHeader = ({ status, createdAt, timeLimit, endTime, votes1, votes2 }) => {
  const statusMap = {
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  let timeInfo = '';
  if (status === 'active' && endTime) {
    const left = Math.max(0, new Date(endTime) - Date.now());
    const min = Math.floor(left / 60000);
    const sec = Math.floor((left % 60000) / 1000);
    timeInfo = `Time left: ${min}m ${sec}s`;
  } else if (createdAt) {
    timeInfo = `Started: ${new Date(createdAt).toLocaleString()}`;
  }
  return (
    <div className="flex flex-col items-center mb-4">
      <Badge variant="outline" className={`mb-1 h-8 w-32 text-xl ${status === 'Pending' ? "bg-yellow-500" : status === "Active" ? "bg-green-600" : status === "Completed" ? "bg-gray-700" : "bg-red-600"}`}>{statusMap[status] || status}</Badge>
      <div className="text-xs text-gray-300">{timeInfo}</div>
      <div className="text-xs text-gray-400 mt-1">Total votes: {votes1 + votes2}</div>
    </div>
  );
};

export default BattleInfoHeader; 