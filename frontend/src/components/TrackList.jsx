import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Upload, Plus, Trash2 } from "lucide-react"
import MusicPlayer from "./MusicPlayer"



export default function TrackList({
  tracks,
  rapperId,
  onTrackUpload,
  onTrackDelete,
  canUpload,
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [trackName, setTrackName] = useState(`Track ${tracks.length + 1}`)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Handles file selection and triggers upload
  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    } else {
      alert("Please select a valid audio file");
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    } else {
      alert("Please select a valid audio file");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTrackName(`Track ${tracks.length + 1}`);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await onTrackUpload(rapperId, selectedFile, trackName.trim() || selectedFile.name.replace(/\.[^/.]+$/, ""));
    setUploading(false);
    setSelectedFile(null);
    setTrackName(`Track ${tracks.length + 1}`);
    setIsUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Music className="w-4 h-4" />
          Tracks ({tracks.length})
        </h3>
        {canUpload && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsUploading(!isUploading)}
            className="text-purple-400 hover:text-white hover:bg-purple-900/20 cursor-pointer"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Track
          </Button>
        )}
      </div>

      {/* Upload Section */}
      {isUploading && canUpload && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-3 space-y-3">
            <Input
              placeholder="Track name (optional)"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
              disabled={uploading}
            />
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dragOver ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-purple-500"
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400 mb-2">
                  Drag & drop your audio file here, or{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-400 hover:text-purple-300 underline"
                    type="button"
                    disabled={uploading}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">Supports MP3, WAV, M4A, OGG</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-900 p-2 rounded">
                <span className="text-gray-300 text-sm">{selectedFile.name}</span>
                <div className="flex gap-2">
                  <Button
                    className="bg-fuchsia-100 cursor-pointer hover:bg-yellow-400"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Change
                  </Button>
                  <Button
                    className="bg-red-400 cursor-pointer hover:bg-red-600"
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveFile}
                    disabled={uploading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileInput} className="hidden" disabled={uploading} />

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploading(false)}
                className="flex-1 border-gray-600 text-gray-800 hover:bg-gray-800 hover:text-gray-400 cursor-pointer"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleUpload}
                className="flex-1 cursor-pointer"
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <Upload className="w-4 h-4 mr-1" />
                )}
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track List */}
      <div className="space-y-2">
        {tracks.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {canUpload ? "Upload your first track to get started" : "No tracks uploaded yet"}
          </div>
        ) : (
          tracks.map((track, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div
                key={i}
                className={`transition-all duration-300 rounded-xl shadow-md bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/60 ${isExpanded ? 'ring-2 ring-purple-500/70 scale-[1.02] bg-gradient-to-br from-purple-900/80 to-pink-900/60' : ''}`}
              >
                <div className="flex items-center px-4 py-3 cursor-pointer" onClick={() => setExpandedIndex(isExpanded ? null : i)}>
                  <button
                    className={`mr-3 flex items-center justify-center w-9 h-9 rounded-full transition-colors ${isExpanded ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg' : 'bg-gray-800 hover:bg-purple-700/80'}`}
                  >
                    {isExpanded ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" /></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
                    )}
                  </button>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm truncate">{track.title || `Track ${i + 1}`}</span>
                    <span className="text-xs text-gray-400 truncate">Audio Track</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-4 min-w-[70px] text-right">{track.date || new Date().toLocaleDateString()}</span>
                  {canUpload && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => { e.stopPropagation(); onTrackDelete(rapperId, i); }}
                      className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-6 w-6"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <MusicPlayer track={track} onClose={() => setExpandedIndex(null)} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

