import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Clock, Users, Volume2, VolumeX, RotateCcw } from 'lucide-react';

import AudioUpload from '../components/audioUpload';
import { useBattle } from '../contexts/BattleContext';
import { useParams } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'

const BattlePage = () => {
  // states required for music player controls
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  
  //state for battle data form battle context;
  const { battleId } = useParams();
  const {user,token}=useAuth();
  const rapperId=user._id;
  const { battle, getBattleById } = useBattle();
  
  console.log("battle id=",battleId);  
  console.log("rapper id=",rapperId);
  console.log("token=",token); 
  console.log("battle=",battle);

  console.log("rendering battle page");
  const refreshBattle = () => {
    console.log("refreshBattle called with:", battleId, token);
    getBattleById(battleId, token);
  };

  useEffect(() => {
    if (battleId && token) {
      console.log("Calling refreshBattle from useEffect...");
      refreshBattle();
    } else {
      console.log("battleId or token missing:", battleId, token);
    }
  }, [battleId, token]);

  //after this all the functionality of the music player
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setCurrentlyPlaying(null);
    setCurrentTime(0);
  };

  const playTrack = (audioUrl, trackId) => {
    if (audioUrl) {
      if (currentlyPlaying === trackId) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        setCurrentlyPlaying(trackId);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return 'N/A';
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Battle Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const RapperSide = ({ rapper, audioUrls, side, rapperNumber }) => (
    <div className={`flex-1 ${side === 'left' ? 'border-r-2 border-purple-500/30' : ''}`}>
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-xl mb-6 border border-purple-500/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {rapper?.username?.charAt(0).toUpperCase() || `R${rapperNumber}`}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {rapper?.username || `Rapper ${rapperNumber}`}
            </h3>
            <p className="text-purple-300">{audioUrls?.length || 0} tracks uploaded</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
          <Users className="mr-2" size={20} />
          Rapper {rapperNumber}'s Tracks
        </h4>
        
        {audioUrls && audioUrls.length > 0 ? (
          audioUrls.map((audioItem, index) => (
            <div key={`${rapperNumber}-${index}`} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-white font-semibold">Track {index + 1}</h5>
                <span className="text-gray-400 text-sm">
                  {battle?.createdAt ? new Date(battle.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => playTrack(audioItem.url, `${rapperNumber}-${index}`)}
                  disabled={!audioItem.url}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    audioItem.url 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentlyPlaying === `${rapperNumber}-${index}` && isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                    <span>Audio Track</span>
                    {currentlyPlaying === `${rapperNumber}-${index}` && (
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    )}
                  </div>
                  
                  {currentlyPlaying === `${rapperNumber}-${index}` && (
                    <div className="w-full bg-gray-700 rounded-full h-2 cursor-pointer" onClick={handleSeek}>
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 text-center">
            <p className="text-gray-400">No tracks uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );

  if (!battle) {
    return (
      <div className="min-h-screen bg-custom-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading battle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-gradient text-white">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rap Battle
              </h1>
              <p className={`mt-2 font-semibold ${getStatusColor(battle.status)}`}>
                Status: {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
              </p>
              <div className="mt-2 text-sm text-gray-400">
                <p>{battle.contestants.rapper1.username} Votes: {battle.voting?.rapper1Votes || 0}</p>
                <p>{battle.contestants.rapper2.username} Votes: {battle.voting?.rapper2Votes || 0}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-purple-300">
                <Clock size={20} />
                <span className="text-xl font-semibold">
                  {battle.timeLimit || 'N/A'} min limit
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {battle.status === 'active' ? 
                  `Time remaining: ${formatTimeRemaining(battle.endTime)}` :
                  'Battle not active'
                }
              </p>
              {battle.winner && (
                <p className="text-green-400 text-sm mt-1">
                  Winner: {battle.winner.username || 'Declared'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
               <div className='fixed left-280'>
        <AudioUpload
        battleId={battleId}
        rapperId={rapperId}
        onUpload={refreshBattle}
       
      />
      </div>
      {/* Battle Arena */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex space-x-6">
          <RapperSide 
            rapper={battle.contestants?.rapper1} 
            audioUrls={battle.rapper1_audio_urls} 
            side="left" 
            rapperNumber={1}
          />
          <RapperSide 
            rapper={battle.contestants?.rapper2} 
            audioUrls={battle.rapper2_audio_urls} 
            side="right" 
            rapperNumber={2}
          />
        </div>
      </div>

     

      {/* Audio Controls */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-purple-500/30 p-4">
          <div className="max-w-6xl mx-auto flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-purple-500"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <p className="text-white font-semibold">Now Playing</p>
              <p className="text-gray-300 text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
            
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattlePage;