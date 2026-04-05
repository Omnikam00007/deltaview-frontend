"use client"

import { Download, FileSpreadsheet, Share2 } from "lucide-react"
import { useState } from "react"

export default function PnLExportControls() {
    const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel")
    const [showShareModal, setShowShareModal] = useState(false)

    const handleExport = () => {
        // Export functionality - would generate file
        console.log(`Exporting as ${exportFormat}...`)
        alert(`Exporting P&L report as ${exportFormat.toUpperCase()}`)
    }

    const handleGenerateShareLink = () => {
        // Generate shareable verification link
        const shareLink = `https://deltaview.app/verify/${Math.random().toString(36).substring(7)}`
        navigator.clipboard.writeText(shareLink)
        alert(`Share link copied to clipboard!\n${shareLink}`)
        setShowShareModal(false)
    }

    return (
        <div className="bg-surface rounded-xl p-5 border border-border-subtle h-full">
            <div className="mb-4">
                <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1">
                    Export & Share
                </h3>
                <p className="text-sm font-body text-neutral-primary">
                    Download reports or generate shareable links
                </p>
            </div>

            {/* Export Format Selection */}
            <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-widest font-display text-neutral mb-2">
                    Export Format
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setExportFormat("excel")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${exportFormat === "excel"
                                ? 'bg-surface border border-border-subtle shadow-sm ring-1 ring-border-subtle'
                                : 'text-neutral hover:text-foreground hover:bg-surface-hover'
                            }`}
                    >
                        <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                        Excel (.xlsx)
                    </button>
                    <button
                        onClick={() => setExportFormat("csv")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${exportFormat === "csv"
                                ? 'bg-surface border border-border-subtle shadow-sm ring-1 ring-border-subtle'
                                : 'text-neutral hover:text-foreground hover:bg-surface-hover'
                            }`}
                    >
                        <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                        CSV
                    </button>
                </div>
            </div>

            {/* Export Features */}
            <div className="mb-6 p-4 bg-surface rounded-lg border border-border-subtle box-border">
                <p className="text-[11px] tracking-widest uppercase font-display text-foreground mb-2">
                    ITR-Ready Format Includes:
                </p>
                <ul className="text-xs text-neutral-primary space-y-1.5 font-body">
                    <li>✓ Symbol, ISIN, Buy/Sell dates</li>
                    <li>✓ Quantity, Buy/Sell values</li>
                    <li>✓ Gross P&L, Charges breakdown</li>
                    <li>✓ Net P&L, Tax category (STCG/LTCG)</li>
                    <li>✓ Separate sheets for STCG and LTCG</li>
                    <li>✓ Summary sheet with totals</li>
                </ul>
            </div>

            {/* Export Button */}
            <button
                onClick={handleExport}
                className="w-full px-4 py-3 bg-foreground text-background rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 mb-3 hover:opacity-90"
            >
                <Download className="w-4 h-4" />
                Export P&L Report
            </button>

            {/* Share Button */}
            <button
                onClick={() => setShowShareModal(true)}
                className="w-full px-4 py-3 bg-surface border border-border-subtle text-foreground rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 hover:border-accent-blue/50"
            >
                <Share2 className="w-4 h-4" />
                Generate Shareable Link
            </button>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-md w-full border border-border-subtle">
                        <h4 className="text-[11px] uppercase tracking-widest font-display text-neutral mb-2">
                            Generate Verification Link
                        </h4>
                        <p className="text-sm font-body text-neutral-primary mb-4">
                            Create a shareable link to showcase your P&L performance. No sensitive account details will be included.
                        </p>

                        <div className="mb-6 p-4 bg-background rounded-lg border border-border-subtle box-border">
                            <p className="text-xs text-neutral-primary">
                                <strong className="text-foreground font-mono uppercase text-[10px]">What's shared:</strong> Total P&L, percentage returns, trade count
                            </p>
                            <p className="text-xs text-neutral-primary mt-2">
                                <strong className="text-foreground font-mono uppercase text-[10px]">Not shared:</strong> Account numbers, broker details, specific holdings
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="flex-1 px-4 py-2 bg-transparent border border-border-subtle text-neutral rounded-lg font-medium text-sm hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateShareLink}
                                className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                            >
                                Generate Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
