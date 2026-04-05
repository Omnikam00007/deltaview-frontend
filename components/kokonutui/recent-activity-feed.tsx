"use client"

import { CornerDownRight, ArrowUpRight, ArrowDownRight, Wallet, Activity, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { tradesService } from "@/lib/services/trades.service"
import { fundsService } from "@/lib/services/funds.service"
import type { Trade, LedgerEntry } from "@/lib/types"

interface ActivityItem {
    id: string
    type: string
    icon: any
    title: string
    time: string
    amount: number
    isPositive: boolean
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function mergeActivities(trades: Trade[], ledger: LedgerEntry[]): ActivityItem[] {
    const items: ActivityItem[] = []

    for (const t of trades) {
        const isBuy = t.trade_type === "BUY"
        items.push({
            id: `trade-${t.id}`,
            type: isBuy ? "buy" : "sell",
            icon: isBuy ? CornerDownRight : ArrowUpRight,
            title: `${isBuy ? 'Bought' : 'Sold'} ${t.instrument?.symbol ?? 'Stock'}`,
            time: timeAgo(t.trade_date),
            amount: isBuy ? -t.trade_value : t.trade_value,
            isPositive: !isBuy,
        })
    }

    for (const e of ledger) {
        const isCredit = e.entry_type === "credit"
        items.push({
            id: `ledger-${e.id}`,
            type: e.category ?? "other",
            icon: isCredit ? Wallet : Activity,
            title: e.narration ?? e.original_narration ?? (isCredit ? "Credit" : "Debit"),
            time: timeAgo(e.entry_date),
            amount: isCredit ? e.amount : -e.amount,
            isPositive: isCredit,
        })
    }

    // Sort by most recent (smallest timeAgo)
    items.sort((a, b) => {
        // Parse timeAgo back to get relative ordering
        const parseAgo = (s: string) => {
            const num = parseInt(s)
            if (s.includes('m')) return num
            if (s.includes('h')) return num * 60
            return num * 1440
        }
        return parseAgo(a.time) - parseAgo(b.time)
    })

    return items.slice(0, 8)
}

export default function RecentActivityFeed() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            tradesService.list().catch(() => []),
            fundsService.listLedgerEntries().catch(() => []),
        ]).then(([trades, ledger]) => {
            setActivities(mergeActivities(trades, ledger))
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex items-center justify-center h-full shadow-sm min-h-[200px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center">
                <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                    Recent Activity
                </h3>
                {activities.length > 0 && (
                    <span className="flex items-center text-[10px] text-profit uppercase tracking-wider font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-profit mr-1.5 animate-pulse"></div> Live Feed
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col p-2 overflow-y-auto no-scrollbar max-h-[350px]">
                {activities.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <p className="text-foreground font-bold font-display mb-2">No Activity Yet</p>
                        <p className="text-sm text-neutral max-w-xs">
                            Trades, fund additions, and dividends will appear here.
                        </p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        const Icon = activity.icon
                        return (
                            <div
                                key={activity.id}
                                className="w-full flex items-center justify-between p-3 rounded hover:bg-surface-hover/50 transition-colors group cursor-pointer border border-transparent hover:border-border-subtle"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                                        activity.isPositive 
                                        ? 'bg-profit/10 border-profit/20 text-profit' 
                                        : 'bg-loss-primary/10 border-loss-primary/20 text-loss-primary'
                                    }`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground tracking-tight group-hover:text-accent-blue transition-colors">
                                            {activity.title}
                                        </span>
                                        <span className="text-[10px] uppercase font-mono text-neutral font-medium">
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className={`text-sm font-mono font-bold tracking-tighter ${
                                    activity.isPositive ? 'text-profit' : 'text-neutral'
                                }`}>
                                    {activity.amount > 0 ? '+' : ''}₹{Math.abs(activity.amount).toLocaleString('en-IN')}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {activities.length > 0 && (
                <div className="p-3 border-t border-border-subtle bg-background/50 flex justify-center">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-neutral hover:text-foreground transition-colors py-1 px-4 rounded hover:bg-surface-hover">
                        Show all {activities.length} activities →
                    </button>
                </div>
            )}
        </div>
    )
}
