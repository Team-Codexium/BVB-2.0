import { useState, useEffect } from "react"
import VotingComponent from "../components/VotePanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Music, Calendar } from "lucide-react"
import MusicPlayer from "../components/MusicPlayer"
import { useParams } from "react-router-dom"

import {useBattle} from "../contexts/BattleContext"
import {useAuth} from "../contexts/AuthContext"
import TrackList from "../components/TrackList"
import axios from "axios"
import { Alert } from "@/components/ui/alert"

export default function BattleDetails() {
  const [votes, setVotes] = useState({
    rapper1: 42,
    rapper2: 38,
  })
  const [userVote, setUserVote] = useState(null)
  const [battle, setBattle] = useState({})
  const [loading, setLoading] = useState(false);
  const {battleId} = useParams();
  const battleStatus = "active";

  const {getBattleById} = useBattle();
  const {token, user} = useAuth();

  useEffect(() => {
    const getBattle = async(battleId, token) => {
      try {
        setLoading(true);
        const data = await getBattleById(battleId, token);
        console.log("data",data)
        if (data) {
          setBattle(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getBattle(battleId, token);
    
  }, [battleId])

  // console.log(battle)
  const rapper1 = battle?.contestants?.rapper1;
  const rapper2 = battle?.contestants?.rapper2;
  // console.log("Rapper1", rapper1)
  // console.log("Rapper2", rapper2)
  // console.log("User", user)

  const [tracks, setTracks] = useState({
    rapper1: [],
    rapper2: [],
  })
  const [alertMsg, setAlertMsg] = useState("")

  // Fetch tracks for a rapper from the server
  
console.log(battle)
  // Fetch tracks when battle or rappers change
  useEffect(() => {
    setTracks({
      rapper1: battle.rapper1_audio_urls || [],
      rapper2: battle.rapper2_audio_urls || [],
    });
    // eslint-disable-next-line
  }, [battleId, rapper1?._id, rapper2?._id])

  const handleVote = (rapperId) => {
    if (!userVote) {
      setUserVote(rapperId)
      setVotes((prev) => ({
        ...prev,
        [rapperId]: prev[rapperId] + 1,
      }))
    }
  }

  // Upload handler for TrackList
  const handleTrackUpload = async (rapperId, file, title) => {
    if (!battleId || !rapperId || !file) return
    const formData = new FormData()
    formData.append("audio", file)
    formData.append("title", title)
    try {
      const res = await axios.post(`http://localhost:4000/api/media/${battleId}/${rapperId}/add-audio`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log(res)
      setAlertMsg("Track uploaded successfully!")
      // Re-fetch tracks
      const updatedBattle = await getBattleById(battleId, token);
      setBattle(updatedBattle);
    } catch {
      setAlertMsg("Failed to upload track.")
    }
  }

  const handleTrackDelete = (rapperId, trackIndex) => {
    setTracks((prev) => ({
      ...prev,
      [rapperId]: prev[rapperId].filter((_, i) => i !== trackIndex),
    }))
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>;
  }

  

  return battle && (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {alertMsg && (
          <Alert className="mb-4" onClick={() => setAlertMsg("")}>{alertMsg}</Alert>
        )}
        {/* Battle Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            RAP BATTLE ARENA
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Calendar className="w-3 h-3 mr-1" />
              Live Battle
            </Badge>
            <Badge variant="outline" className="border-pink-500 text-pink-400">
              Status: {battleStatus}
            </Badge>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rapper 1 Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mx-auto flex items-center justify-center mb-4">
                <img src={rapper1?.image} alt="" />
              </div>
              <CardTitle className="text-white text-xl">{rapper1?.fullName}</CardTitle>
              <p className="text-gray-400">The Lightning Lyricist</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Track List for Rapper 1 */}
              <TrackList
                tracks={tracks.rapper1}
                artist={rapper1?.fullName}
                rapperId={rapper1?._id}
                onTrackUpload={handleTrackUpload}
                onTrackDelete={handleTrackDelete}
                canUpload={user?._id === rapper1?._id} // Only contestants can upload
              />

              {/* Voting Component */}
              <VotingComponent
                rapperId="rapper1"
                rapperName="MC Thunder"
                currentVotes={votes.rapper1}
                hasVoted={userVote !== null}
                votedForThisRapper={userVote === "rapper1"}
                isContestant={user?._id === rapper1?._id}
                battleStatus={battleStatus}
                onVote={handleVote}
              />
            </CardContent>
          </Card>

          {/* Rapper 2 Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-pink-800 rounded-full mx-auto flex items-center justify-center mb-4">
                <img src={rapper2?.image} alt="" />
              </div>
              <CardTitle className="text-white text-xl">{rapper2?.fullName}</CardTitle>
              <p className="text-gray-400">Fire on the Mic</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Track List for Rapper 2 */}
              <TrackList
                tracks={tracks.rapper2}
                artist={rapper2?.fullName}
                rapperId={rapper2?._id}
                onTrackUpload={handleTrackUpload}
                onTrackDelete={handleTrackDelete}
                canUpload={user?._id === rapper2?._id} // Only contestants can upload
              />

              {/* Voting Component */}
              <VotingComponent
                rapperId="rapper2"
                rapperName="Blaze Master"
                currentVotes={votes.rapper2}
                hasVoted={userVote !== null}
                votedForThisRapper={userVote === "rapper2"}
                isContestant={user?._id === rapper2?._id}
                battleStatus={battleStatus}
                onVote={handleVote}
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
                  <div className="text-sm text-gray-400">MC Thunder</div>
                </div>
                <div className="text-gray-500 text-xl">VS</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{votes.rapper2}</div>
                  <div className="text-sm text-gray-400">Blaze Master</div>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(votes.rapper1 / (votes.rapper1 + votes.rapper2)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
