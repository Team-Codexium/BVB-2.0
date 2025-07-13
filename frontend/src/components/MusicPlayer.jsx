import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Upload, Plus, Trash2 } from "lucide-react"

const MusicPlayer = ({ track, onClose })  =>{
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, track.url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Click outside to close volume popover
  useEffect(() => {
    if (!showVolume) return;
    const handler = (e) => {
      if (!e.target.closest('.volume-popover')) setShowVolume(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [showVolume]);

  return (
    <div className="bg-gray-900/80 rounded-lg p-3 shadow flex flex-col gap-1 relative">
      {/* Title and playtime row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white font-medium truncate max-w-[60%]">{track.title}</span>
        <span className="text-xs text-gray-300 font-mono">{formatTime(progress)} / {formatTime(duration)}</span>
      </div>
      {/* Controls row */}
      <div className="flex items-center gap-2 w-full relative">
        <button
          onClick={handlePlayPause}
          className="text-white bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
        >
          {isPlaying ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSliderChange}
          className="flex-1 accent-purple-500 mx-2"
        />
        {/* Volume icon and popover */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowVolume((v) => !v)}
            className="text-gray-300 hover:text-purple-400 focus:outline-none"
            title="Volume"
            type="button"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M5 9v6h4l5 5V4l-5 5H5z" fill="currentColor"/>
            </svg>
          </button>
          {showVolume && (
            <div className="volume-popover absolute bottom-10 right-1 flex flex-col items-center z-50 p-2 bg-gray-800 rounded shadow-lg">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="accent-purple-500"
                style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical', height: 70 }}
              />
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-400 ml-2"
          title="Close player"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <audio
          ref={audioRef}
          src={track.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onClose}
          style={{ display: "none" }}
          autoPlay
        />
      </div>
    </div>
  );
}

export default MusicPlayer