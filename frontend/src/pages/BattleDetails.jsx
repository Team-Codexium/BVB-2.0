import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { useParams } from "react-router-dom"
import { useBattle } from "../contexts/BattleContext"
import { useAuth } from "../contexts/AuthContext"
import TrackList from "../components/TrackList"
import axios from "axios"
import { Alert } from "@/components/ui/alert"
import VotingComponent from "../components/VotePanel"
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

  const rapper1 = battle?.contestants?.rapper1
  const rapper2 = battle?.contestants?.rapper2
  const votes = {
    rapper1: battle?.voting?.rapper1Votes || 0,
    rapper2: battle?.voting?.rapper2Votes || 0,
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

  if (loading || !battle?.contestants) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {alertMsg && (
          <Alert className="mb-4" onClick={() => setAlertMsg("")}>
            {alertMsg}
          </Alert>
        )}

        {/* Battle Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {battle?.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Calendar className="w-3 h-3 mr-1" />
              Live Battle
            </Badge>
            <Badge variant="outline" className="border-pink-500 text-pink-400">
              Status: {battle?.status}
            </Badge>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Progress value={progress} className="w-[60%] bg-red-950"
            style={{'--progress-foreground': '#fffff'}} 
            />
            <div className=" font-medium text-sm">
              {timeRemaining}
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rapper 1 Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto mb-4 overflow-hidden">
                <img src={rapper1?.image} alt="" className="object-cover w-full h-full" />
              </div>
              <CardTitle className="text-white text-xl">{rapper1?.username}</CardTitle>
              <p className="text-gray-400">The Lightning Lyricist</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrackList
                tracks={battle?.rapper1_audio_urls}
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
                onVote={() => setUserVote(rapper1?._id)}
              />
            </CardContent>
          </Card>

          {/* Rapper 2 Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-800 rounded-full mx-auto mb-4 overflow-hidden">
                <img src={rapper2?.image} alt="" className="object-cover w-full h-full" />
              </div>
              <CardTitle className="text-white text-xl">{rapper2?.username}</CardTitle>
              <p className="text-gray-400">Fire on the Mic</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrackList
                tracks={battle?.rapper2_audio_urls}
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
                onVote={() => setUserVote(rapper2?._id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Battle Stats */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-white font-semibold text-lg">Battle Statistics</h3>
              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{votes.rapper1}</div>
                  <div className="text-sm text-gray-400">{rapper1?.username}</div>
                </div>
                <div className="text-gray-500 text-xl">VS</div>
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
    </div>
  )
}