import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ 
  audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  trackTitle = "Sample Track"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Use the passed audioUrl prop
  const audioSrc = audioUrl;

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      setIsLoading(false);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback failed:', error);
      setError('Playback failed');
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-full px-4 py-2 shadow-lg max-w-2xl mx-auto">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading || error}
          className={`p-2 rounded-full text-white transition-colors duration-200 flex-shrink-0 ${
            isLoading || error 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            isPlaying ? <Pause size={16} /> : <Play size={16} />
          )}
        </button>

        {/* Time Display */}
        <div className="text-white text-sm font-mono flex-shrink-0">
          {formatTime(currentTime)}
        </div>

        {/* Progress Bar */}
        <div className="flex-1 mx-2">
          <div 
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer relative"
            onClick={handleProgressChange}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Duration */}
        <div className="text-gray-400 text-sm font-mono flex-shrink-0">
          {formatTime(duration)}
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;