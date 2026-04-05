"use client"

import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { Maximize2, MoreHorizontal, Loader2 } from "lucide-react"
import { analyticsService } from "@/lib/services/analytics.service"
import { holdingsService } from "@/lib/services/holdings.service"
import type { PortfolioSnapshot, PortfolioSummary } from "@/lib/types"

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL"

function getDateRange(period: TimePeriod): { start_date?: string; end_date?: string } {
    const now = new Date()
    const end = now.toISOString().split("T")[0]
    let start: Date

    switch (period) {
        case "1D": start = new Date(now.getTime() - 1 * 86400000); break
        case "1W": start = new Date(now.getTime() - 7 * 86400000); break
        case "1M": start = new Date(now.getTime() - 30 * 86400000); break
        case "3M": start = new Date(now.getTime() - 90 * 86400000); break
        case "6M": start = new Date(now.getTime() - 180 * 86400000); break
        case "1Y": start = new Date(now.getTime() - 365 * 86400000); break
        default: return {} // ALL - no filter
    }

    return { start_date: start.toISOString().split("T")[0], end_date: end }
}

export default function AccountValueCurve() {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M")
    const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([])
    const [summary, setSummary] = useState<PortfolioSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        holdingsService.getSummary().then(setSummary).catch(() => null)
    }, [])

    useEffect(() => {
        setLoading(true)
        const range = getDateRange(selectedPeriod)
        analyticsService.listPortfolioSnapshots(range)
            .then(setSnapshots)
            .catch(() => setSnapshots([]))
            .finally(() => setLoading(false))
    }, [selectedPeriod])

    const chartData = (Array.isArray(snapshots) ? snapshots : []).map((s) => ({
        date: s?.snapshot_date ? new Date(s.snapshot_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        value: s?.total_value ?? 0,
        benchmark: s?.total_invested ?? 0,
    }))

    const currentValue = summary?.current_value ?? 0
    const totalPnl = summary?.total_pnl ?? 0
    const totalPnlPercent = summary?.total_pnl_percent ?? 0

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const val = payload.find((p: any) => p.dataKey === "value")?.value
            const bm = payload.find((p: any) => p.dataKey === "benchmark")?.value

            return (
                <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono">
                    <div className="text-neutral mb-2 border-b border-border-subtle pb-1">{label}</div>
                    <div className="flex justify-between items-center gap-4 py-0.5">
                        <span className="flex items-center text-profit"><div className="w-1.5 h-1.5 rounded-full bg-profit mr-1.5"/>Portfolio</span>
                        <span className="font-semibold text-foreground">₹{val?.toLocaleString('en-IN')}</span>
                    </div>
                    {bm > 0 && (
                        <div className="flex justify-between items-center gap-4 py-0.5">
                            <span className="flex items-center text-neutral"><div className="w-1.5 h-1.5 rounded-full bg-neutral mr-1.5"/>Invested</span>
                            <span className="font-semibold text-foreground">₹{bm?.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm hover:border-border transition-colors group">
            
            {/* Header Section */}
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase flex items-center gap-2">
                        Account Value Growth
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-background border border-border-subtle text-neutral normal-case">Realized + Unrealized</span>
                    </h3>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono">
                        <div>
                            <div className="text-2xl font-bold tracking-tight text-foreground">₹{currentValue.toLocaleString('en-IN')}</div>
                            <div className={`text-xs flex items-center font-medium mt-1 ${totalPnl >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                {totalPnl >= 0 ? '▲' : '▼'} {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN')} <span className="text-neutral ml-1">({totalPnlPercent.toFixed(1)}% total)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-surface-hover text-neutral transition-colors">
                            <Maximize2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-surface-hover text-neutral transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center bg-background border border-border-subtle rounded p-0.5">
                        {(["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"] as TimePeriod[]).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-2 py-1 text-[10px] font-bold font-mono transition-colors rounded-sm ${selectedPeriod === period
                                        ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                        : 'text-neutral hover:text-foreground'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 p-5 min-h-[300px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                        <span className="ml-2 text-sm text-neutral">Loading chart...</span>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <p className="text-foreground font-bold font-display mb-2">No Snapshot Data</p>
                        <p className="text-sm text-neutral max-w-xs">
                            Portfolio snapshots will appear here as your portfolio is tracked over time.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--profit-primary)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--profit-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                            
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--neutral-primary)', fontSize: 10, fontFamily: 'monospace' }}
                                dy={10}
                            />
                            
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--neutral-primary)', fontSize: 10, fontFamily: 'monospace' }}
                                tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                                domain={['dataMin - 50000', 'auto']}
                            />

                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--neutral-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />

                            {/* Benchmark Line (Invested Amount) */}
                            <Line yAxisId="left" type="monotone" dataKey="benchmark" stroke="var(--neutral-primary)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            
                            {/* Main Portfolio Area */}
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="value"
                                stroke="var(--profit-primary)"
                                strokeWidth={2}
                                fill="url(#colorProfit)"
                                activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--profit-primary)' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
