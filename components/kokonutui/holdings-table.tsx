"use client"

import { ChevronDown, ChevronUp, ArrowUpDown, MoreVertical, RefreshCw, Download, Loader2, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import HoldingDetailsExpansion from "@/components/kokonutui/holding-details-expansion"
import AddTradeModal from "@/components/kokonutui/add-trade-modal"
import type { Holding as HoldingType } from "@/lib/types"
import { useHoldings } from "@/hooks/useHoldings"

// Local UI type extending backend data
interface HoldingRow {
    id: string
    symbol: string
    sector: string
    quantity: number
    avgCost: number
    ltp: number
    currentValue: number
    pnl: number
    pnlPercent: number
    dayChangePercent: number
    allocation: number
    brokers: string[]
    brokerBreakdown: { broker: string; qty: number; avgCost: number }[]
    isin: string
    sparkline: number[]
}

const generateSparkline = (start: number, end: number) => {
    const data = [start]
    let current = start
    for (let i = 0; i < 8; i++) {
        current += (Math.random() - 0.4) * (end - start) * 0.5
        data.push(current)
    }
    data.push(end)
    return data
}

function mapHoldingToRow(h: HoldingType, totalValue: number): HoldingRow {
    const qty = h.quantity ?? 0
    const avg = h.avg_cost ?? 0
    const ltp = h.ltp ?? avg
    const cv = h.current_value ?? qty * ltp
    const pnl = h.pnl ?? cv - qty * avg
    const pnlPct = h.pnl_percent ?? (qty * avg > 0 ? (pnl / (qty * avg)) * 100 : 0)

    return {
        id: h.id,
        symbol: h.instrument?.symbol ?? "UNKNOWN",
        sector: h.instrument?.sector ?? "—",
        quantity: qty,
        avgCost: avg,
        ltp,
        currentValue: cv,
        pnl,
        pnlPercent: pnlPct,
        dayChangePercent: 0, // Will come from live price feed
        allocation: totalValue > 0 ? (cv / totalValue) * 100 : 0,
        brokers: h.broker_account ? [h.broker_account.broker] : [],
        brokerBreakdown: h.broker_account
            ? [{ broker: h.broker_account.broker, qty, avgCost: avg }]
            : [],
        isin: h.instrument?.isin ?? "",
        sparkline: generateSparkline(avg, ltp),
    }
}

type SortField = "symbol" | "quantity" | "avgCost" | "ltp" | "currentValue" | "pnlPercent" | "dayChangePercent"
type SortDirection = "asc" | "desc"

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const width = 45
    const height = 16
    const path = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((d - min) / range) * height
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return (
        <svg width={width} height={height} className="overflow-visible inline-block">
            <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function HoldingsTable() {
    const { holdings: rawHoldings, isLoading: loading, refreshPrices, refetch } = useHoldings()
    const [holdings, setHoldings] = useState<HoldingRow[]>([])
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [sortField, setSortField] = useState<SortField>("currentValue")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [showAddTrade, setShowAddTrade] = useState(false)

    useEffect(() => {
        if (rawHoldings) {
            const totalValue = rawHoldings.reduce((s, h) => s + (h.current_value ?? h.quantity * (h.ltp ?? h.avg_cost)), 0)
            setHoldings(rawHoldings.map((h) => mapHoldingToRow(h, totalValue)))
        }
    }, [rawHoldings])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const sortedHoldings = [...holdings].sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1
        return (a[sortField] > b[sortField] ? 1 : -1) * multiplier
    })

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex items-center justify-center h-48 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading holdings...</span>
            </div>
        )
    }

    if (holdings.length === 0) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex flex-col items-center justify-center h-48 shadow-sm text-center">
                <p className="text-foreground font-bold font-display mb-2">No Holdings Yet</p>
                <p className="text-sm text-neutral max-w-xs mb-4">
                    Log a manual trade or connect a broker to auto-sync.
                </p>
                <button onClick={() => setShowAddTrade(true)} className="px-4 py-2 bg-primary text-black font-bold rounded shadow hover:bg-primary/90 transition-colors">
                    Add Trade
                </button>
                <AddTradeModal isOpen={showAddTrade} onClose={() => setShowAddTrade(false)} onSuccess={refetch} />
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-sm overflow-hidden text-sm relative">
            {/* Table Header Bar */}
            <div className="px-5 py-4 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                        Holdings
                    </h3>
                    <div className="h-4 w-[1px] bg-border-subtle"></div>
                    <span className="text-[10px] font-mono text-neutral font-bold tracking-widest">{holdings.length} POSITIONS</span>
                    <div className="h-4 w-[1px] bg-border-subtle"></div>
                    <button onClick={refreshPrices} disabled={loading} className="text-[10px] font-mono text-neutral flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50">
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> {loading ? 'UPDATING...' : 'LIVE REFRESH'}
                    </button>
                    <div className="h-4 w-[1px] bg-border-subtle"></div>
                    <button onClick={() => setShowAddTrade(true)} className="text-[10px] font-mono text-emerald-500 flex items-center gap-1 hover:text-emerald-400 font-bold transition-colors">
                        <Plus className="h-3 w-3" /> ADD TRADE
                    </button>
                </div>
                <AddTradeModal isOpen={showAddTrade} onClose={() => setShowAddTrade(false)} onSuccess={() => { refetch(); refreshPrices(); }} />

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex border border-border-subtle rounded text-[10px] font-bold tracking-widest uppercase font-mono bg-background overflow-hidden mr-2">
                        <button className="px-3 py-1 bg-surface text-foreground">All</button>
                        <div className="w-[1px] bg-border-subtle"></div>
                        <button className="px-3 py-1 text-neutral hover:text-foreground transition-colors">Long</button>
                        <div className="w-[1px] bg-border-subtle"></div>
                        <button className="px-3 py-1 text-neutral hover:text-foreground transition-colors">Short</button>
                    </div>
                    
                    <button className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-border-subtle rounded text-neutral flex items-center gap-2 hover:text-foreground transition-colors bg-background flex-shrink-0">
                        Sector <ChevronDown className="h-3 w-3" />
                    </button>
                    <button className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-border-subtle rounded text-neutral flex items-center gap-2 hover:text-foreground transition-colors bg-background flex-shrink-0">
                        Export <Download className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap border-collapse">
                    <thead className="bg-background/80 backdrop-blur sticky top-0 z-10 text-[10px] uppercase font-bold tracking-widest text-neutral font-mono">
                        <tr>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("symbol")} className="flex items-center gap-1 px-4 py-3 hover:text-foreground w-full group">
                                    SYMBOL <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <span className="px-4 py-3 block">SECTOR</span>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("quantity")} className="flex items-center justify-end gap-1 px-4 py-3 hover:text-foreground w-full text-right group">
                                    QTY <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("avgCost")} className="flex items-center justify-end gap-1 px-4 py-3 hover:text-foreground w-full text-right group">
                                    AVG COST <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("ltp")} className="flex items-center justify-end gap-1 px-4 py-3 hover:text-foreground w-full text-right group">
                                    LTP <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("currentValue")} className="flex items-center justify-end gap-1 px-4 py-3 hover:text-foreground w-full text-right group">
                                    VALUE <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("pnlPercent")} className="flex items-center gap-1 px-4 py-3 hover:text-foreground w-full group">
                                    P&L <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-0 border-b border-border-subtle">
                                <button onClick={() => handleSort("dayChangePercent")} className="flex items-center justify-end gap-1 px-4 py-3 hover:text-foreground w-full text-right group">
                                    DAY <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </td>
                            <td className="p-4 border-b border-border-subtle text-right"></td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-xs font-mono font-medium">
                        {sortedHoldings.map((holding) => {
                            const isProfit = holding.pnl >= 0
                            const isDayProfit = holding.dayChangePercent >= 0

                            return (
                                <>
                                    <tr
                                        key={holding.id}
                                        className="hover:bg-surface-hover/50 transition-colors group cursor-pointer"
                                        onClick={() => setExpandedRow(expandedRow === holding.id ? null : holding.id)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-8 rounded-full ${isProfit ? 'bg-profit' : 'bg-loss-primary'}`}></div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground font-sans tracking-tight">{holding.symbol}</span>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {holding.brokers.map((broker) => (
                                                            <span key={broker} title={broker} className="text-[8px] bg-background border border-border-subtle px-1 rounded uppercase tracking-widest text-neutral">
                                                                {broker.charAt(0)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-neutral">{holding.sector}</td>
                                        <td className="px-4 py-3 text-right">{holding.quantity}</td>
                                        <td className="px-4 py-3 text-right">₹{holding.avgCost.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-foreground">₹{holding.ltp.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                <div className="mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <Sparkline data={holding.sparkline} color={isDayProfit ? 'var(--profit-primary)' : 'var(--loss-primary)'} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-foreground font-bold">
                                            ₹{holding.currentValue.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1 w-24">
                                                <div className="flex justify-between items-center">
                                                    <span className={`${isProfit ? 'text-profit' : 'text-loss-primary'} font-bold`}>
                                                        {isProfit ? '+' : ''}₹{Math.abs(holding.pnl).toLocaleString('en-IN')}
                                                    </span>
                                                    <span className={`${isProfit ? 'text-profit' : 'text-loss-primary'} text-[10px]`}>
                                                        ({isProfit ? '+' : ''}{holding.pnlPercent.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${isProfit ? 'bg-profit/20' : 'bg-loss-primary/20'}`} 
                                                        style={{ width: `${Math.min(Math.abs(holding.pnlPercent) * 2, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${isDayProfit ? 'bg-profit/10 text-profit border border-profit/20' : 'bg-loss-primary/10 text-loss-primary border border-loss-primary/20'}`}>
                                                {isDayProfit ? '▲ ' : '▼ '}{Math.abs(holding.dayChangePercent)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="p-1 rounded text-neutral hover:text-foreground hover:bg-surface-hover transition-colors" onClick={(e) => e.stopPropagation()}>
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === holding.id && (
                                        <tr>
                                            <td colSpan={9} className="bg-background p-0 border-b border-border-subtle">
                                                <div className="px-4 py-4 w-full border-t border-border-subtle shadow-inner">
                                                    <HoldingDetailsExpansion holding={holding} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-border-subtle bg-surface flex justify-between items-center text-xs font-mono text-neutral">
                <span>Showing {holdings.length} of {holdings.length} holdings</span>
                <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded border border-border-subtle hover:bg-surface-hover hover:text-foreground disabled:opacity-50" disabled>PREV</button>
                    <button className="px-2 py-1 rounded border border-border-subtle bg-background text-foreground">1</button>
                    <button className="px-2 py-1 rounded border border-border-subtle hover:bg-surface-hover hover:text-foreground disabled:opacity-50" disabled>NEXT</button>
                </div>
            </div>
        </div>
    )
}
