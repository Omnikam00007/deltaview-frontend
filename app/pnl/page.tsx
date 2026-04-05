"use client"

import { useState } from "react"
import PnLFilterBar, { FilterState } from "@/components/kokonutui/pnl-filter-bar"
import PnLHeroMetrics from "@/components/kokonutui/pnl-hero-metrics"
import PnLCalendarHeatmap from "@/components/kokonutui/pnl-calendar-heatmap"
import PnLTradeLog from "@/components/kokonutui/pnl-trade-log"
import TaxSummaryWidget from "@/components/kokonutui/tax-summary-widget"
import PnLExportControls from "@/components/kokonutui/pnl-export-controls"

export default function PnLPage() {
    const [filters, setFilters] = useState<FilterState>({
        segment: "equity",
        pnlType: "realized",
        dateRange: {
            start: new Date(2025, 3, 1),
            end: new Date(2026, 2, 31),
            preset: "current-fy"
        },
        broker: "combined"
    })

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12]">
            <div className="max-w-[1600px] mx-auto p-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reporting & P&L Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        The Truth Layer - Comprehensive analysis for tax preparation and performance auditing
                    </p>
                </div>

                {/* Filter Bar */}
                <PnLFilterBar onFilterChange={setFilters} />

                {/* Hero Metrics */}
                <PnLHeroMetrics />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - 55% */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <PnLCalendarHeatmap />
                        <PnLTradeLog />
                    </div>

                    {/* Right Column - 45% */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <TaxSummaryWidget />
                        <PnLExportControls />
                    </div>
                </div>
            </div>
        </div>
    )
}
