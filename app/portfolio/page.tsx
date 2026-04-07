"use client"

import { useState } from "react"
import PortfolioVitalSigns from "@/components/kokonutui/portfolio-vital-signs"
import PortfolioControls from "@/components/kokonutui/portfolio-controls"
import HoldingsTable from "@/components/kokonutui/holdings-table"
import PortfolioHeatmap from "@/components/kokonutui/portfolio-heatmap"
import SectorExposureChart from "@/components/kokonutui/sector-exposure-chart"
import TradesTable from "@/components/kokonutui/trades-table"

export default function PortfolioPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedBrokers, setSelectedBrokers] = useState<string[]>(["all"])
    const [selectedSector, setSelectedSector] = useState("all")
    const [viewMode, setViewMode] = useState<"table" | "card">("table")

    const handleExport = () => {
        // Export functionality - would generate CSV/Excel
        console.log("Exporting portfolio data...")
        alert("Export functionality will download CSV/Excel file")
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12]">
            <div className="max-w-[1600px] mx-auto p-6 flex flex-col gap-6">
                {/* Vital Signs Header */}
                <PortfolioVitalSigns />

                {/* Filter Controls */}
                <PortfolioControls
                    onSearchChange={setSearchQuery}
                    onBrokerChange={(brokers) => setSelectedBrokers(brokers as string[])}
                    onSectorChange={setSelectedSector}
                    onViewChange={setViewMode}
                    onExport={handleExport}
                />

                {/* Holdings Table */}
                <HoldingsTable />

                {/* Visual Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PortfolioHeatmap />
                    <SectorExposureChart />
                </div>
                
                {/* Trades Ledger */}
                <TradesTable />
            </div>
        </div>
    )
}
