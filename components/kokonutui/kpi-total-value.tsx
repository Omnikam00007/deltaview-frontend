"use client"

import { TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function KPITotalValue() {
    const totalValue = 1245000
    const previousValue = 1230250
    const change = totalValue - previousValue
    const changePercent = ((change / previousValue) * 100).toFixed(2)
    const isPositive = change >= 0

    return (
        <Link href="#holdings" className="block group">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Total Portfolio Value
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        ₹{totalValue.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className={`flex items-center gap-1.5 text-sm font-medium ${isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>
                        Up {changePercent}% from yesterday
                    </span>
                </div>

                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view holdings →
                </div>
            </div>
        </Link>
    )
}
