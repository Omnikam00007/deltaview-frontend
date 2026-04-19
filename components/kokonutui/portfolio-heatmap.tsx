"use client"

import { Treemap, ResponsiveContainer, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { holdingsService } from "@/lib/services/holdings.service"
import type { ConsolidatedHolding } from "@/lib/types"

interface HeatmapTile {
    name: string
    value: number
    change: number
    color: string
}

function deriveHeatmap(holdings: ConsolidatedHolding[]): HeatmapTile[] {
    if (!Array.isArray(holdings)) return []
    return holdings.map((h) => {
        const cv = h?.current_value ?? (h?.quantity ?? 0) * (h?.ltp ?? h?.avg_cost ?? 0)
        const pnlPct = h?.pnl_percent ?? 0
        return {
            name: h?.instrument?.symbol ?? "?",
            value: Math.max(cv, 100), // Treemap needs positive values
            change: Math.round(pnlPct * 10) / 10,
            color: pnlPct >= 0 ? "var(--profit-primary)" : "var(--loss-primary)",
        }
    }).sort((a, b) => b.value - a.value)
}

const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, value, change } = props

    if (width < 60 || height < 40) return null
    
    const safeChange = Number.isFinite(change) ? change : 0
    const intensity = Math.min(Math.abs(safeChange) / 5, 1) * 0.5 + 0.5

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: props.color,
                    stroke: 'var(--surface)',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    fillOpacity: intensity
                }}
                className="hover:opacity-80 transition-opacity cursor-pointer stroke-surface"
            />
            <text
                x={x + 10}
                y={y + 20}
                fill="#ffffff"
                fontSize={width > 100 ? 12 : 10}
                className="font-bold underline tracking-wider font-display uppercase"
            >
                {name}
            </text>
            <text
                x={x + 10}
                y={y + 40}
                fill="#ffffff"
                fontSize={width > 100 ? 14 : 11}
                className="font-mono font-bold"
                opacity={0.9}
            >
                ₹{(value / 1000).toFixed(0)}K
            </text>
            {width > 80 && height > 60 && (
                <text
                    x={x + width - 10}
                    y={y + height - 10}
                    textAnchor="end"
                    fill="#ffffff"
                    fontSize={11}
                    className="font-mono font-bold bg-black/20"
                >
                    {change > 0 ? '▲ ' : '▼ '}{Math.abs(change)}%
                </text>
            )}
        </g>
    )
}

export default function PortfolioHeatmap() {
    const [tiles, setTiles] = useState<HeatmapTile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        holdingsService.listConsolidated()
            .then((holdings) => setTiles(deriveHeatmap(holdings)))
            .catch(() => setTiles([]))
            .finally(() => setLoading(false))
    }, [])

    const best = [...tiles].filter(t => t.change > 0).sort((a, b) => b.change - a.change).slice(0, 2)
    const worst = [...tiles].filter(t => t.change < 0).sort((a, b) => a.change - b.change).slice(0, 2)

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex items-center justify-center h-full shadow-sm min-h-[300px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
            </div>
        )
    }

    if (tiles.length === 0) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex flex-col items-center justify-center h-full shadow-sm min-h-[300px] text-center px-4">
                <p className="text-foreground font-bold font-display mb-2">No Holdings</p>
                <p className="text-sm text-neutral">Add holdings to see your portfolio heatmap.</p>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface">
                <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                    Portfolio Heatmap
                </h3>
                <span className="flex items-center text-[10px] text-neutral uppercase tracking-wider font-semibold">
                    Size: Value // Color: Return
                </span>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
                {/* Treemap Container */}
                <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={tiles}
                            dataKey="value"
                            stroke="none"
                            content={<CustomizedContent />}
                        >
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload
                                        return (
                                            <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-mono">
                                                <div className="text-foreground tracking-widest uppercase font-bold mb-2 pb-1 border-b border-border-subtle">
                                                    {data.name}
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between gap-4 text-neutral">Value: <span className="text-foreground font-bold">₹{data.value.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between gap-4 text-neutral">Return: <span className={`font-bold ${data.change > 0 ? 'text-profit' : 'text-loss-primary'}`}>{data.change > 0 ? '▲ ' : '▼ '}{Math.abs(data.change)}%</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                </div>
                
                {/* Best/Worst Performers Sidebar */}
                <div className="w-full lg:w-32 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border-subtle pt-4 lg:pt-0 lg:pl-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-[10px] uppercase font-bold text-neutral tracking-widest">Best Perf</div>
                        <div className="flex flex-col gap-1 text-[11px] font-mono font-bold">
                            {best.length > 0 ? best.map(t => (
                                <span key={t.name} className="text-profit flex justify-between"><span>▲ {t.name.slice(0, 6)}</span><span>+{t.change}%</span></span>
                            )) : (
                                <span className="text-neutral">—</span>
                            )}
                        </div>
                    </div>
                    <div className="h-[1px] w-full bg-border-subtle"></div>
                    <div className="flex flex-col gap-2">
                        <div className="text-[10px] uppercase font-bold text-neutral tracking-widest">Worst Perf</div>
                        <div className="flex flex-col gap-1 text-[11px] font-mono font-bold">
                            {worst.length > 0 ? worst.map(t => (
                                <span key={t.name} className="text-loss-primary flex justify-between"><span>▼ {t.name.slice(0, 6)}</span><span>{t.change}%</span></span>
                            )) : (
                                <span className="text-neutral">—</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
