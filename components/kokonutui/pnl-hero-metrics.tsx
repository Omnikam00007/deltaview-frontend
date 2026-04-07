"use client"

import { TrendingUp, TrendingDown, DollarSign, Receipt, Wallet, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { RealizedPnl } from "@/lib/types"

export default function PnLHeroMetrics() {
    const [showChargeBreakdown, setShowChargeBreakdown] = useState(false)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<RealizedPnl[]>([])

    useEffect(() => {
        analyticsService.listRealizedPnl()
            .then(setData)
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [])

    const realizedPnL = data.reduce((s, d) => s + (d.gross_pnl ?? 0), 0)
    const totalCharges = data.reduce((s, d) => s + (d.charges_total ?? 0), 0)
    const chargeBreakdown = {
        brokerage: 0,
        stt: 0,
        gst: 0,
        stampDuty: 0,
        total: totalCharges,
    }
    const netRealizedPnL = data.reduce((s, d) => s + (d.net_pnl ?? 0), 0)

    const isProfitable = realizedPnL >= 0
    const isNetProfitable = netRealizedPnL >= 0

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-surface border border-border-subtle rounded-xl p-5 flex items-center justify-center h-28">
                        <Loader2 className="w-4 h-4 animate-spin text-neutral" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Realized P&L */}
            <div className={`bg-surface border border-border-subtle rounded-xl p-5 hover:border-${isProfitable ? 'profit' : 'loss-primary'}/50 transition-colors group relative overflow-hidden`}>
                <div className="flex items-center gap-2 mb-2">
                    {isProfitable ? (
                        <TrendingUp className="w-5 h-5 text-profit/50" />
                    ) : (
                        <TrendingDown className="w-5 h-5 text-loss-primary/50" />
                    )}
                    <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                        Realized P&L
                    </p>
                </div>
                <p className={`text-2xl font-mono tracking-tight font-bold ${isProfitable ? 'text-profit' : 'text-loss-primary'}`}>
                    {isProfitable ? '+' : ''}₹{Math.abs(realizedPnL).toLocaleString('en-IN')}
                </p>
                <p className="text-sm font-body text-neutral-primary mt-1">
                    From {data.length} closed trades
                </p>
            </div>

            {/* Charges & Taxes */}
            <div className="bg-surface border border-border-subtle rounded-xl p-5 hover:border-accent-blue/50 transition-colors relative">
                <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-5 h-5 text-neutral/50" />
                    <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                        Charges & Taxes
                    </p>
                </div>
                <p className="text-2xl font-mono tracking-tight font-bold text-foreground">
                    ₹{chargeBreakdown.total.toLocaleString('en-IN')}
                </p>
                <button
                    onClick={() => setShowChargeBreakdown(!showChargeBreakdown)}
                    className="text-sm font-body text-neutral-primary hover:text-foreground mt-1 transition-colors"
                >
                    {showChargeBreakdown ? 'Hide' : 'Show'} breakdown
                </button>

                {showChargeBreakdown && (
                    <div className="absolute top-full left-0 mt-2 bg-surface/95 backdrop-blur border border-border-subtle rounded-lg shadow-xl p-4 z-20 w-64 shadow-sm">
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral mb-2 border-b border-border-subtle pb-1">Charge Breakdown</p>
                        <div className="space-y-1 text-sm font-mono text-foreground font-bold">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-neutral font-medium text-xs">Brokerage</span>
                                <span>₹{chargeBreakdown.brokerage.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-neutral font-medium text-xs">STT</span>
                                <span>₹{chargeBreakdown.stt.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-neutral font-medium text-xs">GST</span>
                                <span>₹{chargeBreakdown.gst.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-neutral font-medium text-xs">Stamp Duty</span>
                                <span>₹{chargeBreakdown.stampDuty.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-border-subtle">
                                <span className="text-neutral font-medium text-xs">Total</span>
                                <span className="text-loss-primary">₹{chargeBreakdown.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Net Realized P&L */}
            <div className={`bg-surface border border-${isNetProfitable ? 'profit' : 'loss-primary'}/50 shadow-sm rounded-xl p-5 hover:border-${isNetProfitable ? 'profit' : 'loss-primary'} transition-colors relative overflow-hidden`}>
                <div className="flex items-center gap-2 mb-2">
                    <DollarSign className={`w-5 h-5 ${isNetProfitable ? 'text-profit/50' : 'text-loss-primary/50'}`} />
                    <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                        Net Realized P&L
                    </p>
                </div>
                <p className={`text-4xl font-mono tracking-tight font-bold ${isNetProfitable ? 'text-profit' : 'text-loss-primary'}`}>
                    {isNetProfitable ? '+' : ''}₹{Math.abs(netRealizedPnL).toLocaleString('en-IN')}
                </p>
                <p className="text-sm font-body text-neutral-primary mt-1">
                    What hits your bank
                </p>
            </div>

            {/* Other Credits/Debits */}
            <div className="bg-surface border border-border-subtle rounded-xl p-5 hover:border-accent-blue/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-neutral/50" />
                    <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                        Other Credits/Debits
                    </p>
                </div>
                <p className="text-2xl font-mono tracking-tight font-bold text-neutral">
                    —
                </p>
                <div className="text-sm font-body text-neutral-primary mt-1">
                    <p>Dividends & charges from ledger</p>
                </div>
            </div>
        </div>
    )
}
