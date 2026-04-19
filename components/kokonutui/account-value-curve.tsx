"use client"

import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { analyticsService } from "@/lib/services/analytics.service"
import { holdingsService } from "@/lib/services/holdings.service"
import type { PortfolioSnapshot, PortfolioSummary } from "@/lib/types"

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL"

function getDateRange(period: TimePeriod): { start_date?: string; end_date?: string } {
    const now = new Date()
    const end = now.toLocaleDateString('en-CA')
    let start: Date

    switch (period) {
        case "1D": start = new Date(now.getTime() - 1 * 86400000); break
        case "1W": start = new Date(now.getTime() - 7 * 86400000); break
        case "1M": start = new Date(now.getTime() - 30 * 86400000); break
        case "3M": start = new Date(now.getTime() - 90 * 86400000); break
        case "6M": start = new Date(now.getTime() - 180 * 86400000); break
        case "1Y": start = new Date(now.getTime() - 365 * 86400000); break
        default: return {}
    }

    return { start_date: start.toLocaleDateString('en-CA'), end_date: end }
}

function computeYDomain(values: number[]): [number, number] {
    const finite = values.filter(v => Number.isFinite(v))
    if (finite.length === 0) return [0, 10000]

    const dataMin = Math.min(...finite)
    const dataMax = Math.max(...finite)

    if (dataMin === dataMax) {
        const band = Math.abs(dataMin) * 0.15 || 5000
        return [Math.floor(dataMin - band), Math.ceil(dataMax + band)]
    }

    const range = dataMax - dataMin
    const pad = range * 0.15
    return [Math.floor(dataMin - pad), Math.ceil(dataMax + pad)]
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

    const chartData = useMemo(() => {
        const unique: PortfolioSnapshot[] = []
        const seen = new Set<string>()

        for (const s of (Array.isArray(snapshots) ? snapshots : [])) {
            if (s?.snapshot_date && !seen.has(s.snapshot_date)) {
                seen.add(s.snapshot_date)
                unique.push(s)
            }
        }

        return unique
            .reverse()
            .map((s) => {
                let timestamp = 0
                if (s?.snapshot_date) {
                    const [y, m, d] = s.snapshot_date.split('-').map(Number)
                    if (y && m && d) timestamp = new Date(y, m - 1, d).getTime()
                }
                return {
                    timestamp,
                    value: Number(s?.total_value) || 0,
                    benchmark: Number(s?.total_invested) || 0,
                }
            })
            .sort((a, b) => a.timestamp - b.timestamp)
    }, [snapshots])

    const currentValue = summary?.current_value ?? 0
    const totalPnl = summary?.total_pnl ?? 0

    const chartDelta = chartData.length > 1 ? chartData.at(-1)!.value - chartData[0].value : totalPnl

    // Include both value AND benchmark in the Y domain so both curves are visible
    const [yMin, yMax] = useMemo(() => {
        const allValues = chartData.flatMap(d => [d.value, d.benchmark])
        return computeYDomain(allValues)
    }, [chartData])

    const isProfit = chartDelta >= 0
    const strokeColor = isProfit ? "#10b981" : "#ef4444"

    const tickFmt = (v: number) => {
        if (!Number.isFinite(v)) return ''
        const abs = Math.abs(v)
        if (abs >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`
        if (abs >= 100000) return `${(v / 100000).toFixed(1)}L`
        if (abs >= 1000) return `${(v / 1000).toFixed(1)}K`
        return v.toFixed(0)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null
        const fmtDate = (t: number) =>
            new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

        const val = payload.find((p: any) => p.dataKey === "value")?.value ?? 0
        const bm = payload.find((p: any) => p.dataKey === "benchmark")?.value ?? 0
        const pnl = val - bm
        return (
            <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono">
                <div className="text-neutral mb-2 border-b border-border-subtle pb-1">{fmtDate(label)}</div>
                <div className="flex justify-between gap-4 py-0.5">
                    <span className="flex items-center text-profit">
                        <span className="w-1.5 h-1.5 rounded-full bg-profit inline-block mr-1.5" />Portfolio Value
                    </span>
                    <span className="font-semibold text-foreground">₹{Number(val).toLocaleString('en-IN')}</span>
                </div>
                {bm > 0 && (
                    <div className="flex justify-between gap-4 py-0.5">
                        <span className="flex items-center text-neutral">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral inline-block mr-1.5" />Invested
                        </span>
                        <span className="font-semibold text-foreground">₹{Number(bm).toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="flex justify-between gap-4 py-0.5 mt-1 border-t border-border-subtle pt-1">
                    <span className="font-bold text-neutral">P&L</span>
                    <span className={`font-bold ${pnl >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                        {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN')}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm hover:border-border transition-colors">

            {/* Header */}
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                        Account Value Growth
                    </h3>

                    <div className="mt-4 font-mono">
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            ₹{currentValue.toLocaleString('en-IN')}
                        </div>
                        <div className={`text-xs flex items-center font-medium mt-1 ${totalPnl >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                            {totalPnl >= 0 ? '▲' : '▼'} {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN')}
                            <span className="text-neutral ml-1">(Total P&L)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center bg-background border border-border-subtle rounded p-0.5">
                    {(["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"] as TimePeriod[]).map((period) => (
                        <button key={period} onClick={() => setSelectedPeriod(period)}
                            className={`px-2 py-1 text-[10px] font-bold font-mono transition-colors rounded-sm ${selectedPeriod === period
                                ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                : 'text-neutral hover:text-foreground'
                                }`}>
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
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
                            Portfolio snapshots are missing. Backfill historic records using your trade ledger.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradLoss" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />

                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                scale="time"
                                domain={['dataMin', 'dataMax']}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--neutral-primary)', fontSize: 10, fontFamily: 'monospace' }}
                                tickFormatter={(t) => new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                dy={10}
                                minTickGap={30}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={58}
                                tick={{ fill: 'var(--neutral-primary)', fontSize: 10, fontFamily: 'monospace' }}
                                tickFormatter={tickFmt}
                                domain={[yMin, yMax]}
                            />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: 'var(--neutral-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />

                            {/* Benchmark (Invested) dashed line */}
                            <Line
                                type="monotone"
                                dataKey="benchmark"
                                stroke="var(--neutral-primary)"
                                strokeWidth={1.5}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                            />

                            {/* Portfolio Value curve */}
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={strokeColor}
                                strokeWidth={2.5}
                                fill={isProfit ? "url(#gradProfit)" : "url(#gradLoss)"}
                                fillOpacity={1}
                                isAnimationActive={false}
                                dot={chartData.length <= 3 ? { r: 5, fill: strokeColor, strokeWidth: 0 } : false}
                                activeDot={{ r: 5, strokeWidth: 0, fill: strokeColor }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}