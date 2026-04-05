"use client"

import { Wallet, Sparkles } from "lucide-react"
import Link from "next/link"

export default function KPIAvailableCash() {
    const availableCash = 65000
    const totalCash = 100000
    const utilizationPercent = ((totalCash - availableCash) / totalCash * 100).toFixed(0)

    return (
        <Link href="#funds" className="block group">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Available Cash
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        ₹{availableCash.toLocaleString('en-IN')}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400">
                    <span>
                        Ready to invest
                    </span>
                </div>

                <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-800/30">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Margin used</span>
                        <span className="font-semibold">{utilizationPercent}%</span>
                    </div>
                </div>

                <div className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Manage funds →
                </div>
            </div>
        </Link>
    )
}
