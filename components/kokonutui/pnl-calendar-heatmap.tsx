"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { DailyPnl as DailyPnlType } from "@/lib/types"

interface DailyPnL {
    date: string
    realized: number
    unrealized: number
    total: number
    pnl: number // active display value
    trades: number
}

// Helper to format a UTC Date as YYYY-MM-DD
const formatUTCDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PnLCalendarHeatmap() {
    const [hoveredDay, setHoveredDay] = useState<DailyPnL | null>(null)
    const [loading, setLoading] = useState(true)
    const [rawData, setRawData] = useState<DailyPnlType[]>([])
    const [showTotal, setShowTotal] = useState(false)

    // Compute UTC today and 364 days ago
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startDateUTC = new Date(todayUTC);
    startDateUTC.setUTCDate(todayUTC.getUTCDate() - 364);

    useEffect(() => {
        const startDateStr = formatUTCDate(startDateUTC)
        const todayStr = formatUTCDate(todayUTC)

        analyticsService.listDailyPnl({
            start_date: startDateStr,
            end_date: todayStr,
        })
            .then(setRawData)
            .catch(() => setRawData([]))
            .finally(() => setLoading(false))
    }, [])

    // Map API data into a lookup and fill 365-day grid
    const dailyData = useMemo<DailyPnL[]>(() => {
        const lookup = new Map<string, DailyPnL>()
        
        const hasData = rawData.length > 0;
        if (hasData) {
            rawData.forEach((entry) => {
                const totalMetric = entry.total_pnl ?? (entry.realized_pnl + (entry.unrealized_pnl ?? 0));
                lookup.set(entry.trade_date, {
                    date: entry.trade_date,
                    realized: entry.realized_pnl ?? 0,
                    unrealized: entry.unrealized_pnl ?? 0,
                    total: totalMetric,
                    pnl: showTotal ? totalMetric : (entry.realized_pnl ?? 0),
                    trades: entry.trade_count ?? 0,
                })
            })
        }

        const data: DailyPnL[] = []
        for (let i = 0; i <= 364; i++) {
            const currentDate = new Date(startDateUTC);
            currentDate.setUTCDate(startDateUTC.getUTCDate() + i);
            const key = formatUTCDate(currentDate);
            data.push(lookup.get(key) || { date: key, realized: 0, unrealized: 0, total: 0, pnl: 0, trades: 0 })
        }
        return data
    }, [rawData, showTotal])

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
            if (absValue < 1000) return 'bg-loss opacity-30'
            if (absValue < 5000) return 'bg-loss opacity-50'
            if (absValue < 10000) return 'bg-loss opacity-80'
            return 'bg-loss'
        }
    }

    // Organize data into weeks
    const weeks: DailyPnL[][] = []
    let currentWeek: DailyPnL[] = []

    dailyData.forEach((day, index) => {
        // String parse day.date is YYYY-MM-DD. new Date("YYYY-MM-DD").getUTCDay() gets correct day ignoring local timezone shift.
        const dayOfWeek = new Date(day.date).getUTCDay()

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
                const month = new Date(firstDay.date).getUTCMonth()
                if (month !== lastMonth) {
                    // Use a safe date string for Month format to prevent locale bugs.
                    const safeDate = new Date(firstDay.date);
                    // use getUTCMonth to explicitly map
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    labels.push({
                        month: monthNames[month],
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
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1">
                        P&L Calendar Heatmap
                    </h3>
                    <p className="text-sm font-body text-neutral-primary cursor-pointer hover:text-white transition-colors" onClick={() => setShowTotal(!showTotal)}>
                        Currently showing: <span className="underline decoration-dashed opacity-75 decoration-blue-500">{showTotal ? 'Total P&L (Realized + Unrealized)' : 'Realized P&L Only'}</span>
                    </p>
                </div>
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
                                style={{ marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 16}px` }}
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
                                        const day = week.find(d => new Date(d.date).getUTCDay() === dayIndex)

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
                        <div className="w-3 h-3 rounded-sm bg-loss opacity-30" />
                        <div className="w-3 h-3 rounded-sm bg-loss opacity-50" />
                        <div className="w-3 h-3 rounded-sm bg-loss opacity-80" />
                        <div className="w-3 h-3 rounded-sm bg-loss" />
                    </div>
                    <span>More loss</span>
                </div>

                {/* Hover Tooltip */}
                {hoveredDay && (
                    <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono absolute right-0 bottom-full mb-2 min-w-[140px]">
                        <p className="text-neutral mb-2 border-b border-border-subtle pb-1">
                            {/* Parse the date splitting to avoid UTC midnight shifting backwards one day */}
                            {hoveredDay.date.split('-').reverse().join('-')}
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 py-0.5 mt-1 border-t border-border-subtle pt-2 text-[10px]">
                            <span className="text-neutral font-bold col-span-2 mb-1">{hoveredDay.trades} trades executed</span>
                            
                            <span className="text-neutral">Realized:</span>
                            <span className={`font-semibold text-right ${hoveredDay.realized >= 0 ? 'text-profit' : 'text-loss'}`}>
                                {hoveredDay.realized >= 0 ? '+' : ''}₹{Math.abs(hoveredDay.realized).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            </span>
                            
                            <span className="text-neutral">Unrealized:</span>
                            <span className={`font-semibold text-right ${hoveredDay.unrealized >= 0 ? 'text-profit' : 'text-loss'}`}>
                                {hoveredDay.unrealized >= 0 ? '+' : ''}₹{Math.abs(hoveredDay.unrealized).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            </span>
                            
                            <span className="text-white font-bold mt-1 pt-1 border-t border-border-subtle">Total PnL:</span>
                            <span className={`font-bold text-right border-t border-border-subtle pt-1 mt-1 ${hoveredDay.total >= 0 ? 'text-profit' : 'text-loss'}`}>
                                {hoveredDay.total >= 0 ? '+' : ''}₹{Math.abs(hoveredDay.total).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
