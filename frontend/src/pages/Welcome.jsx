"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Search, Users, Swords, Bell, Trophy, Target, Zap, TrendingUp, Crown, Flame, Star, Mic, Music } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Welcome = () => {
  // const [searchQuery, setSearchQuery] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      {/* Floating mic icon */}
      {/* <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center">
        <Mic className="w-14 h-14 text-yellow-400 drop-shadow-lg animate-bounce" />
        <span className="font-orbitron text-yellow-400 text-lg mt-2 tracking-widest">Welcome to the Arena</span>
      </div> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {/* Profile Card & Notifications */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <Avatar className="w-24 h-24 shadow-lg border-4 border-yellow-400">
            <AvatarImage src={user?.image || "/default-avatar.png"} alt={user?.fullName || user?.username || "User"} />
            <AvatarFallback>{(user?.username || user?.fullName || "?")[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-3xl font-bold font-orbitron text-yellow-400 mb-2 glitch">Welcome back, {user?.fullName} 🎤</h2>
            <p className="text-gray-200 font-orbitron mb-2">Rank: <span className="text-pink-400 font-bold">{user?.rank || "Rookie"}</span></p>
            <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-6 py-2 font-bold shadow hover:bg-yellow-400 hover:text-black transition-all duration-200 rounded-lg" onClick={() => navigate("/profile")}>
              View Profile
            </Button>
          </div>
          {/* Notifications Popover */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative font-orbitron text-yellow-400 hover:bg-yellow-400/10"
                aria-label="Notifications"
              >
                <Bell className="w-8 h-8" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-pink-400 text-white rounded-full px-2 py-0.5 text-xs font-bold font-orbitron">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-black/80 border-yellow-400 rounded-xl shadow-lg w-80 font-orbitron">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Notifications</h3>
              <Separator className="mb-2 bg-yellow-400" />
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-lg ${n.unread ? "bg-yellow-400/10" : "bg-gray-900/30"} flex flex-col`}>
                    <span className="font-bold text-pink-400">{n.title}</span>
                    <span className="text-white">{n.message}</span>
                    <span className="text-xs text-gray-400 mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Motivational Banner */}
        <div className="bg-black/40 rounded-2xl py-8 px-8 shadow-lg border border-yellow-400/30 mb-12 text-center">
          <span className="font-orbitron text-2xl md:text-3xl font-bold text-yellow-400 glitch">
            Ready to claim your crown? Drop your hottest bars!
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
          <Button className="font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-500 hover:text-black transition-all duration-200">
            Start New Battle
          </Button>
          <Button className="font-orbitron bg-pink-400 text-black border-2 border-pink-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-pink-500 hover:text-black transition-all duration-200">
            Upload Track
          </Button>
          <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
            Explore Battles
          </Button>
        </div>

        {/* Battle Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {battleStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-black/60 border-2 border-yellow-400 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-orbitron font-bold text-yellow-400">{stat.title}</CardTitle>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold font-orbitron text-white">{stat.value}</div>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-orbitron ${
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
        <div className="mb-12">
          <Card className="bg-black/60 border-2 border-pink-400 rounded-2xl shadow-lg py-6 px-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-orbitron text-pink-400">
                <Flame className="w-5 h-5 text-pink-400" />
                Recent Battle Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="font-orbitron font-bold text-white">Victory against DJ Vortex</p>
                      <p className="text-sm text-gray-400">Hip-Hop Battle • 2 hours ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-orbitron">+25 XP</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Swords className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-orbitron font-bold text-white">Battle with MC Thunder</p>
                      <p className="text-sm text-gray-400">Freestyle Battle • 5 hours ago</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-orbitron">+18 XP</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-orbitron font-bold text-white">Ranked up to Gold Tier</p>
                      <p className="text-sm text-gray-400">Achievement unlocked • 1 day ago</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 font-orbitron">
                    +50 XP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Animated music notes at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <Music className="w-6 h-6 text-yellow-400 animate-spin-slow" />
        <Music className="w-6 h-6 text-pink-400 animate-spin-slow" />
        <Music className="w-6 h-6 text-purple-400 animate-spin-slow" />
      </div>

      <style>
        {`
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
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default Welcome