"use client"

import { FileText, TrendingUp, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics.service"
import type { TaxSummary } from "@/lib/types"

export default function TaxSummaryWidget() {
    const [loading, setLoading] = useState(true)
    const [taxData, setTaxData] = useState<TaxSummary | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        analyticsService.getTaxSummary()
            .then(setTaxData)
            .catch((e) => setError(e.message || "Failed to load tax data"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-surface rounded-xl p-5 border border-border-subtle h-full flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                <span className="ml-2 text-sm text-neutral">Loading tax data...</span>
            </div>
        )
    }

    if (error || !taxData) {
        return (
            <div className="bg-surface rounded-xl p-5 border border-border-subtle h-full flex flex-col items-center justify-center min-h-[300px] text-center">
                <FileText className="w-8 h-8 text-neutral mb-3" />
                <p className="text-foreground font-bold font-display mb-1">No Tax Data</p>
                <p className="text-sm text-neutral">Sell some holdings to see your tax summary here.</p>
            </div>
        )
    }

    const { stcg, ltcg, total_gains, total_tax_liability, financial_year } = taxData

    return (
        <div className="bg-surface rounded-xl p-5 border border-border-subtle h-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1">
                        Tax Summary
                    </h3>
                    <p className="text-sm font-body text-neutral-primary">
                        FY {financial_year}
                    </p>
                </div>
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            {/* STCG Section */}
            <div className="mb-4 p-4 bg-surface rounded-lg border border-border-subtle hover:border-accent-blue/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-[11px] uppercase tracking-widest font-display text-foreground">
                            Short Term Capital Gains (STCG)
                        </p>
                        <p className="text-[10px] font-mono text-neutral">
                            Held &lt; 1 year
                        </p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-neutral/50" />
                </div>

                <div className="space-y-2 mt-4 font-mono">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs text-neutral-primary font-bold">Gains:</span>
                        <span className="text-sm font-bold text-foreground">
                            ₹{stcg.gains.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs text-neutral-primary font-bold">Tax Rate:</span>
                        <span className="text-sm font-bold text-neutral">
                            {stcg.tax_rate * 100}%
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border-subtle mt-1">
                        <span className="text-[11px] uppercase text-neutral tracking-widest font-display">Tax Liability:</span>
                        <span className="text-lg font-bold text-loss-primary tracking-tight">
                            ₹{stcg.tax.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                {total_gains > 0 && (
                    <div className="mt-4">
                        <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                            <div
                                className="h-full bg-profit/20 rounded-full"
                                style={{ width: `${(stcg.gains / total_gains) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-mono text-neutral font-bold mt-1.5 text-right">
                            {((stcg.gains / total_gains) * 100).toFixed(1)}% of total gains
                        </p>
                    </div>
                )}
            </div>

            {/* LTCG Section */}
            <div className="mb-4 p-4 bg-surface rounded-lg border border-border-subtle hover:border-accent-blue/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-[11px] uppercase tracking-widest font-display text-foreground">
                            Long Term Capital Gains (LTCG)
                        </p>
                        <p className="text-[10px] font-mono text-neutral">
                            Held ≥ 1 year
                        </p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-neutral/50" />
                </div>

                <div className="space-y-2 mt-4 font-mono">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs text-neutral-primary font-bold">Gains:</span>
                        <span className="text-sm font-bold text-foreground">
                            ₹{ltcg.gains.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs text-neutral-primary font-bold">Exemption Limit:</span>
                        <span className="text-sm font-bold text-neutral">
                            ₹{ltcg.exemption_limit.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs text-neutral-primary font-bold">Tax Rate:</span>
                        <span className="text-sm font-bold text-neutral">
                            {ltcg.tax_rate * 100}% <span className="text-[9px] text-neutral/70 uppercase">on gains &gt; ₹1L</span>
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border-subtle mt-1">
                        <span className="text-[11px] uppercase tracking-widest font-display text-neutral">Tax Liability:</span>
                        <span className={`text-lg font-bold tracking-tight ${ltcg.tax === 0 ? 'text-profit' : 'text-loss-primary'}`}>
                            ₹{ltcg.tax.toLocaleString('en-IN')}
                        </span>
                    </div>
                    {ltcg.tax === 0 && (
                        <p className="text-[9px] text-profit uppercase tracking-widest font-bold mt-1 text-right">
                            ✓ Within ₹1L exemption
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                {total_gains > 0 && (
                    <div className="mt-4">
                        <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                            <div
                                className="h-full bg-profit/20 rounded-full"
                                style={{ width: `${(ltcg.gains / total_gains) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-mono text-neutral font-bold mt-1.5 text-right">
                            {((ltcg.gains / total_gains) * 100).toFixed(1)}% of total gains
                        </p>
                    </div>
                )}
            </div>

            {/* Total Tax Liability */}
            <div className="p-4 bg-surface border border-border-subtle rounded-lg mt-6 shadow-sm">
                <div className="flex justify-between items-baseline">
                    <span className="text-[11px] uppercase tracking-widest font-display text-foreground">
                        Total Tax Liability
                    </span>
                    <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        ₹{total_tax_liability.toLocaleString('en-IN')}
                    </span>
                </div>
                <p className="text-[10px] font-mono text-neutral font-bold mt-1 text-right">
                    For FY {financial_year} (Apr - Mar)
                </p>
            </div>


        </div>
    )
}
