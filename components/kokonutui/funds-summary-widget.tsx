"use client"

import { Wallet, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function FundsSummaryWidget() {
    const totalCash = 100000
    const usedMargin = 35000
    const availableCash = totalCash - usedMargin
    const utilizationPercent = (usedMargin / totalCash) * 100

    // Color based on utilization
    const getProgressColor = () => {
        if (utilizationPercent < 50) return "bg-green-500"
        if (utilizationPercent < 75) return "bg-amber-500"
        return "bg-red-500"
    }

    return (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                    <Wallet className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Funds Summary
                </h3>
            </div>

            {/* Total Cash */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{totalCash.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Cash</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Utilization
                    </span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {utilizationPercent.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
                        style={{ width: `${utilizationPercent}%` }}
                    />
                </div>
            </div>

            {/* Used vs Available */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-[#1F1F23] rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Used Margin</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{usedMargin.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1F1F23] rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ₹{availableCash.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* View Detailed Report Link */}
            <div className="mt-auto">
                <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:gap-3 duration-300"
                >
                    View Detailed Report
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
