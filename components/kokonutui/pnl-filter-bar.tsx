"use client"

import { Calendar, Filter } from "lucide-react"
import { useState } from "react"

export type Segment = "equity" | "fo" | "currency" | "commodity"
export type PnLType = "realized" | "unrealized"
export type DatePreset = "current-fy" | "previous-fy" | "last-30" | "last-90" | "custom"
export type Broker = "combined" | "zerodha" | "groww" | "upstox"

export interface FilterState {
    segment: Segment
    pnlType: PnLType
    dateRange: { start: Date; end: Date; preset: DatePreset }
    broker: Broker
}

interface PnLFilterBarProps {
    onFilterChange: (filters: FilterState) => void
}

export default function PnLFilterBar({ onFilterChange }: PnLFilterBarProps) {
    const [segment, setSegment] = useState<Segment>("equity")
    const [pnlType, setPnLType] = useState<PnLType>("realized")
    const [datePreset, setDatePreset] = useState<DatePreset>("current-fy")
    const [broker, setBroker] = useState<Broker>("combined")

    // Calculate FY dates (Apr 1 - Mar 31)
    const getCurrentFY = () => {
        const now = new Date()
        const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
        return {
            start: new Date(year, 3, 1), // Apr 1
            end: new Date(year + 1, 2, 31) // Mar 31
        }
    }

    const getPreviousFY = () => {
        const currentFY = getCurrentFY()
        return {
            start: new Date(currentFY.start.getFullYear() - 1, 3, 1),
            end: new Date(currentFY.end.getFullYear() - 1, 2, 31)
        }
    }

    const getDateRange = () => {
        const now = new Date()
        switch (datePreset) {
            case "current-fy":
                return getCurrentFY()
            case "previous-fy":
                return getPreviousFY()
            case "last-30":
                return {
                    start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                    end: now
                }
            case "last-90":
                return {
                    start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
                    end: now
                }
            default:
                return getCurrentFY()
        }
    }

    const handleFilterChange = () => {
        onFilterChange({
            segment,
            pnlType,
            dateRange: { ...getDateRange(), preset: datePreset },
            broker
        })
    }

    const formatDateRange = () => {
        const range = getDateRange()
        return `${range.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${range.end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
    }

    return (
        <div className="bg-white dark:bg-[#0F0F12] py-4 sticky top-0 z-10">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Segment Toggle */}
                <div className="flex-1">
                    <label className="block text-sm font-body text-neutral-primary mb-2">
                        Segment
                    </label>
                    <div className="flex gap-2">
                        {[
                            { id: "equity", label: "Equity" },
                            { id: "fo", label: "F&O" },
                            { id: "currency", label: "Currency" },
                            { id: "commodity", label: "Commodity" }
                        ].map((seg) => (
                            <button
                                key={seg.id}
                                onClick={() => {
                                    setSegment(seg.id as Segment)
                                    handleFilterChange()
                                }}
                                className={`px-3 py-2 rounded-lg text-[11px] font-bold font-display uppercase tracking-widest transition-all ${segment === seg.id
                                        ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                        : 'text-neutral hover:text-foreground'
                                    }`}
                            >
                                {seg.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* P&L Type Toggle */}
                <div className="flex-1">
                    <label className="block text-sm font-body text-neutral-primary mb-2">
                        P&L Type
                    </label>
                    <div className="flex gap-2">
                        {[
                            { id: "realized", label: "Realized" },
                            { id: "unrealized", label: "Unrealized" }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setPnLType(type.id as PnLType)
                                    handleFilterChange()
                                }}
                                className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold font-display uppercase tracking-widest transition-all ${pnlType === type.id
                                        ? 'bg-surface text-foreground shadow-sm ring-1 ring-border-subtle'
                                        : 'text-neutral hover:text-foreground'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range Picker */}
                <div className="flex-1">
                    <label className="block text-sm font-body text-neutral-primary mb-2">
                        Date Range
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={datePreset}
                            onChange={(e) => {
                                setDatePreset(e.target.value as DatePreset)
                                handleFilterChange()
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-surface/50 border border-border-subtle rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-border-subtle"
                        >
                            <option value="current-fy">Current FY (2025-26)</option>
                            <option value="previous-fy">Previous FY (2024-25)</option>
                            <option value="last-30">Last 30 Days</option>
                            <option value="last-90">Last 90 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateRange()}
                    </p>
                </div>

                {/* Broker Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-body text-neutral-primary mb-2">
                        Broker
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={broker}
                            onChange={(e) => {
                                setBroker(e.target.value as Broker)
                                handleFilterChange()
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-surface/50 border border-border-subtle rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-border-subtle"
                        >
                            <option value="combined">Combined (All)</option>
                            <option value="zerodha">Zerodha</option>
                            <option value="groww">Groww</option>
                            <option value="upstox">Upstox</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
