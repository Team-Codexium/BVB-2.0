import { useState, useEffect, useRef } from "react"
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
import { useRapper } from "../contexts/RapperContext"
import socket from "../../clientScoket"

export default function BattleDetails() {
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [votedRapperId, setVotedRapperId] = useState(null);
  const [prevVotedRapperId, setPrevVotedRapperId] = useState(null);
  const [lastSyncedVote, setLastSyncedVote] = useState(null)
  const [voteTimerActive, setVoteTimerActive] = useState(false)
  
  const voteTimerRef = useRef(null)
  
  const { battleId } = useParams()
  const { getBattleById, battle } = useBattle()
  const { token, user} = useAuth()
  const { checkVote } = useRapper();
  
  
  useEffect(() => {
    // Join battle room for real-time updates
    if (battleId) {
      socket.emit("join-battle", battleId);
      console.log("Joined battle room:", battleId);
    }

    // Listen for vote updates
    socket.on("vote-update", (data) => {
      console.log("Live vote update received:", data);
      console.log("Current votes before update:", votes);
      
      handleVoteUpdate(data);
      
      // Update local vote state if this was our vote
      if (data.voterId === user?._id) {
        console.log("Updating local vote state from socket:", data.votedFor);
        const voteState = data.votedFor || null;
        setVotedRapperId(voteState);
        setLastSyncedVote(voteState);
        console.log("Updated vote state to:", voteState);
      }
    });

    return () => {
      // Leave battle room and cleanup listeners
      if (battleId) {
        socket.emit("leave-battle", battleId);
      }
      socket.off("vote-update");
    };
  }, [battleId]);

  const checkUserVote = async () => {
    try {
      const votedFor = await checkVote(battleId)
      console.log("User voted for rapper ID:", votedFor)
      setVotedRapperId(votedFor)
      setLastSyncedVote(votedFor) // Initialize last synced vote
      console.log("Vote state initialized - votedRapperId:", votedFor, "lastSyncedVote:", votedFor)
    } catch (error) {
      console.error("Error checking user vote:", error)
    }
  }

  
  useEffect(() => {
    checkUserVote()
  }, [battleId])



  // Function to fetch battle details
  const refreshBattle = () => {
    getBattleById(battleId, token)
  }

  // Function to calculate time remaining
  const calculateTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    console.log(now, end, endTime)
    const timeDiff = end - now;

    if (timeDiff <= 0) {
      return "Battle has ended";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}, ${hours} hr${hours > 1 ? 's' : ''}, ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}, ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? 's' : ''}, ${seconds} sec${seconds > 1 ? 's' : ''}`;
    } else {
      return `${seconds} sec${seconds > 1 ? 's' : ''}`;
    }
  }

  //Get votedFor rapper


  // Sync vote status every 1 minute
    useEffect(() => {
    console.log("Vote timer effect triggered - voteTimerActive:", voteTimerActive);
    if (!voteTimerActive) return
    
    console.log("Starting vote timer...");
    voteTimerRef.current = setTimeout(async () => {
      console.log("Vote timer expired - checking if vote needs to be submitted");
      console.log("votedRapperId:", votedRapperId, "lastSyncedVote:", lastSyncedVote);
      
      if (votedRapperId !== lastSyncedVote) {
        try {
          console.log("Submitting vote with token:", token);
          console.log("Vote data:", { rapperId: votedRapperId, battleId });
          console.log("Sending rapperId to server:", votedRapperId);
          console.log("rapperId type:", typeof votedRapperId, "value:", votedRapperId);
          
          const res = await axios.post(`/api/votes/update/${battleId}`, {
            rapperId: votedRapperId,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log("Vote response:", res.data)
          
          // Update vote state based on server response
          const serverVotedFor = res.data.votedFor || null;
          setLastSyncedVote(serverVotedFor);
          setVotedRapperId(serverVotedFor);
          
          console.log("Vote submission successful - updated state to:", serverVotedFor);
          setAlertMsg(res.data.message || "Vote submitted!")
          // Don't call refreshBattle() here - let socket handle real-time updates
        } catch (error) {
          console.error("Vote submission error:", error.response?.data || error.message);
          console.error("Full error:", error);
          setAlertMsg(`Failed to submit vote: ${error.response?.data?.message || error.message}`)
          // Revert to last synced vote on error
          setVotedRapperId(lastSyncedVote)
        }
      } else {
        console.log("No vote change detected, skipping submission");
      }
      setVoteTimerActive(false)
    }, 1000) // 1 second delay for better UX

    return () => clearTimeout(voteTimerRef.current)
  }, [voteTimerActive, votedRapperId, lastSyncedVote, battleId, token])


  //Calling refreshBattle on mount and when battleId or token changes
  useEffect(() => {
    refreshBattle()
  }, [battleId, token])

  // Sync vote state when battle data changes
  useEffect(() => {
    if (battle && user) {
      console.log("Battle data updated, checking vote state...");
      checkUserVote();
    }
  }, [battle, user])


  // Update progress and time remaining every minute
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
        const remaining = calculateTimeRemaining(battle.endTime)
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
  const [votes, setVotes] = useState({
    rapper1Votes: 0,
    rapper2Votes: 0
  });
  const [voteAnimation, setVoteAnimation] = useState(false);

  // Update votes when battle data changes
  useEffect(() => {
    if (battle) {
      setVotes({
        rapper1Votes: battle.rapper1Votes || 0,
        rapper2Votes: battle.rapper2Votes || 0
      });
    }
  }, [battle]);

  // Handle real-time vote updates with animation
  const handleVoteUpdate = (newVotes) => {
    console.log("handleVoteUpdate called with:", newVotes);
    console.log("Current votes state:", votes);
    
    // Ensure we're updating with the correct vote counts from server
    setVotes({
      rapper1Votes: newVotes.rapper1Votes || 0,
      rapper2Votes: newVotes.rapper2Votes || 0
    });
    
    setVoteAnimation(true);
    setTimeout(() => setVoteAnimation(false), 1000);
  };
  
  const totalVotes = votes.rapper1Votes + votes.rapper2Votes
  const rapper1Percent = totalVotes === 0 ? 50 : (votes.rapper1Votes / totalVotes) * 100
  const battleStatus = battle?.status

  const handleTrackUpload = async (rapperId, file, title) => {
    if (!battleId || !rapperId || !file) return
    const formData = new FormData()
    formData.append("audio", file)
    formData.append("title", title)

    try {
      await axios.post(
        `/api/media/${battleId}/${rapperId}/add-audio`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setAlertMsg("Track uploaded successfully!")
      refreshBattle()
    } catch {
      setAlertMsg("Failed to upload track.")
    }
  }

  // Instagram-like vote toggle functionality
  const handleVote = (rapperId) => {
    console.log("Vote button clicked for rapper:", rapperId);
    console.log("Current votedRapperId:", votedRapperId);
    console.log("Current lastSyncedVote:", lastSyncedVote);
    
    setPrevVotedRapperId(votedRapperId);
    
    // Toggle vote: if already voted for this rapper, unvote (set to null)
    // If voting for a different rapper, switch vote
    // If voting for the first time, vote for this rapper
    const newVote = votedRapperId === rapperId ? null : rapperId;
    setVotedRapperId(newVote);
    
    console.log("New vote set to:", newVote);
    console.log("Will submit vote for rapperId:", newVote);
    
    // Start the vote timer to submit the vote
    if (!voteTimerActive) {
      setVoteTimerActive(true);
      console.log("Vote timer activated");
    }
  };

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
                tracks={Array.isArray(battle?.rapper1Tracks) ? battle.rapper1Tracks : []}
                artist={rapper1?.username}
                rapperId={rapper1?._id}
                onTrackUpload={handleTrackUpload}
                onTrackDelete={() => {}}
                canUpload={user?._id === rapper1?._id}
              />

              <VotingComponent
                rapperId={rapper1?._id}
                currentVotes={votes.rapper1Votes}
                votedRapperId={votedRapperId}
                prevVotedRapperId={prevVotedRapperId}
                setVotedRapperId={handleVote}
                isContestant={user?._id === rapper1?._id}
                battleStatus={battleStatus}
                voteTimerActive={voteTimerActive}
                setVoteTimerActive={setVoteTimerActive}
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
                currentVotes={votes.rapper2Votes}
                votedRapperId={votedRapperId}
                prevVotedRapperId={prevVotedRapperId}
                setVotedRapperId={handleVote}
                isContestant={user?._id === rapper2?._id}
                battleStatus={battleStatus}
                voteTimerActive={voteTimerActive}
                setVoteTimerActive={setVoteTimerActive}
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
                  <div className={`text-2xl font-bold text-purple-400 ${voteAnimation ? 'animate-pulse scale-110' : ''}`}>
                    {votes.rapper1Votes}
                  </div>
                  <div className="text-sm text-gray-400">{rapper1?.username}</div>
                </div>
                <div className="text-pink-400 text-xl font-orbitron">VS</div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-pink-400 ${voteAnimation ? 'animate-pulse scale-110' : ''}`}>
                    {votes.rapper2Votes}
                  </div>
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