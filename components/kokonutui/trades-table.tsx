"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, ArrowUpDown, Loader2, RefreshCw } from "lucide-react"
import type { Trade } from "@/lib/types"
import { tradesService } from "@/lib/services/trades.service"
import AddTradeModal from "./add-trade-modal"
import { useToast } from "@/hooks/use-toast"
import { useHoldings } from "@/hooks/useHoldings"

export default function TradesTable() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState<keyof Trade | "symbol">("trade_date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const { toast } = useToast()
    
    // For invalidation / optimism
    const { refetch } = useHoldings() 

    // Editing State
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const fetchTrades = () => {
        setLoading(true)
        tradesService.list()
            .then(setTrades)
            .catch(() => setTrades([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchTrades()
    }, [])

    const handleSort = (field: keyof Trade | "symbol") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const handleDelete = async (tradeId: string) => {
        if (!confirm("Are you sure you want to delete this trade? This will affect your holdings and realized P&L.")) {
            return
        }

        try {
            await tradesService.remove(tradeId)
            toast({
                title: "Trade Deleted",
                description: "Trade has been successfully removed.",
            })
            // Refresh local trades and holdings
            fetchTrades()
            refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete trade",
                variant: "destructive",
            })
        }
    }

    const openEditModal = (trade: Trade) => {
        setEditingTrade(trade)
        setIsEditModalOpen(true)
    }

    const handleEditSuccess = () => {
        fetchTrades()
        refetch() // invalidates useHoldings to fetch new data
        setIsEditModalOpen(false)
        setEditingTrade(null)
    }

    const sortedTrades = [...trades].sort((a, b) => {
        let valA: any = a[sortField as keyof Trade]
        let valB: any = b[sortField as keyof Trade]

        if (sortField === "symbol") {
            valA = a.instrument?.symbol || ""
            valB = b.instrument?.symbol || ""
        }

        const multiplier = sortDirection === "asc" ? 1 : -1
        return (valA > valB ? 1 : -1) * multiplier
    })

    if (loading && trades.length === 0) {
        return (
            <div className="bg-surface rounded-xl border border-border-subtle flex items-center justify-center h-64 mb-6 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading trades...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden flex flex-col shadow-sm">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center bg-surface">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-foreground font-display tracking-tight uppercase">
                        Trade Ledger
                    </h3>
                    <div className="h-4 w-[1px] bg-border-subtle"></div>
                    <span className="text-[10px] font-mono text-neutral font-bold tracking-widest">{trades.length} TRADES</span>
                </div>
                <button 
                    onClick={fetchTrades} 
                    disabled={loading}
                    className="text-[10px] uppercase tracking-widest font-bold border border-border-subtle rounded px-3 py-1 flex items-center gap-2 text-neutral hover:text-foreground transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {trades.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <p className="text-foreground font-bold font-display mb-2">No Trades Found</p>
                    <p className="text-sm text-neutral max-w-xs">
                        Any buy or sell trade executions will be listed here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-background/80 backdrop-blur sticky top-0 z-10 text-[10px] uppercase font-bold tracking-widest text-neutral font-mono">
                            <tr>
                                <th className="px-4 py-3 border-b border-border-subtle font-medium">
                                    <button onClick={() => handleSort("trade_date")} className="flex items-center gap-1 hover:text-foreground">
                                        Date <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle font-medium">
                                    <button onClick={() => handleSort("symbol")} className="flex items-center gap-1 hover:text-foreground">
                                        Symbol <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle font-medium">
                                    Type
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle text-right font-medium">
                                    <button onClick={() => handleSort("quantity")} className="flex items-center gap-1 ml-auto hover:text-foreground">
                                        Quantity <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle text-right font-medium">
                                    <button onClick={() => handleSort("price")} className="flex items-center gap-1 ml-auto hover:text-foreground">
                                        Price <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle text-right font-medium">
                                    <button onClick={() => handleSort("trade_value")} className="flex items-center gap-1 ml-auto hover:text-foreground">
                                        Value <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 border-b border-border-subtle text-center font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-sm font-mono font-medium">
                            {sortedTrades.map((trade) => {
                                const isBuy = trade.trade_type === "BUY"
                                // Format date YYYY-MM-DD to locale
                                const formattedDate = trade.trade_date.split("T")[0]

                                return (
                                    <tr key={trade.id} className="hover:bg-surface-hover/50 transition-colors group">
                                        <td className="px-4 py-3 text-neutral">{formattedDate}</td>
                                        <td className="px-4 py-3 text-foreground font-sans font-bold">{trade.instrument?.symbol}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                isBuy ? 'bg-profit/10 text-profit border border-profit/20' : 'bg-loss-primary/10 text-loss-primary border border-loss-primary/20'
                                            }`}>
                                                {trade.trade_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{trade.quantity}</td>
                                        <td className="px-4 py-3 text-right">₹{trade.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-right text-foreground font-bold">₹{trade.trade_value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEditModal(trade)}
                                                    title="Edit Trade"
                                                    className="p-1.5 rounded hover:bg-neutral/10 text-neutral hover:text-accent-blue transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(trade.id)}
                                                    title="Delete Trade"
                                                    className="p-1.5 rounded hover:bg-neutral/10 text-neutral hover:text-loss-primary transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {isEditModalOpen && (
                <AddTradeModal 
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setEditingTrade(null)
                    }}
                    onSuccess={handleEditSuccess}
                    initialTrade={editingTrade}
                />
            )}
        </div>
    )
}
