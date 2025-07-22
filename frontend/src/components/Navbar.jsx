import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "./Logo"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Search, Users, Swords, Bell, Shield, LogOut, Menu } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// const notifications = [
//   {
//     id: 1,
//     title: "Battle Request",
//     message: "DJ Shadow wants to battle you!",
//     time: "2 min ago",
//     unread: true,
//   },
//   {
//     id: 2,
//     title: "Victory!",
//     message: "You won the battle against MC Flow",
//     time: "1 hour ago",
//     unread: true,
//   },
//   {
//     id: 3,
//     title: "New Follower",
//     message: "BeatMaster started following you",
//     time: "3 hours ago",
//     unread: false,
//   },
// ]

// const unreadCount = notifications.filter((n) => n.unread).length

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  // const [notificationOpen, setNotificationOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-gradient-to-r from-purple-900 via-black to-pink-900 border-b-2 border-yellow-400 shadow-lg w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="font-orbitron text-yellow-400 text-xl font-bold tracking-wide">BarsVsBars</span>
        </Link>

        {/* Search Bar (desktop only) */}
        <div className="flex-1 max-w-md mx-8 hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search artists, battles, tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/60 border-yellow-400 text-yellow-400 font-orbitron"
            />
          </div>
        </div>

        {/* Links (desktop) */}
        <div className="items-center gap-4 hidden md:flex">
          <Button variant="ghost" size="sm" className="gap-2 font-orbitron text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-400">
            <Users className="w-5 h-5" />
            <Link to="/artists">Artists</Link>
          </Button>
          <Button size="sm" className="gap-2 font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-500 hover:text-black">
            <Swords className="w-5 h-5" />
            <Link to="/explore-battle">Battles</Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 font-orbitron text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-400">
            <Shield className="w-5 h-5" />
            <Link to="/my-battles">My Battles</Link>
          </Button>
          {/* Notifications */}


          {/* <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative font-orbitron text-yellow-400 hover:bg-yellow-400/10">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-pink-400">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 font-orbitron bg-black/90 border-yellow-400 rounded-xl shadow-lg" align="end">
              <div className="p-4 border-b border-yellow-400">
                <h3 className="font-semibold text-yellow-400">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className={`p-4 ${notification.unread ? "bg-yellow-400/10" : "bg-gray-900/30"} hover:bg-yellow-400/20 rounded-lg`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-yellow-400" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-pink-400">{notification.title}</p>
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-yellow-400">
                <Button variant="ghost" size="sm" className="w-full font-orbitron text-yellow-400 hover:bg-yellow-400/10">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover> */}


          {/* Profile & Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-8 h-8 border-2 border-yellow-400">
                <AvatarImage src={user?.image} />
                <AvatarFallback>{(user?.fullName || '?')[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-yellow-400 rounded-xl font-orbitron">
              <DropdownMenuLabel className="text-yellow-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-yellow-400" onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-yellow-400" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Burger */}
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu className="w-8 h-8 text-yellow-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-yellow-400 rounded-xl font-orbitron">
              <DropdownMenuLabel className="text-yellow-400">Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/artists")}>
                <Users className="w-5 h-5 mr-2" /> Artists
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/explore-battle")}>
                <Swords className="w-5 h-5 mr-2" /> Battles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/my-battles")}>
                <Shield className="w-5 h-5 mr-2" /> My Battles
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => setNotificationOpen(true)}>
                <Bell className="w-5 h-5 mr-2" /> Notifications
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Avatar className="w-6 h-6 mr-2 border-2 border-yellow-400">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{(user?.fullName || '?')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
        `}
      </style>
    </header>
  )
}

export default Navbar