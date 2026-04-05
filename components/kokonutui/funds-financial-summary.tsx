"use client"

import { Wallet, TrendingUp, Clock, Shield, HelpCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import type { FundsBalance } from "@/lib/types"
import { useFundsBalance } from "@/hooks/useFundsBalance"

export default function FundsFinancialSummary() {
    const [showHelp, setShowHelp] = useState<string | null>(null)
    const { balances, isLoading: loading } = useFundsBalance()

    // Aggregate across all broker accounts
    const availableMargin = balances.reduce((s, b) => s + b.available_margin, 0)
    const withdrawableBalance = balances.reduce((s, b) => s + b.withdrawable_balance, 0)
    const unsettledCredits = balances.reduce((s, b) => s + b.unsettled_credits, 0)
    const pledgedMargin = balances.reduce((s, b) => s + b.pledged_margin, 0)
    const totalMargin = balances.reduce((s, b) => s + b.total_margin, 0)
    const usedMargin = balances.reduce((s, b) => s + b.used_margin, 0)

    const marginUtilization = totalMargin > 0 ? (usedMargin / totalMargin) * 100 : 0

    if (loading) {
        return (
            <div className="bg-surface border border-border-subtle rounded-xl p-5 flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading funds...</span>
            </div>
        )
    }

    return (
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Available Margin */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-neutral" />
                            <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                                Available Margin
                            </p>
                        </div>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        ₹{availableMargin.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        Total cash for new trades
                    </p>
                </div>

                {/* Withdrawable Balance */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-neutral" />
                            <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                                Withdrawable Balance
                            </p>
                        </div>
                        <button
                            onMouseEnter={() => setShowHelp('withdrawable')}
                            onMouseLeave={() => setShowHelp(null)}
                            className="text-neutral-primary hover:text-foreground transition-colors"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        ₹{withdrawableBalance.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        Can transfer to bank today
                    </p>

                    {/* Help Tooltip */}
                    {showHelp === 'withdrawable' && (
                        <div className="absolute top-full left-0 mt-2 bg-surface/95 backdrop-blur text-foreground p-3 rounded-lg shadow-lg z-20 w-64 text-xs border border-border-subtle font-body">
                            <p className="font-bold mb-1 font-display uppercase tracking-widest text-[10px]">Why is this less than available margin?</p>
                            <p>₹{unsettledCredits.toLocaleString('en-IN')} from yesterday's sale will be available tomorrow (T+1 settlement)</p>
                        </div>
                    )}
                </div>

                {/* Unsettled Credits */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral" />
                        <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                            Unsettled Credits
                        </p>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        ₹{unsettledCredits.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        Available tomorrow (T+1)
                    </p>
                </div>

                {/* Pledged Margin */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-neutral" />
                            <p className="text-[11px] uppercase tracking-widest font-display text-neutral">
                                Pledged Margin
                            </p>
                        </div>
                        <button
                            onMouseEnter={() => setShowHelp('pledged')}
                            onMouseLeave={() => setShowHelp(null)}
                            className="text-neutral-primary hover:text-foreground transition-colors"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        ₹{pledgedMargin.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs font-body text-neutral-primary">
                        Non-cash collateral
                    </p>

                    {/* Help Tooltip */}
                    {showHelp === 'pledged' && (
                        <div className="absolute top-full right-0 mt-2 bg-surface/95 backdrop-blur text-foreground p-3 rounded-lg shadow-lg z-20 w-64 text-xs border border-border-subtle font-body">
                            <p className="font-bold mb-1 font-display uppercase tracking-widest text-[10px]">What is pledged margin?</p>
                            <p>You've pledged stocks worth ₹{pledgedMargin.toLocaleString('en-IN')} as collateral for margin trading.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Margin Utilization Bar */}
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-widest font-display text-neutral">
                        Margin Utilization
                    </span>
                    <span className="text-sm font-mono tracking-tight text-foreground">
                        {marginUtilization.toFixed(1)}%
                    </span>
                </div>
                
                <div className="h-2 bg-surface border border-border-subtle rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-profit/80 rounded-full transition-all"
                        style={{ width: `${marginUtilization}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs font-body text-neutral-primary">
                    <span>Used: <span className="font-mono tracking-tight font-bold text-foreground">₹{usedMargin.toLocaleString('en-IN')}</span></span>
                    <span>Total: <span className="font-mono tracking-tight font-bold text-foreground">₹{totalMargin.toLocaleString('en-IN')}</span></span>
                </div>
            </div>
        </div>
    )
}
