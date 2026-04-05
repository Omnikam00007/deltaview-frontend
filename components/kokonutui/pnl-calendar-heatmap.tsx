"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { DailyPnl as DailyPnlType } from "@/lib/types"

interface DailyPnL {
    date: string
    pnl: number
    trades: number
}

export default function PnLCalendarHeatmap() {
    const [hoveredDay, setHoveredDay] = useState<DailyPnL | null>(null)
    const [loading, setLoading] = useState(true)
    const [rawData, setRawData] = useState<DailyPnlType[]>([])

    useEffect(() => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 364)

        analyticsService.listDailyPnl({
            start_date: startDate.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0],
        })
            .then(setRawData)
            .catch(() => setRawData([]))
            .finally(() => setLoading(false))
    }, [])

    // Map API data into a lookup and fill 365-day grid
    const dailyData = useMemo<DailyPnL[]>(() => {
        const lookup = new Map<string, DailyPnL>()
        rawData.forEach((entry) => {
            lookup.set(entry.trade_date, {
                date: entry.trade_date,
                pnl: entry.pnl,
                trades: entry.trade_count,
            })
        })

        const data: DailyPnL[] = []
        const today = new Date()
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const key = date.toISOString().split('T')[0]
            data.push(lookup.get(key) || { date: key, pnl: 0, trades: 0 })
        }
        return data
    }, [rawData])

    // Get color intensity based on P&L
    const getColorClass = (pnl: number) => {
        if (pnl === 0) return 'bg-border-subtle'

        const absValue = Math.abs(pnl)

        if (pnl > 0) {
            if (absValue < 1000) return 'bg-profit opacity-30'
            if (absValue < 5000) return 'bg-profit opacity-50'
            if (absValue < 10000) return 'bg-profit opacity-80'
            return 'bg-profit'
        } else {
            if (absValue < 1000) return 'bg-loss-primary opacity-30'
            if (absValue < 5000) return 'bg-loss-primary opacity-50'
            if (absValue < 10000) return 'bg-loss-primary opacity-80'
            return 'bg-loss-primary'
        }
    }

    // Organize data into weeks
    const weeks: DailyPnL[][] = []
    let currentWeek: DailyPnL[] = []

    dailyData.forEach((day, index) => {
        const dayOfWeek = new Date(day.date).getDay()

        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek)
            currentWeek = []
        }

        currentWeek.push(day)

        if (index === dailyData.length - 1) {
            weeks.push(currentWeek)
        }
    })

    // Get month labels
    const getMonthLabels = () => {
        const labels: { month: string; weekIndex: number }[] = []
        let lastMonth = -1

        weeks.forEach((week, weekIndex) => {
            const firstDay = week[0]
            if (firstDay) {
                const month = new Date(firstDay.date).getMonth()
                if (month !== lastMonth) {
                    labels.push({
                        month: new Date(firstDay.date).toLocaleDateString('en-US', { month: 'short' }),
                        weekIndex
                    })
                    lastMonth = month
                }
            }
        })

        return labels
    }

    const monthLabels = getMonthLabels()

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-4 mb-6 flex items-center justify-center h-[400px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading heatmap...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl p-4 mb-6 flex flex-col h-[400px]">
            <div className="mb-4">
                <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1">
                    P&L Calendar Heatmap
                </h3>
                <p className="text-sm font-body text-neutral-primary">
                    Daily profit/loss visualization - Spot patterns and streaks
                </p>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Month Labels */}
                    <div className="flex mb-2 ml-8">
                        {monthLabels.map((label, index) => (
                            <div
                                key={index}
                                className="text-[10px] uppercase font-bold text-neutral font-mono"
                                style={{ marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 14}px` }}
                            >
                                {label.month}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-1 relative">
                        {/* Day of week labels */}
                        <div className="flex flex-col gap-1 text-[10px] uppercase font-bold text-neutral font-mono mr-2">
                            <div className="h-3"></div>
                            <div className="h-3">Mon</div>
                            <div className="h-3"></div>
                            <div className="h-3">Wed</div>
                            <div className="h-3"></div>
                            <div className="h-3">Fri</div>
                            <div className="h-3"></div>
                        </div>

                        {/* Heatmap cells */}
                        <div className="flex gap-1">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                        const day = week.find(d => new Date(d.date).getDay() === dayIndex)

                                        if (!day) {
                                            return <div key={dayIndex} className="w-3 h-3" />
                                        }

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 ${getColorClass(day.pnl)}`}
                                                onMouseEnter={() => setHoveredDay(day)}
                                                onMouseLeave={() => setHoveredDay(null)}
                                            />
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle relative">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-neutral font-mono">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-border-subtle" />
                        <div className="w-3 h-3 rounded-sm bg-profit opacity-30" />
                        <div className="w-3 h-3 rounded-sm bg-profit opacity-50" />
                        <div className="w-3 h-3 rounded-sm bg-profit opacity-80" />
                        <div className="w-3 h-3 rounded-sm bg-profit" />
                    </div>
                    <span>More profit</span>
                    <div className="mx-2 text-border-subtle">|</div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-loss-primary opacity-30" />
                        <div className="w-3 h-3 rounded-sm bg-loss-primary opacity-50" />
                        <div className="w-3 h-3 rounded-sm bg-loss-primary opacity-80" />
                        <div className="w-3 h-3 rounded-sm bg-loss-primary" />
                    </div>
                    <span>More loss</span>
                </div>

                {/* Hover Tooltip */}
                {hoveredDay && (
                    <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono absolute right-0 bottom-full mb-2 min-w-[140px]">
                        <p className="text-neutral mb-2 border-b border-border-subtle pb-1">
                            {new Date(hoveredDay.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                        <div className="flex justify-between items-center py-0.5 mt-1 border-t border-border-subtle pt-1 text-[10px]">
                            <span className="text-neutral font-bold">{hoveredDay.trades} trades</span>
                            <span className={`font-semibold ${hoveredDay.pnl >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                {hoveredDay.pnl >= 0 ? '+' : ''}₹{Math.abs(hoveredDay.pnl).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
