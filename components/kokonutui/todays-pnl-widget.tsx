"use client"

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { DailyPnl } from "@/lib/types"

export default function TodaysPnlWidget() {
    const [loading, setLoading] = useState(true)
    const [todayPnl, setTodayPnl] = useState<number>(0)

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA')
        analyticsService.listDailyPnl({ start_date: today, end_date: today })
            .then((data: DailyPnl[]) => {
                const total = data.reduce((s, d) => s + (d.total_pnl ?? 0), 0)
                setTodayPnl(total)
            })
            .catch(() => setTodayPnl(0))
            .finally(() => setLoading(false))
    }, [])

    const isProfit = todayPnl >= 0

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
                    Today's P&L
                </p>
            </div>
            <p className={`text-3xl font-mono tracking-tight font-bold ${isProfit ? 'text-profit' : 'text-loss-primary'}`}>
                {isProfit ? '+' : ''}₹{Math.abs(todayPnl).toLocaleString('en-IN')}
            </p>
            <p className="text-sm font-body text-neutral-primary mt-2">
                {todayPnl === 0 ? 'No activity today' : isProfit ? 'Gains today' : 'Losses today'}
            </p>
        </div>
    )
}
