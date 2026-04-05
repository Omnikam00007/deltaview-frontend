"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowUpRight, ArrowDownRight, Minus, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { holdingsService } from "@/lib/services/holdings.service"
import type { Holding } from "@/lib/types"

interface AllocationSlice {
    name: string
    value: number
    color: string
    percentage: number
    dayChange: number
    isPositive: boolean | null
}

const SEGMENT_COLORS: Record<string, string> = {
    "Equity": "var(--accent-blue)",
    "NSE": "var(--accent-blue)",
    "BSE": "var(--accent-blue)",
    "Mutual Funds": "var(--profit-primary)",
    "MF": "var(--profit-primary)",
    "Gold": "var(--warning)",
    "Cash": "var(--neutral-primary)",
}

function deriveAllocation(holdings: Holding[]): AllocationSlice[] {
    const groups: Record<string, { value: number; count: number }> = {}

    for (const h of holdings) {
        const segment = h.instrument?.segment || h.instrument?.exchange || "Other"
        if (!groups[segment]) groups[segment] = { value: 0, count: 0 }
        groups[segment].value += h.current_value ?? h.quantity * (h.ltp ?? h.avg_cost)
        groups[segment].count++
    }

    const totalValue = Object.values(groups).reduce((s, g) => s + g.value, 0)
    const colorKeys = Object.keys(SEGMENT_COLORS)

    return Object.entries(groups)
        .sort((a, b) => b[1].value - a[1].value)
        .map(([name, g], i) => ({
            name,
            value: Math.round(g.value),
            color: SEGMENT_COLORS[name] || `hsl(${(i * 60 + 200) % 360}, 60%, 55%)`,
            percentage: totalValue > 0 ? Math.round((g.value / totalValue) * 1000) / 10 : 0,
            dayChange: 0,
            isPositive: null,
        }))
}

export default function AssetAllocationDonut() {
    const [data, setData] = useState<AllocationSlice[]>([])
    const [loading, setLoading] = useState(true)
    const [totalValue, setTotalValue] = useState(0)

    useEffect(() => {
        holdingsService.list()
            .then((holdings) => {
                const slices = deriveAllocation(holdings)
                setData(slices)
                setTotalValue(slices.reduce((s, d) => s + d.value, 0))
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex items-center justify-center h-full shadow-sm min-h-[300px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex flex-col items-center justify-center h-full shadow-sm min-h-[300px] text-center px-4">
                <p className="text-foreground font-bold font-display mb-2">No Holdings</p>
                <p className="text-sm text-neutral">Add holdings to see your asset allocation breakdown.</p>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center">
                <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                    Asset Allocation
                </h3>
                <span className="text-[10px] text-neutral uppercase tracking-wider font-semibold">{data.length} segments</span>
            </div>

            <div className="flex-1 flex flex-col p-5">
                {/* Donut Chart */}
                <div className="h-[200px] w-full relative mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload
                                        return (
                                            <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                                    <span className="font-semibold text-foreground">{d.name}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between gap-4 text-neutral">Value: <span className="text-foreground">₹{d.value.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between gap-4 text-neutral">Allocation: <span className="text-foreground">{d.percentage}%</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Value */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center flex flex-col items-center">
                            <span className="text-[10px] text-neutral font-bold uppercase tracking-widest mb-0.5">Total Value</span>
                            <span className="text-xl font-bold font-mono tracking-tighter text-foreground">
                                ₹{(totalValue / 100000).toFixed(2)}L
                            </span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-3 mt-auto">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between group cursor-pointer p-1.5 -mx-1.5 rounded hover:bg-surface-hover transition-colors w-full">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-semibold text-foreground truncate">{item.name}</span>
                            </div>
                            
                            <div className="text-xs font-mono text-neutral w-16 text-right shrink-0">
                                {(item.value / 1000).toFixed(0)}K
                            </div>

                            <div className="flex items-center justify-end w-20 shrink-0">
                                <span className="text-[10px] font-mono text-neutral font-bold w-10 text-right mr-2">{item.percentage}%</span>
                                <div className="hidden sm:block w-8 h-1.5 bg-background rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
