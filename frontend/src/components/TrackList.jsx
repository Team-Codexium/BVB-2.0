import React from 'react';
import AudioUpload from './audioUpload';

const TrackList = ({ tracks = [], canUpload, onUpload, rapperId, battleId, isOwner }) => {
  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">Tracks</div>
      {tracks.length === 0 && <div className="text-xs text-gray-400 mb-2">No tracks uploaded yet.</div>}
      <ul className="space-y-2">
        {tracks.map((track, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <audio controls src={track.url} className="w-40" />
            {/* Optionally, show upload date or delete button if isOwner */}
          </li>
        ))}
      </ul>
      {canUpload && (
        <div className="mt-2">
          <AudioUpload battleId={battleId} rapperId={rapperId} onUpload={onUpload} />
        </div>
      )}
    </div>
  );
};

export default TrackList; 