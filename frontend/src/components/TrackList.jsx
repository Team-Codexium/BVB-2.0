import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Upload, Plus, Trash2 } from "lucide-react"

export default function TrackList({
  tracks,
  artist,
  rapperId,
  onTrackClick,
  onTrackUpload,
  onTrackDelete,
  canUpload,
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [trackName, setTrackName] = useState(`Track ${tracks.length+1}`)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  // Handles file selection and triggers upload
  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith("audio/")) {
      const name = trackName.trim() || file.name.replace(/\.[^/.]+$/, "")
      setUploading(true)
      await onTrackUpload(rapperId, file, name)
      setUploading(false)
      setTrackName("")
      setIsUploading(false)
    } else {
      alert("Please select a valid audio file")
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

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
            className="text-purple-400 hover:text-white hover:bg-purple-900/20"
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
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragOver ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-purple-500"
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

            <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileInput} className="hidden" disabled={uploading} />

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploading(false)}
                className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800"
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track List */}
      <div className="space-y-1">
        {tracks.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {canUpload ? "Upload your first track to get started" : "No tracks uploaded yet"}
          </div>
        ) : (
          tracks.map((track, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => onTrackClick(track, artist, rapperId, i, track.url)}
                className="w-full flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 p-2 rounded transition-colors cursor-pointer group"
              >
                <div
                  className={`w-2 h-2 rounded-full bg-red-400 group-hover:animate-pulse`}
                ></div>
                <span className="group-hover:text-white transition-colors">{track.title || "Title"}</span>
                <Music className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {canUpload && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onTrackDelete(rapperId, i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-6 w-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

