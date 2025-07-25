import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo  from "./Logo"
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


  const unreadCount = notifications.filter((n) => n.unread).length
 
const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  // console.log(user)
  return (
    <header className=" border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-15 bg-gradient-to-r from-gray-600 to-white rounded-lg flex items-center justify-center">
                <Logo className='w-20'/>
              </div>
              <Link to="/"><h1 className="text-xl font-bold text-secondary dark:text-white">BarsVsBars</h1></Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search artists, battles, or tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10  dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="items-center gap-3 hidden md:flex">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                <Link to="/dashboard/artists"><span className="hidden sm:inline">Artists</span></Link>
              </Button>

              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Swords className="w-4 h-4" />
                <Link to="/dashboard/explore-battle"><span className="hidden sm:inline">Explore Battle</span></Link>
              </Button>

              <Button variant="ghost" size="sm" className="gap-2">
                <Shield className="w-4 h-4" />
                <Link to="/dashboard/my-battles"><span className="hidden sm:inline">My Battles</span></Link>
              </Button>

              
              <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div key={notification.id}>
                        <div
                          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 ${notification.unread ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-transparent"}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate("/dashboard/profile")}>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{(user?.fullName || '?')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.fullName}</span>
              </Button>
              <Button
                        size="sm"
                        className="flex items-center justify-start gap-2 bg-" 
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="">Logout</span>
                    </Button>
            </div>

            <div className='flex md:hidden'>
              <DropdownMenu className="bg-non">
                <DropdownMenuTrigger>
                <Menu className="w-8 h-8" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-blend-color-burn bg-custom-gradient">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant="ghost" size="sm" className="flex items-center justify-start gap-2" onClick={() => navigate("/dashboard/profile")}>
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="text-primary">{(user?.fullName || '?')[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-secondary hover:text-primary">{user?.fullName}</span>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button variant="ghost" size="sm" className="flex items-center justify-start gap-2">
                      <Users className="w-4 h-4" />
                      <Link to="/dashboard/artists"><span className="">Artists</span></Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button variant="ghost" size="sm" className="flex items-center justify-start gap-2">
                      <Shield className="w-4 h-4" />
                      <Link to="/dashboard/my-battles"><span className="">My Battles</span></Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                        size="sm"
                        className="flex items-center justify-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Swords className="w-4 h-4" />
                        <Link to="/dashboard/explore-battle"><span className="">Explore Battle</span></Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <Button
                        size="sm"
                        className="flex items-center justify-start gap-2 bg-" 
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="">Logout</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Navbar