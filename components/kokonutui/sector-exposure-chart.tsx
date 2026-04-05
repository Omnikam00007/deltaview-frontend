"use client"

import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { holdingsService } from "@/lib/services/holdings.service"
import type { Holding } from "@/lib/types"

interface SectorSlice {
    name: string
    value: number
    percentage: number
    dayChange: number
    isPositive: boolean
}

function deriveSectors(holdings: Holding[]): SectorSlice[] {
    const groups: Record<string, number> = {}

    for (const h of holdings) {
        const sector = h.instrument?.sector || "Other"
        const value = h.current_value ?? h.quantity * (h.ltp ?? h.avg_cost)
        groups[sector] = (groups[sector] ?? 0) + value
    }

    const totalValue = Object.values(groups).reduce((s, v) => s + v, 0)

    return Object.entries(groups)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
            name,
            value: Math.round(value),
            percentage: totalValue > 0 ? Math.round((value / totalValue) * 1000) / 10 : 0,
            dayChange: 0,
            isPositive: true,
        }))
}

export default function SectorExposureChart() {
    const [sectors, setSectors] = useState<SectorSlice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        holdingsService.list()
            .then((holdings) => setSectors(deriveSectors(holdings)))
            .catch(() => setSectors([]))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-5 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
            </div>
        )
    }

    if (sectors.length === 0) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] text-center">
                <p className="text-foreground font-bold font-display mb-2">No Sector Data</p>
                <p className="text-sm text-neutral">Add holdings with sector information to see exposure breakdown.</p>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col gap-4">
            <div className="border-b border-border-subtle pb-4 flex justify-between items-center">
                <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral">
                    Sector Exposure
                </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5">
                {sectors.map((sector) => (
                    <div key={sector.name} className="flex flex-col gap-2 group cursor-pointer">
                        {/* Label Row */}
                        <div className="flex items-end justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-foreground uppercase tracking-widest">{sector.name}</span>
                                <span className="text-[10px] font-mono font-bold text-neutral bg-background px-1.5 py-0.5 rounded border border-border-subtle">{sector.percentage}%</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-xs font-mono text-neutral">
                                    ₹{(sector.value / 1000).toFixed(0)}K
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-background border border-border-subtle rounded-full overflow-hidden relative">
                            <div 
                                className="h-full rounded-full transition-all duration-500 bg-neutral group-hover:bg-accent-blue" 
                                style={{ width: `${sector.percentage}%` }}
                            >
                                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.5) 4px, rgba(255,255,255,0.5) 8px)' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 mt-auto border-t border-border-subtle text-[10px] text-neutral text-center uppercase tracking-widest font-semibold flex justify-between">
                <span>Total {sectors.length} Sectors</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">View All Sectors →</span>
            </div>
        </div>
    )
}
