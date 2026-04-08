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
    const end = now.toLocaleDateString('en-CA')
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

    return { start_date: start.toLocaleDateString('en-CA'), end_date: end }
}

export default function AccountValueCurve() {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M")
    const [chartMode, setChartMode] = useState<"value" | "pnl">("value")
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

    // Reverse to display chronological left-to-right
    const chartData = [...(Array.isArray(snapshots) ? snapshots : [])].reverse().map((s) => ({
        date: s?.snapshot_date ? new Date(s.snapshot_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        value: s?.total_value ?? 0,
        benchmark: s?.total_invested ?? 0,
        realized: s?.total_realized_pnl ?? 0,
        unrealized: s?.total_unrealized_pnl ?? 0,
        totalPnl: s?.total_pnl ?? 0,
    }))

    const currentValue = summary?.current_value ?? 0
    const totalPnl = summary?.total_pnl ?? 0
    
    // Fallback extract latest snapshot metrics if summary unavailable
    const latestSnapshot = snapshots[0]
    const activeRealized = latestSnapshot?.total_realized_pnl ?? 0;
    const activeUnrealized = latestSnapshot?.total_unrealized_pnl ?? 0;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            if (chartMode === "value") {
                const val = payload.find((p: any) => p.dataKey === "value")?.value
                const bm = payload.find((p: any) => p.dataKey === "benchmark")?.value

                return (
                    <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono">
                        <div className="text-neutral mb-2 border-b border-border-subtle pb-1">{label}</div>
                        <div className="flex justify-between items-center gap-4 py-0.5">
                            <span className="flex items-center text-profit"><div className="w-1.5 h-1.5 rounded-full bg-profit mr-1.5"/>Portfolio Value</span>
                            <span className="font-semibold text-foreground">₹{val?.toLocaleString('en-IN')}</span>
                        </div>
                        {bm > 0 && (
                            <div className="flex justify-between items-center gap-4 py-0.5">
                                <span className="flex items-center text-neutral"><div className="w-1.5 h-1.5 rounded-full bg-neutral mr-1.5"/>Invested Basis</span>
                                <span className="font-semibold text-foreground">₹{bm?.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                    </div>
                )
            } else {
                const rel = payload.find((p: any) => p.dataKey === "realized")?.value || 0
                const unrel = payload.find((p: any) => p.dataKey === "unrealized")?.value || 0
                const tot = payload.find((p: any) => p.dataKey === "totalPnl")?.value || 0
                
                return (
                    <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono min-w-[200px]">
                        <div className="text-neutral mb-2 border-b border-border-subtle pb-1">{label}</div>
                        <div className="flex justify-between items-center gap-4 py-0.5">
                            <span className="flex items-center text-profit"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5"/>Realized (All-Time)</span>
                            <span className={`font-semibold ${rel >= 0 ? "text-profit" : "text-loss"}`}>₹{rel?.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 py-0.5">
                            <span className="flex items-center text-blue-500"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"/>Unrealized (Current M2M)</span>
                            <span className={`font-semibold ${unrel >= 0 ? "text-profit" : "text-loss"}`}>₹{unrel?.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 py-0.5 mt-1 border-t border-border-subtle pt-1">
                            <span className="flex items-center text-neutral font-bold tracking-tight">Total PnL</span>
                            <span className={`font-bold ${tot >= 0 ? "text-profit" : "text-loss"}`}>₹{tot?.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                    </div>
                )
            }
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
                    </h3>
                    
                    {/* Dynamic Metric Display based on Mode */}
                    {chartMode === "value" ? (
                        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono">
                            <div>
                                <div className="text-2xl font-bold tracking-tight text-foreground">₹{currentValue.toLocaleString('en-IN')}</div>
                                <div className={`text-xs flex items-center font-medium mt-1 ${totalPnl >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                    {totalPnl >= 0 ? '▲' : '▼'} {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN')} <span className="text-neutral ml-1">(Total P&L)</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 flex gap-4 font-mono divide-x divide-border-subtle">
                            <div className="pr-4">
                                <div className="text-xs text-neutral mb-1 uppercase tracking-widest font-bold font-sans">Total PnL</div>
                                <div className={`text-xl font-bold tracking-tight ${(totalPnl) >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                    {(totalPnl) >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="px-4">
                                <div className="text-xs text-neutral mb-1 uppercase tracking-widest font-bold font-sans">Realized PnL</div>
                                <div className={`text-lg font-bold tracking-tight ${activeRealized >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                    {activeRealized >= 0 ? '+' : ''}₹{Math.abs(activeRealized).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className="pl-4">
                                <div className="text-xs text-neutral mb-1 uppercase tracking-widest font-bold font-sans">Unrealized M2M</div>
                                <div className={`text-lg font-bold tracking-tight ${activeUnrealized >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                    {activeUnrealized >= 0 ? '+' : ''}₹{Math.abs(activeUnrealized).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        {/* Chart Mode Toggle */}
                        <div className="flex items-center bg-background border border-border-subtle rounded p-0.5 mr-2">
                            <button
                                onClick={() => setChartMode("value")}
                                className={`px-2 py-1 text-[10px] font-bold uppercase transition-colors rounded-sm ${chartMode === "value"
                                    ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                    : 'text-neutral hover:text-foreground'
                                }`}
                            >
                                Total Value
                            </button>
                            <button
                                onClick={() => setChartMode("pnl")}
                                className={`px-2 py-1 text-[10px] font-bold uppercase transition-colors rounded-sm ${chartMode === "pnl"
                                    ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                    : 'text-neutral hover:text-foreground'
                                }`}
                            >
                                PnL Breakdown
                            </button>
                        </div>
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
                        <p className="text-sm text-neutral max-w-xs mb-4">
                            Portfolio snapshots are missing! You can backfill historic snapshot records using your trade ledger.
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

                            {chartMode === "value" ? (
                                <>
                                    {/* Benchmark Line (Invested Amount) */}
                                    <Line yAxisId="left" type="monotone" dataKey="benchmark" stroke="var(--neutral-primary)" strokeWidth={2} dot={chartData.length === 1 ? { r: 3, fill: 'var(--neutral-primary)' } : false} strokeDasharray="5 5" />
                                    
                                    {/* Main Portfolio Area */}
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--profit-primary)"
                                        strokeWidth={2}
                                        fill="url(#colorProfit)"
                                        activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--profit-primary)' }}
                                        dot={chartData.length === 1 ? { r: 4, fill: 'var(--profit-primary)', strokeWidth: 0 } : false}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Dual Line or Area for Breakdown */}
                                    <Line yAxisId="left" type="monotone" dataKey="realized" stroke="#10b981" strokeWidth={2} dot={chartData.length === 1 ? { r: 3, fill: '#10b981' } : false} />
                                    <Line yAxisId="left" type="monotone" dataKey="unrealized" stroke="#3b82f6" strokeWidth={2} dot={chartData.length === 1 ? { r: 3, fill: '#3b82f6' } : false} strokeDasharray="3 3"/>
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="totalPnl"
                                        stroke="var(--foreground)"
                                        strokeWidth={2}
                                        fill="transparent"
                                        activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--foreground)' }}
                                        dot={chartData.length === 1 ? { r: 4, fill: 'var(--foreground)', strokeWidth: 0 } : false}
                                    />
                                </>
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
