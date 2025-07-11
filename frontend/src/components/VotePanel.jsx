"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Crown, Flame, Mic, Check, Lock } from "lucide-react"


export default function VotingComponent({
  rapperId,
  rapperName,
  currentVotes,
  hasVoted,
  votedForThisRapper,
  isContestant,
  battleStatus,
  onVote,
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleVote = () => {
    if (canVote) {
      setIsAnimating(true)
      onVote(rapperId)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const canVote = !hasVoted && !isContestant && battleStatus === "active"
  const isDisabled = hasVoted || isContestant || battleStatus !== "active"

  const getButtonContent = () => {
    if (votedForThisRapper) {
      return (
        <>
          <Check className="w-4 h-4" />
          You Voted Here
        </>
      )
    }

    if (hasVoted && !votedForThisRapper) {
      return (
        <>
          <Lock className="w-4 h-4" />
          Vote Cast
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
    if (votedForThisRapper) {
      return "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-500 shadow-lg shadow-purple-500/25"
    }

    if (hasVoted && !votedForThisRapper) {
      return "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed"
    }

    if (isDisabled) {
      return "bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed"
    }

    return "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-900/50 hover:to-pink-900/50 border-gray-600 hover:border-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm" >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Vote Count Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentVotes}
              </span>
            </div>
            <p className="text-sm text-gray-400">{currentVotes === 1 ? "Vote" : "Votes"}</p>
          </div>

          {/* Voting Button */}
          <Button
            onClick={handleVote}
            disabled={isDisabled}
            className={`w-full h-12 font-semibold text-sm transition-all duration-300 ${getButtonStyles()} ${
              isAnimating ? "scale-105 animate-pulse" : ""
            }`}
          >
            <div className="flex items-center gap-2">{getButtonContent()}</div>
          </Button>

          {/* Status Indicator */}
          {votedForThisRapper && (
            <div className="flex items-center justify-center gap-2 text-xs text-purple-400 animate-fade-in">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Your vote is locked in!
            </div>
          )}

          {hasVoted && !votedForThisRapper && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              You voted for the other rapper
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
    </Card>
  )
}
