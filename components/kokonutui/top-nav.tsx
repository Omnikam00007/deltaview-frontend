"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Bell, ChevronDown, ChevronRight, Settings } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"

export default function TopNav() {

  return (
    <nav className="flex flex-col w-full border-b border-border-subtle bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      
      {/* Top Main Row */}
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm font-medium text-neutral hover:text-foreground cursor-pointer transition-colors">
            <span className="font-display font-semibold text-foreground tracking-tight">Portfolio Overview</span>
          </div>
          <div className="hidden sm:flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            PRO
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="text-neutral hover:text-foreground transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-loss-primary text-[8px] font-bold text-white">3</span>
          </button>
          
          <button className="text-neutral hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-border-subtle mx-1" />
          
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center space-x-2">
              <div className="h-7 w-7 rounded-sm bg-neutral flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-border-subtle overflow-hidden">
                RK
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 bg-surface border-border-subtle rounded-lg shadow-xl"
            >
              <Profile01 avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary Data Controls Row */}
      <div className="flex h-10 items-center justify-between px-4 sm:px-6 border-t border-border-subtle bg-background/50">
        <div className="flex items-center space-x-6 text-xs font-medium text-neutral">
           <button className="flex items-center hover:text-foreground transition-colors">
             Quick Date: <span className="ml-1 text-foreground">Today</span> <ChevronDown className="ml-1 h-3 w-3" />
           </button>
           <button className="flex items-center hover:text-foreground transition-colors">
             Compare: <span className="ml-1 text-foreground">Nifty 50</span> <ChevronDown className="ml-1 h-3 w-3" />
           </button>
           <button className="flex items-center hover:text-foreground transition-colors">
             View: <span className="ml-1 text-foreground">Default</span> <ChevronDown className="ml-1 h-3 w-3" />
           </button>
        </div>
        
        <div className="hidden sm:flex items-center text-[11px] text-neutral/70 font-mono">
           <span className="flex items-center mr-4"><div className="h-1.5 w-1.5 rounded-full bg-profit mr-1.5"></div> LIVE SYNC</span>
           UPDATED: 2 SECS AGO
        </div>
      </div>
    </nav>
  )
}

