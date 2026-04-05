"use client"

import { Search, Download, LayoutGrid, LayoutList } from "lucide-react"
import { useState } from "react"

type ViewMode = "table" | "card"
type Broker = "all" | "zerodha" | "groww" | "upstox"

interface PortfolioControlsProps {
    onSearchChange: (search: string) => void
    onBrokerChange: (brokers: Broker[]) => void
    onSectorChange: (sector: string) => void
    onViewChange: (view: ViewMode) => void
    onExport: () => void
}

export default function PortfolioControls({
    onSearchChange,
    onBrokerChange,
    onSectorChange,
    onViewChange,
    onExport
}: PortfolioControlsProps) {
    const [search, setSearch] = useState("")
    const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>(["all"])
    const [selectedSector, setSelectedSector] = useState("all")
    const [viewMode, setViewMode] = useState<ViewMode>("table")

    const brokers: { id: Broker; name: string }[] = [
        { id: "all", name: "All" },
        { id: "zerodha", name: "Zerodha" },
        { id: "groww", name: "Groww" },
        { id: "upstox", name: "Upstox" },
    ]

    const sectors = [
        "All Sectors",
        "Banking",
        "IT",
        "Energy",
        "Pharma",
        "Auto",
        "FMCG",
        "Metals",
        "Telecom"
    ]

    const handleBrokerToggle = (broker: Broker) => {
        let newBrokers: Broker[]

        if (broker === "all") {
            newBrokers = ["all"]
        } else {
            const filtered = selectedBrokers.filter(b => b !== "all")
            if (filtered.includes(broker)) {
                newBrokers = filtered.filter(b => b !== broker)
                if (newBrokers.length === 0) newBrokers = ["all"]
            } else {
                newBrokers = [...filtered, broker]
            }
        }

        setSelectedBrokers(newBrokers)
        onBrokerChange(newBrokers)
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        onSearchChange(value)
    }

    const handleViewToggle = (view: ViewMode) => {
        setViewMode(view)
        onViewChange(view)
    }

    return (
        <div className="sticky top-0 z-10 bg-surface border border-border-subtle rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
                        <input
                            type="text"
                            placeholder="Search by stock name or ISIN..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full bg-background border border-border-subtle rounded-lg px-4 py-2 pl-10 text-sm font-body text-foreground placeholder:-neutral focus:outline-none focus:border-accent-blue/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Broker Toggle Chips */}
                <div className="flex flex-wrap gap-2">
                    {brokers.map((broker) => (
                        <button
                            key={broker.id}
                            onClick={() => handleBrokerToggle(broker.id)}
                            className={selectedBrokers.includes(broker.id)
                                ? "px-3 py-1.5 rounded-lg bg-surface border border-accent-blue text-accent-blue text-sm font-body transition-colors"
                                : "px-3 py-1.5 rounded-lg bg-background border border-border-subtle text-neutral-primary text-sm font-body hover:border-neutral transition-colors"
                            }
                        >
                            {broker.name}
                        </button>
                    ))}
                </div>

                {/* Sector Filter */}
                <select
                    value={selectedSector}
                    onChange={(e) => {
                        setSelectedSector(e.target.value)
                        onSectorChange(e.target.value)
                    }}
                    className="bg-background border border-border-subtle rounded-lg px-4 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent-blue/50 transition-colors"
                >
                    {sectors.map((sector) => (
                        <option key={sector} value={sector.toLowerCase().replace(' ', '-')}>
                            {sector}
                        </option>
                    ))}
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-background border border-border-subtle rounded-lg p-1">
                    <button
                        onClick={() => handleViewToggle("table")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === "table"
                                ? 'bg-surface border border-accent-blue text-accent-blue shadow-sm'
                                : 'text-neutral-primary hover:text-foreground'
                            }`}
                        title="Table View"
                    >
                        <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleViewToggle("card")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode === "card"
                                ? 'bg-surface border border-accent-blue text-accent-blue shadow-sm'
                                : 'text-neutral-primary hover:text-foreground'
                            }`}
                        title="Card View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>

                {/* Export Button */}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border-subtle text-foreground rounded-lg text-sm transition-colors hover:border-accent-blue/50"
                >
                    <Download className="w-4 h-4 text-neutral" />
                    Export
                </button>
            </div>
        </div>
    )
}
