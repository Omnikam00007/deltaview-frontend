"use client"

import { ArrowUpDown, HelpCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { fundsService } from "@/lib/services/funds.service"
import type { LedgerEntry as LedgerEntryType } from "@/lib/types"

type SortField = "date" | "amount" | "closingBalance"
type SortDirection = "asc" | "desc"

interface LedgerRow {
    id: string
    date: string
    narration: string
    originalNarration: string
    type: "credit" | "debit"
    amount: number
    closingBalance: number
    category: string
    helpText?: string
}

function mapEntry(e: LedgerEntryType): LedgerRow {
    return {
        id: e.id,
        date: e.entry_date,
        narration: e.narration ?? e.original_narration ?? "—",
        originalNarration: e.original_narration ?? "",
        type: e.entry_type as "credit" | "debit",
        amount: e.amount,
        closingBalance: e.closing_balance ?? 0,
        category: e.category ?? "other",
        helpText: e.help_text ?? undefined,
    }
}

export default function FundsLedgerTable() {
    const [entries, setEntries] = useState<LedgerRow[]>([])
    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState<SortField>("date")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [hoveredHelp, setHoveredHelp] = useState<string | null>(null)

    useEffect(() => {
        fundsService.listLedgerEntries()
            .then((data) => setEntries(data.map(mapEntry)))
            .catch(() => setEntries([]))
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

    const sortedLedger = [...entries].sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1
        if (sortField === "date") {
            return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier
        }
        return (a[sortField] > b[sortField] ? 1 : -1) * multiplier
    })

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl flex items-center justify-center h-48 mt-6">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading ledger...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-border-subtle flex flex-col gap-1">
                <h3 className="text-lg font-bold font-display text-foreground">
                    Ledger Statement
                </h3>
                <p className="text-sm font-body text-neutral-primary">
                    Bank passbook-style transaction history
                </p>
            </div>

            {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-foreground font-bold font-display mb-2">No Ledger Entries</p>
                    <p className="text-sm text-neutral max-w-xs">
                        Transactions will appear here as you add funds, make trades, and receive dividends.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-transparent border-b border-border-subtle">
                            <tr>
                                <th className="px-4 py-4 text-left">
                                    <button
                                        onClick={() => handleSort("date")}
                                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-neutral font-mono hover:text-foreground transition-colors"
                                    >
                                        Date
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="text-[10px] uppercase font-bold tracking-widest text-neutral font-mono p-4 text-left">
                                    Narration
                                </th>
                                <th className="text-[10px] uppercase font-bold tracking-widest text-neutral font-mono p-4 text-center">
                                    Type
                                </th>
                                <th className="px-4 py-4 text-right">
                                    <button
                                        onClick={() => handleSort("amount")}
                                        className="flex items-center gap-1 ml-auto text-[10px] uppercase font-bold tracking-widest text-neutral font-mono hover:text-foreground transition-colors"
                                    >
                                        Amount
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-4 py-4 text-right">
                                    <button
                                        onClick={() => handleSort("closingBalance")}
                                        className="flex items-center gap-1 ml-auto text-[10px] uppercase font-bold tracking-widest text-neutral font-mono hover:text-foreground transition-colors"
                                    >
                                        Closing Balance
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLedger.map((entry) => (
                                <tr key={entry.id} className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
                                    <td className="p-4 text-sm font-body text-foreground whitespace-nowrap">
                                        {new Date(entry.date).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="text-sm font-body text-foreground">
                                                    {entry.narration}
                                                </p>
                                                {entry.originalNarration && (
                                                    <p className="text-xs font-body text-neutral-primary">
                                                        {entry.originalNarration}
                                                    </p>
                                                )}
                                            </div>
                                            {entry.helpText && (
                                                <div className="relative">
                                                    <button
                                                        onMouseEnter={() => setHoveredHelp(entry.id)}
                                                        onMouseLeave={() => setHoveredHelp(null)}
                                                        className="text-neutral-primary hover:text-foreground transition-colors"
                                                    >
                                                        <HelpCircle className="w-4 h-4" />
                                                    </button>
                                                    {hoveredHelp === entry.id && (
                                                        <div className="absolute left-full top-0 ml-2 bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-lg shadow-lg z-20 w-64 text-xs font-body text-foreground">
                                                            <p className="font-bold mb-1 font-display tracking-widest uppercase text-[10px] text-neutral">Need help with this entry?</p>
                                                            <p>{entry.helpText}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-body ${entry.type === "credit"
                                                ? 'bg-profit/10 text-profit'
                                                : 'bg-loss-primary/10 text-loss-primary'
                                            }`}>
                                            {entry.type === "credit" ? "Credit" : "Debit"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`font-mono tracking-tight font-bold ${entry.type === "credit"
                                                ? 'text-profit'
                                                : 'text-loss-primary'
                                            }`}>
                                            {entry.type === "credit" ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono tracking-tight font-bold text-foreground">
                                        ₹{entry.closingBalance.toLocaleString('en-IN')}
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
