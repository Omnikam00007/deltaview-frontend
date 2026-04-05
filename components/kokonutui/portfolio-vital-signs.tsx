"use client"

import { Eye, EyeOff, TrendingUp, TrendingDown, DollarSign, Calendar, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { holdingsService } from "@/lib/services/holdings.service"
import type { PortfolioSummary } from "@/lib/types"

export default function PortfolioVitalSigns() {
    const [privacyMode, setPrivacyMode] = useState(false)
    const [summary, setSummary] = useState<PortfolioSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        holdingsService.getSummary()
            .then(setSummary)
            .catch(() => setSummary(null))
            .finally(() => setLoading(false))
    }, [])

    const totalInvested = summary?.total_invested ?? 0
    const currentValue = summary?.current_value ?? 0
    const totalPnL = summary?.total_pnl ?? 0
    const totalPnLPercent = summary?.total_pnl_percent?.toFixed(2) ?? "0.00"
    const daysPnL = 0 // Will be computed from daily_pnl endpoint in future
    const daysPnLPercent = 0
    const xirr = 0 // Will be computed client-side or via a dedicated endpoint

    const isProfitable = totalPnL >= 0
    const isDayPositive = daysPnL >= 0

    const formatValue = (value: number) => {
        if (privacyMode) return "₹**,**,***"
        return `₹${value.toLocaleString('en-IN')}`
    }

    const formatPercent = (value: string | number) => {
        if (privacyMode) return "**.**%"
        return `${value}%`
    }

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-5 flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading portfolio...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">Portfolio Overview</h1>
                    <p className="text-xs font-body text-neutral-primary mt-1">Aggregated across all brokers</p>
                </div>

                {/* Privacy Mode Toggle */}
                <button
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className="p-2 rounded-lg border border-border-subtle hover:bg-surface-hover transition-colors"
                    title={privacyMode ? "Show values" : "Hide values"}
                >
                    {privacyMode ? (
                        <EyeOff className="w-4 h-4 text-neutral-primary hover:text-foreground" />
                    ) : (
                        <Eye className="w-4 h-4 text-neutral-primary hover:text-foreground" />
                    )}
                </button>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Invested */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-neutral" />
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">Total Invested</p>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        {formatValue(totalInvested)}
                    </p>
                </div>

                {/* Current Value */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-neutral" />
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">Current Value</p>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        {formatValue(currentValue)}
                    </p>
                </div>

                {/* Total P&L */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {isProfitable ? (
                            <TrendingUp className="w-4 h-4 text-profit" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-loss-primary" />
                        )}
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                            Total P&L
                        </p>
                    </div>
                    <p className={`text-2xl font-bold font-mono tracking-tight ${isProfitable ? 'text-profit' : 'text-loss-primary'}`}>
                        {isProfitable ? '+' : ''}{formatValue(Math.abs(totalPnL))}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        {isProfitable ? '+' : ''}{formatPercent(totalPnLPercent)}
                    </p>
                </div>

                {/* Day's P&L */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral" />
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">Today's P&L</p>
                    </div>
                    <p className={`text-2xl font-bold font-mono tracking-tight ${isDayPositive ? 'text-profit' : 'text-loss-primary'}`}>
                        {isDayPositive ? '+' : ''}{formatValue(Math.abs(daysPnL))}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        {isDayPositive ? '+' : ''}{formatPercent(daysPnLPercent.toFixed(2))}
                    </p>
                </div>

                {/* XIRR */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-neutral" />
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                            XIRR
                            <span className="ml-1 text-[10px] opacity-70 cursor-help" title="Extended Internal Rate of Return - Annualized return">ⓘ</span>
                        </p>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        {formatPercent(xirr)}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">Annualized</p>
                </div>
            </div>
        </div>
    )
}
