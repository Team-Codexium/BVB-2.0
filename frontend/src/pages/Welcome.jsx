"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Search, Users, Swords, Bell, Trophy, Target, Zap, TrendingUp, Crown, Flame, Star } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { user } = useAuth();

  const notifications = [
    {
      id: 1,
      title: "Battle Request",
      message: "DJ Shadow wants to battle you!",
      time: "2 min ago",
      type: "battle",
      unread: true,
    },
    {
      id: 2,
      title: "Victory!",
      message: "You won the battle against MC Flow",
      time: "1 hour ago",
      type: "victory",
      unread: true,
    },
    {
      id: 3,
      title: "New Follower",
      message: "BeatMaster started following you",
      time: "3 hours ago",
      type: "follow",
      unread: false,
    },
  ]

  const battleStats = [
    {
      title: "Total Battles",
      value: "127",
      change: "+12",
      changeType: "positive",
      icon: Swords,
      color: "text-blue-600",
    },
    {
      title: "Win Rate",
      value: "78%",
      change: "+5%",
      changeType: "positive",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Current Streak",
      value: "8",
      change: "+3",
      changeType: "positive",
      icon: Flame,
      color: "text-red-600",
    },
    {
      title: "Ranking",
      value: "#42",
      change: "+7",
      changeType: "positive",
      icon: Crown,
      color: "text-purple-600",
    },
    {
      title: "Total Score",
      value: "2,847",
      change: "+156",
      changeType: "positive",
      icon: Star,
      color: "text-green-600",
    },
    {
      title: "Accuracy",
      value: "94%",
      change: "+2%",
      changeType: "positive",
      icon: Target,
      color: "text-indigo-600",
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen ">
      {/* Header */}
    
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary dark:text-white mb-2">Welcome back, {user?.fullName} 🎤</h2>
          <p className="text-gray-200 dark:text-slate-400">
            Ready to dominate the battle scene? Check your stats and start a new battle.
          </p>
        </div>

        {/* Battle Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {battleStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Recent Battle Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Victory against DJ Vortex</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Hip-Hop Battle • 2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">+25 XP</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Swords className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Battle with MC Thunder</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Freestyle Battle • 5 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">+18 XP</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Ranked up to Gold Tier</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Achievement unlocked • 1 day ago</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
                  +50 XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </main>
    </div>
  )
}
