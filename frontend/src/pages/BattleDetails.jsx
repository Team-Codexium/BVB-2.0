import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { useParams } from "react-router-dom"
import { useBattle } from "../contexts/BattleContext"
import { useAuth } from "../contexts/AuthContext"
import {TrackList,VotingComponent} from "../components"
import axios from "axios"
import { Alert } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function BattleDetails() {
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [userVote, setUserVote] = useState(null)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState("")

  const { battleId } = useParams()
  const { getBattleById, battle } = useBattle()
  const { token, user } = useAuth()
  console.log("battle in Battle deatail = ",battle);
  const refreshBattle = () => {
    getBattleById(battleId, token)
  }

  // Function to calculate time remaining
  const calculateTimeRemaining = (endTime) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const timeDiff = end - now

    if (timeDiff <= 0) {
      return "Battle has ended"
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} and ${hours} hr${hours > 1 ? 's' : ''} remains`
    } else if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} and ${minutes} min${minutes > 1 ? 's' : ''} remains`
    } else {
      return `${minutes} min${minutes > 1 ? 's' : ''} remains`
    }
  }

  useEffect(() => {
    refreshBattle()
  }, [battleId, token])

  useEffect(() => {
    if (battle?.timeLimit) {
      const updateTimeAndProgress = () => {
        const now = new Date().getTime()
        const end = new Date(battle.timeLimit).getTime()
        const created = new Date(battle.createdAt).getTime()
        
        // Calculate progress
        const percent = Math.max(0, Math.min(100, ((now - created) / (end - created)) * 100))
        setProgress(percent)
        
        // Calculate time remaining
        const remaining = calculateTimeRemaining(battle.timeLimit)
        setTimeRemaining(remaining)
      }

      // Update immediately
      updateTimeAndProgress()
      
      // Update every minute
      const interval = setInterval(updateTimeAndProgress, 60000)

      return () => clearInterval(interval)
    }
  }, [battle?.timeLimit, battle?.createdAt])

  const rapper1 = battle?.rapper1
  const rapper2 = battle?.rapper2
  const votes = {
    rapper1: battle?.rapper1Votes || 0,
    rapper2: battle?.rapper2Votes || 0,
  }

  const totalVotes = votes.rapper1 + votes.rapper2
  const rapper1Percent = totalVotes === 0 ? 50 : (votes.rapper1 / totalVotes) * 100
  const battleStatus = battle?.status

  const handleTrackUpload = async (rapperId, file, title) => {
    if (!battleId || !rapperId || !file) return
    const formData = new FormData()
    formData.append("audio", file)
    formData.append("title", title)

    try {
      await axios.post(
        `http://localhost:4000/api/media/${battleId}/${rapperId}/add-audio`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setAlertMsg("Track uploaded successfully!")
      refreshBattle()
    } catch {
      setAlertMsg("Failed to upload track.")
    }
  }

  if (loading || !battle?.rapper1 || !battle?.rapper2) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden py-8 px-2">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      <div className="max-w-6xl mx-auto space-y-10 z-10 relative">
        {alertMsg && (
          <Alert className="mb-4 font-orbitron text-yellow-400 bg-black/80 border-yellow-400" onClick={() => setAlertMsg("")}>
            {alertMsg}
          </Alert>
        )}

        {/* Battle Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-orbitron font-bold text-yellow-400 glitch">{battle?.title}</h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400 font-orbitron">
              <Calendar className="w-3 h-3 mr-1" />
             {battle.timeLimit}
            </Badge>
            <Badge variant="outline" className="border-pink-500 text-pink-400 font-orbitron">
              Status: {battle?.status}
            </Badge>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Progress value={progress} className="w-[60%] bg-yellow-900/30" />
            <div className="font-orbitron font-medium text-sm text-yellow-400">
              {timeRemaining}
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rapper 1 Card */}
          <Card className="bg-black/60 border-2 border-purple-400 rounded-2xl shadow-lg font-orbitron">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 overflow-hidden border-2 border-yellow-400 shadow">
                <img src={rapper1?.image || "/default-avatar.png"} alt="" className="object-cover w-full h-full" />
              </div>
              <CardTitle className="text-yellow-400 text-xl glitch">{rapper1?.username}</CardTitle>
              <p className="text-gray-400">The Lightning Lyricist</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrackList
                tracks={Array.isArray(battle?.rapper1_audio_urls) ? battle.rapper1_audio_urls : []}
                artist={rapper1?.username}
                rapperId={rapper1?._id}
                onTrackUpload={handleTrackUpload}
                onTrackDelete={() => {}}
                canUpload={user?._id === rapper1?._id}
              />

              <VotingComponent
                rapperId={rapper1?._id}
                rapperName={rapper1?.username}
                currentVotes={votes.rapper1}
                hasVoted={userVote !== null}
                votedForThisRapper={userVote === rapper1?._id}
                isContestant={user?._id === rapper1?._id}
                battleStatus={battleStatus}
                onVote={() => setUserVote(battleId,rapper1?._id,1)}
              />
            </CardContent>
          </Card>

          {/* Rapper 2 Card */}
          <Card className="bg-black/60 border-2 border-pink-400 rounded-2xl shadow-lg font-orbitron">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-800 rounded-full mx-auto mb-4 overflow-hidden border-2 border-yellow-400 shadow">
                <img src={rapper2?.image || "/default-avatar.png"} alt="" className="object-cover w-full h-full" />
              </div>
              <CardTitle className="text-yellow-400 text-xl glitch">{rapper2?.username}</CardTitle>
              <p className="text-gray-400">Fire on the Mic</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrackList
                tracks={Array.isArray(battle?.rapper2Tracks) ? battle.rapper2Tracks: []}
                artist={rapper2?.username}
                rapperId={rapper2?._id}
                onTrackUpload={handleTrackUpload}
                onTrackDelete={() => {}}
                canUpload={user?._id === rapper2?._id}
              />

              <VotingComponent
                rapperId={rapper2?._id}
                rapperName={rapper2?.username}
                currentVotes={votes.rapper2}
                hasVoted={userVote !== null}
                votedForThisRapper={userVote === rapper2?._id}
                isContestant={user?._id === rapper2?._id}
                battleStatus={battleStatus}
                onVote={() => setUserVote(battleId,rapper2?._id,2)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Battle Stats */}
        <Card className="bg-black/60 border-2 border-yellow-400 rounded-2xl shadow-lg font-orbitron">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-yellow-400 font-bold text-lg glitch">Battle Statistics</h3>
              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{votes.rapper1}</div>
                  <div className="text-sm text-gray-400">{rapper1?.username}</div>
                </div>
                <div className="text-pink-400 text-xl font-orbitron">VS</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{votes.rapper2}</div>
                  <div className="text-sm text-gray-400">{rapper2?.username}</div>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${rapper1Percent}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .glitch {
            animation: glitch 1.5s infinite linear alternate-reverse;
            position: relative;
            color: transparent;
            background: linear-gradient(90deg,#facc15,#f472b6,#a78bfa);
            background-clip: text;
            -webkit-background-clip: text;
            text-shadow: 0 0 8px #facc15, 0 0 2px #fff;
          }
          @keyframes glitch {
            0% { text-shadow: 2px 0 #facc15, -2px 0 #f472b6; }
            20% { text-shadow: -2px 2px #a78bfa, 2px -2px #fff; }
            40% { text-shadow: 2px 2px #facc15, -2px -2px #f472b6; }
            60% { text-shadow: -2px 0 #a78bfa, 2px 0 #fff; }
            80% { text-shadow: 2px -2px #facc15, -2px 2px #f472b6; }
            100% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
          }
        `}
      </style>
    </div>
  )
}