"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function KPIDaysPnL() {
    const daysPnL = 3250
    const changePercent = 0.26
    const isPositive = daysPnL >= 0

    return (
        <Link href="#pnl" className="block group">
            <div className={`rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full ${isPositive
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800/30'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800/30'
                }`}>
                <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg shadow-lg ${isPositive
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-rose-600'
                        }`}>
                        {isPositive ? (
                            <TrendingUp className="w-5 h-5 text-white" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-white" />
                        )}
                    </div>
                </div>

                <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Today's P&L
                    </p>
                    <p className={`text-4xl font-bold tracking-tight ${isPositive
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}>
                        {isPositive ? '+' : ''}₹{Math.abs(daysPnL).toLocaleString('en-IN')}
                    </p>
                </div>

                <div className={`flex items-center gap-1.5 text-sm font-medium ${isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    <span>
                        {isPositive ? '+' : ''}{changePercent.toFixed(2)}% today
                    </span>
                </div>

                <div className={`mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    View P&L breakdown →
                </div>
            </div>
        </Link>
    )
}
