import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Crown, Flame, Mic, Check, Lock, Undo2 } from "lucide-react"


export default function VotingComponent({
  rapperId,
  currentVotes,
  votedRapperId,
  prevVotedRapperId,
  setVotedRapperId,
  isContestant,
  battleStatus,
  voteTimerActive,
  setVoteTimerActive
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [localVotes, setLocalVotes] = useState(currentVotes)

  useEffect(() => {
    // Optimistic UI: update localVotes instantly based on local vote state
    if (votedRapperId === rapperId && prevVotedRapperId !== rapperId && prevVotedRapperId !== null) {
      // Switched vote from other rapper to this one
      setLocalVotes(currentVotes + 1)
    } else if (votedRapperId === rapperId && prevVotedRapperId === null) {
      // First time voting for this rapper
      setLocalVotes(currentVotes + 1)
    } else if (prevVotedRapperId === rapperId && votedRapperId !== rapperId && votedRapperId !== null) {
      // Switched vote away from this rapper
      setLocalVotes(currentVotes - 1)
    } else if (votedRapperId === null && prevVotedRapperId === rapperId) {
      // Unvoted this rapper
      setLocalVotes(currentVotes - 1)
    } else {
      setLocalVotes(currentVotes)
    }
  }, [currentVotes, votedRapperId, prevVotedRapperId, rapperId])

  const canVote = !isContestant && battleStatus === "active"
  const isDisabled = isContestant || battleStatus !== "active"

  const handleVote = () => {
    if (!canVote) return
    setIsAnimating(true)
    // If already voted for this rapper, unvote
    if (votedRapperId === rapperId) {
      setVotedRapperId(null)
    } else {
      setVotedRapperId(rapperId)
    }
    if (!voteTimerActive) setVoteTimerActive(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const getButtonContent = () => {
    if (votedRapperId === rapperId) {
      return (
        <>
          <Check className="w-4 h-4" />
          You Voted Here
        </>
      )
    }

    if (isContestant) {
      return (
        <>
          <Mic className="w-4 h-4" />
          Contestant
        </>
      )
    }

    if (battleStatus === "pending") {
      return (
        <>
          <Lock className="w-4 h-4" />
          Battle Pending
        </>
      )
    }

    if (battleStatus === "completed") {
      return (
        <>
          <Crown className="w-4 h-4" />
          Battle Ended
        </>
      )
    }

    return (
      <>
        <Flame className="w-4 h-4" />
        Vote
      </>
    )
  }

  const getButtonStyles = () => {
    if (votedRapperId === rapperId) {
      return "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-500 shadow-lg shadow-purple-500/25"
    }

    if (isDisabled) {
      return "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed"
    }

    return "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-900/50 hover:to-pink-900/50 border-gray-600 hover:border-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
  }

  return (
    <Card className="bg-black/60 border-2 border-yellow-400 rounded-2xl shadow-lg font-orbitron">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Vote Count Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="w-6 h-6 text-purple-400 animate-bounce" />
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
                {localVotes}
              </span>
            </div>
            <p className="text-sm text-gray-400">{localVotes === 1 ? "Vote" : "Votes"}</p>
          </div>

          {/* Voting Button */}
          <Button
            onClick={handleVote}
            disabled={isDisabled}
            className={`w-full h-12 font-semibold text-base transition-all duration-300 rounded-xl border-2 ${getButtonStyles()} ${
              isAnimating ? "scale-105 animate-pulse" : ""
            }`}
          >
            <div className="flex items-center gap-2">{getButtonContent()}</div>
          </Button>

          {/* Status Indicator */}
          {votedRapperId === rapperId && (
            <div className="flex items-center justify-center gap-2 text-xs text-purple-400 animate-fade-in">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Your vote is locked in!
            </div>
          )}

          {isContestant && (
            <div className="flex items-center justify-center gap-2 text-xs text-yellow-400">
              <Crown className="w-3 h-3" />
              You're competing in this battle
            </div>
          )}
        </div>
      </CardContent>
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .animate-glow {
            animation: glow 1.5s infinite alternate;
          }
          @keyframes glow {
            0% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
            100% { text-shadow: 0 0 16px #f472b6, 0 0 8px #a78bfa; }
          }
        `}
      </style>
    </Card>
  )
}
