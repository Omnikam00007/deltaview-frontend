"use client"

import PnLTradeLog from "@/components/kokonutui/pnl-trade-log"
import TodaysPnlWidget from "@/components/kokonutui/todays-pnl-widget"
import RealizedPnlWidget from "@/components/kokonutui/realized-pnl-widget"
import TaxSummaryWidget from "@/components/kokonutui/tax-summary-widget"

export default function PnLPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12]">
            <div className="max-w-[1600px] mx-auto p-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reporting &amp; P&amp;L Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        The Truth Layer - Comprehensive analysis for tax preparation and performance auditing
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Trade Log (55%) */}
                    <div className="lg:col-span-7 flex flex-col">
                        <PnLTradeLog />
                    </div>

                    {/* Right Column - Widgets stacked (45%) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <TodaysPnlWidget />
                        <RealizedPnlWidget />
                        <TaxSummaryWidget />
                    </div>
                </div>
            </div>
        </div>
    )
}
