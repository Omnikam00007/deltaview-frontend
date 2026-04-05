"use client"

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap,
  PieChart,
  Boxes,
  Activity,
  Home,
  ArrowUpRight
} from "lucide-react"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    badge,
    children,
  }: {
    href: string
    icon: any
    badge?: React.ReactNode
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all text-neutral hover:text-foreground dark:hover:text-white hover:bg-surface-hover/50 dark:hover:bg-[#1F1F23]/50 group"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-3 flex-shrink-0 text-neutral group-hover:text-accent-blue transition-colors" />
          <span className="font-medium">{children}</span>
        </div>
        {badge && <div>{badge}</div>}
      </Link>
    )
  }

  const LiveDot = () => (
    <div className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-profit"></span>
    </div>
  )

  const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "profit" | "muted" }) => {
    const baseClass = "px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider font-mono uppercase"
    const variants = {
      default: "bg-surface text-neutral border border-border-subtle",
      profit: "bg-profit/10 text-profit border-profit/20 border",
      muted: "bg-transparent text-neutral"
    }
    return <span className={`${baseClass} ${variants[variant]}`}>{children}</span>
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-surface shadow-md border border-border-subtle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-neutral" />
      </button>

      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-surface transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-[260px] border-r border-border-subtle flex flex-col
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-border-subtle">
          <Link
            href="/"
            onClick={handleNavigation}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-lg bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20">
               <span className="text-xl font-bold tracking-tighter text-accent-blue">∆</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground font-display">
              DeltaView
            </span>
          </Link>
          <div className="w-2 h-2 rounded-full bg-profit shadow-[0_0_8px_rgba(0,184,107,0.6)]" title="System Operational" />
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 no-scrollbar">
          
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral/70 font-display">
              Primary
            </div>
            <NavItem href="/dashboard" icon={Zap} badge={<LiveDot />}>
              Dashboard
            </NavItem>
            <NavItem href="/portfolio" icon={PieChart} badge={<Badge>23 POS</Badge>}>
              Holdings
            </NavItem>
            <NavItem href="/pnl" icon={TrendingUp} badge={<Badge variant="profit">+₹3.2K</Badge>}>
              P&L
            </NavItem>
            <NavItem href="/funds" icon={Wallet} badge={<Badge>₹65K</Badge>}>
              Funds
            </NavItem>
            <NavItem href="#" icon={Activity}>
              Analytics
            </NavItem>
          </div>

          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral/70 font-display">
              Portfolio
            </div>
            <NavItem href="#" icon={Building2}>
              Organization
            </NavItem>
            <NavItem href="#" icon={Folder}>
              Projects
            </NavItem>
            <NavItem href="#" icon={Boxes}>
              Holdings Groups
            </NavItem>
          </div>

          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral/70 font-display">
              Transactions
            </div>
            <NavItem href="#" icon={CreditCard}>
              Transactions
            </NavItem>
            <NavItem href="#" icon={Receipt}>
              Invoices
            </NavItem>
            <NavItem href="#" icon={DollarSign}>
              Payments
            </NavItem>
          </div>

          <div className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral/70 font-display">
              Collaboration
            </div>
            <NavItem href="#" icon={Users2} badge={<Badge variant="muted">3</Badge>}>
              Team
            </NavItem>
            <NavItem href="#" icon={Shield}>
              Permissions
            </NavItem>
            <NavItem href="#" icon={MessagesSquare} badge={<Badge variant="profit">2</Badge>}>
              Chat
            </NavItem>
            <NavItem href="#" icon={Video}>
              Meetings
            </NavItem>
          </div>
        </div>

        <div className="px-3 py-4 border-t border-border-subtle bg-background/30">
          <div className="space-y-1">
            <NavItem href="#" icon={ArrowUpRight}>
              Upgrade Plan
            </NavItem>
            <NavItem href="#" icon={HelpCircle}>
              Help & Support
            </NavItem>
            <div className="px-3 py-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-surface border border-border-subtle flex items-center justify-center text-sm font-bold shadow-sm">
                  EK
                </div>
                <div>
                  <div className="text-sm font-semibold">Enterprise</div>
                  <div className="text-xs text-neutral">Pro Plan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

