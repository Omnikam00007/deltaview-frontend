"use client"

import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { RealizedPnl } from "@/lib/types"

interface TradeRow {
    id: string
    symbol: string
    quantity: number
    buyValue: number
    sellValue: number
    grossPnL: number
    charges: {
        brokerage: number
        stt: number
        gst: number
        stampDuty: number
        total: number
    }
    netPnL: number
    holdingPeriod: number
    taxCategory: "STCG" | "LTCG" | "—"
}

function mapToRow(r: RealizedPnl): TradeRow {
    return {
        id: r.id,
        symbol: r.instrument_id ? r.instrument_id.slice(0, 8).toUpperCase() : "UNKNOWN",
        quantity: r.quantity ?? 0,
        buyValue: (r.buy_price ?? 0) * (r.quantity ?? 1),
        sellValue: (r.sell_price ?? 0) * (r.quantity ?? 1),
        grossPnL: r.gross_pnl ?? 0,
        charges: {
            brokerage: 0,
            stt: 0,
            gst: 0,
            stampDuty: 0,
            total: r.charges_total ?? 0,
        },
        netPnL: r.net_pnl ?? 0,
        holdingPeriod: r.holding_days ?? 0,
        taxCategory: r.tax_category ?? "—",
    }
}

type SortField = "symbol" | "quantity" | "buyValue" | "sellValue" | "grossPnL" | "netPnL" | "holdingPeriod"
type SortDirection = "asc" | "desc"

export default function PnLTradeLog() {
    const [trades, setTrades] = useState<TradeRow[]>([])
    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState<SortField>("netPnL")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [hoveredCharges, setHoveredCharges] = useState<string | null>(null)

    useEffect(() => {
        analyticsService.listRealizedPnl()
            .then((data) => setTrades(data.map(mapToRow)))
            .catch(() => setTrades([]))
            .finally(() => setLoading(false))
    }, [])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const sortedTrades = [...trades].sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1
        return (a[sortField] > b[sortField] ? 1 : -1) * multiplier
    })

    if (loading) {
        return (
            <div className="bg-surface rounded-xl border border-border-subtle flex items-center justify-center h-[600px] mb-6">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading trade log...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden mb-6 flex flex-col h-[600px]">
            <div className="p-5 border-b border-border-subtle">
                <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1">
                    Granular Trade Log
                </h3>
                <p className="text-sm font-body text-neutral-primary">
                    {trades.length > 0 ? `${trades.length} closed positions` : 'No closed positions yet'}
                </p>
            </div>

            {trades.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-foreground font-bold font-display mb-2">No Realized Trades</p>
                    <p className="text-sm text-neutral max-w-xs">
                        Closed positions will appear here showing buy/sell values, charges, and tax categorization.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border-subtle">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <button onClick={() => handleSort("symbol")} className="flex items-center gap-1 text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Symbol <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button onClick={() => handleSort("quantity")} className="flex items-center gap-1 ml-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Quantity <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button onClick={() => handleSort("buyValue")} className="flex items-center gap-1 ml-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Buy Value <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button onClick={() => handleSort("sellValue")} className="flex items-center gap-1 ml-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Sell Value <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button onClick={() => handleSort("grossPnL")} className="flex items-center gap-1 ml-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Gross P&L <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] uppercase tracking-widest font-display text-neutral">
                                    Charges
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button onClick={() => handleSort("netPnL")} className="flex items-center gap-1 ml-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Net P&L <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <button onClick={() => handleSort("holdingPeriod")} className="flex items-center gap-1 mx-auto text-[11px] uppercase tracking-widest font-display text-neutral hover:text-foreground">
                                        Tax Category <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {sortedTrades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-surface-hover transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-foreground">{trade.symbol}</p>
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm font-mono tracking-tight text-foreground">
                                        {trade.quantity}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm font-mono tracking-tight text-neutral-primary">
                                        ₹{trade.buyValue.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm font-mono tracking-tight text-neutral-primary">
                                        ₹{trade.sellValue.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono tracking-tight">
                                        <span className={`text-sm font-bold ${trade.grossPnL >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                            {trade.grossPnL >= 0 ? '+' : ''}₹{Math.abs(trade.grossPnL).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right relative font-mono tracking-tight">
                                        <button
                                            className="flex items-center gap-1 ml-auto text-sm text-neutral-primary hover:text-foreground"
                                            onMouseEnter={() => setHoveredCharges(trade.id)}
                                            onMouseLeave={() => setHoveredCharges(null)}
                                        >
                                            ₹{trade.charges.total.toLocaleString('en-IN')}
                                            <Info className="w-3 h-3" />
                                        </button>

                                        {hoveredCharges === trade.id && (
                                            <div className="absolute right-0 top-full mt-2 bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-xl z-20 w-48 text-xs text-foreground font-mono">
                                                <p className="text-[11px] uppercase tracking-widest font-display text-neutral border-b border-border-subtle pb-1 mb-2">Charge Breakdown</p>
                                                <div className="space-y-1 font-bold">
                                                    <div className="flex justify-between"><span className="text-neutral">Brokerage:</span><span>₹{trade.charges.brokerage.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between"><span className="text-neutral">STT:</span><span>₹{trade.charges.stt.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between"><span className="text-neutral">GST:</span><span>₹{trade.charges.gst.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between"><span className="text-neutral">Stamp Duty:</span><span>₹{trade.charges.stampDuty.toLocaleString('en-IN')}</span></div>
                                                    <div className="flex justify-between pt-1 mt-1 border-t border-border-subtle">
                                                        <span className="text-neutral">Total:</span>
                                                        <span className="text-loss-primary">₹{trade.charges.total.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono tracking-tight">
                                        <span className={`text-sm font-bold ${trade.netPnL >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
                                            {trade.netPnL >= 0 ? '+' : ''}₹{Math.abs(trade.netPnL).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-block px-2 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest ${trade.taxCategory === "LTCG"
                                                ? 'bg-accent-blue/10 text-accent-blue'
                                                : trade.taxCategory === "STCG"
                                                ? 'bg-loss-secondary/20 text-loss-primary'
                                                : 'bg-background text-neutral'
                                            }`}>
                                            {trade.taxCategory}
                                        </span>
                                        <p className="text-sm font-mono text-neutral-primary mt-1">
                                            {trade.holdingPeriod}d
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
