"use client"

import { PlusCircle, MinusCircle, RefreshCw, FileText, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { marketService, type MarketIndex } from "@/lib/services/market.service"

export default function BottomWidgets() {
    const [indices, setIndices] = useState<MarketIndex[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        marketService.getIndices()
            .then(setIndices)
            .catch(() => setIndices([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Actions */}
            <div className="bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface">
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                        Quick Actions
                    </h3>
                </div>
                <div className="p-2 flex gap-2">
                    <button className="flex-1 flex flex-col items-center justify-center p-4 border border-border-subtle rounded hover:border-accent-blue hover:bg-accent-blue/5 transition-all group">
                        <div className="h-8 w-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-2 group-hover:bg-accent-blue group-hover:text-white transition-colors">
                            <PlusCircle className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral group-hover:text-accent-blue">Add Funds</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center p-4 border border-border-subtle rounded hover:border-warning hover:bg-warning/5 transition-all group">
                        <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-2 group-hover:bg-warning group-hover:text-white transition-colors">
                            <MinusCircle className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral group-hover:text-warning">Withdraw</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center p-4 border border-border-subtle rounded hover:border-profit hover:bg-profit/5 transition-all group">
                        <div className="h-8 w-8 rounded-full bg-profit/10 flex items-center justify-center text-profit mb-2 group-hover:bg-profit group-hover:text-white transition-colors">
                            <RefreshCw className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral group-hover:text-profit">Sync Brokers</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center p-4 border border-border-subtle rounded hover:border-foreground hover:bg-foreground/5 transition-all group">
                        <div className="h-8 w-8 rounded-full bg-neutral/10 flex items-center justify-center text-foreground mb-2 group-hover:bg-foreground group-hover:text-background transition-colors">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral group-hover:text-foreground">Tax Report</span>
                    </button>
                </div>
            </div>

            {/* Market Summary */}
            <div className="bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface">
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase flex items-center gap-2">
                        Market Summary <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-profit"></span></span>
                    </h3>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1 justify-center">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                            <span className="ml-2 text-sm text-neutral">Loading market data...</span>
                        </div>
                    ) : indices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-foreground font-bold font-display mb-2 text-sm">Market data unavailable</p>
                            <p className="text-xs text-neutral">Data will refresh automatically</p>
                        </div>
                    ) : (
                        (Array.isArray(indices) ? indices : []).map((idx) => {
                            const isPositive = (idx?.change ?? 0) >= 0
                            const label = idx?.symbol === "^INDIAVIX" ? (
                                <span className="font-semibold text-foreground tracking-tight flex items-center gap-2">
                                    {idx.name} <span className="text-[8px] border border-border-subtle px-1 py-0.5 bg-background text-neutral rounded font-mono">VOLATILITY</span>
                                </span>
                            ) : (
                                <span className="font-semibold text-foreground tracking-tight">{idx.name}</span>
                            )

                            return (
                                <div key={idx?.symbol || Math.random()} className="flex items-center justify-between p-2 rounded hover:bg-surface-hover cursor-pointer border border-transparent hover:border-border-subtle transition-colors">
                                    {label}
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-foreground">
                                            {idx?.value?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-widest font-mono font-bold px-1.5 py-0.5 rounded flex items-center ${
                                            isPositive
                                                ? 'text-profit bg-profit/10 border border-profit/20'
                                                : 'text-loss-primary bg-loss-primary/10 border border-loss-primary/20'
                                        }`}>
                                            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                            {Math.abs(idx?.change ?? 0).toFixed(2)} ({Math.abs(idx?.change_percent ?? 0).toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
