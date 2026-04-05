"use client"

import { TrendingUp, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import Link from "next/link"

// Sample 7-day trend data
const trendData = [
    { value: 245000 },
    { value: 248000 },
    { value: 246500 },
    { value: 251000 },
    { value: 253000 },
    { value: 255500 },
    { value: 258750 },
]

export default function EquityMFWidget() {
    const totalValue = 258750
    const previousValue = 245000
    const change = totalValue - previousValue
    const changePercent = ((change / previousValue) * 100).toFixed(2)
    const isPositive = change >= 0

    return (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Equity & MF Value
                        </h3>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                            ₹{totalValue.toLocaleString('en-IN')}
                        </p>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${isPositive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                            {isPositive ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3" />
                            )}
                            <span className="text-sm font-semibold">
                                {isPositive ? '+' : ''}{changePercent}%
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {isPositive ? '+' : ''}₹{Math.abs(change).toLocaleString('en-IN')} from last week
                    </p>
                </div>
            </div>

            {/* Sparkline Chart */}
            <div className="mb-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "#10b981" : "#ef4444"}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* View Detailed Report Link */}
            <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:gap-3 duration-300"
            >
                View Detailed Report
                <ExternalLink className="w-4 h-4" />
            </Link>
        </div>
    )
}
