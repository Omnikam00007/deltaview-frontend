"use client"

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { RealizedPnl } from "@/lib/types"

export default function RealizedPnlWidget() {
    const [loading, setLoading] = useState(true)
    const [realizedPnl, setRealizedPnl] = useState<number>(0)
    const [tradeCount, setTradeCount] = useState<number>(0)

    useEffect(() => {
        analyticsService.listRealizedPnl()
            .then((data: RealizedPnl[]) => {
                const total = data.reduce((s, d) => s + (d.net_pnl ?? 0), 0)
                setRealizedPnl(total)
                setTradeCount(data.length)
            })
            .catch(() => {
                setRealizedPnl(0)
                setTradeCount(0)
            })
            .finally(() => setLoading(false))
    }, [])

    const isProfit = realizedPnl >= 0

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-5 flex items-center justify-center h-full min-h-[140px]">
                <Loader2 className="w-4 h-4 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading…</span>
            </div>
        )
    }

    return (
        <div className={`bg-surface border rounded-xl p-5 transition-colors h-full ${isProfit ? 'border-profit/30 hover:border-profit/60' : 'border-loss-primary/30 hover:border-loss-primary/60'}`}>
            <div className="flex items-center gap-2 mb-3">
                {isProfit ? (
                    <TrendingUp className="w-5 h-5 text-profit/60" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-loss-primary/60" />
                )}
                <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                    Realized P&L
                </p>
            </div>
            <p className={`text-3xl font-mono tracking-tight font-bold ${isProfit ? 'text-profit' : 'text-loss-primary'}`}>
                {isProfit ? '+' : ''}₹{Math.abs(realizedPnl).toLocaleString('en-IN')}
            </p>
            <p className="text-sm font-body text-neutral-primary mt-2">
                From {tradeCount} closed trade{tradeCount !== 1 ? 's' : ''}
            </p>
        </div>
    )
}
