"use client"

import { PieChart, ExternalLink } from "lucide-react"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import Link from "next/link"

const portfolioData = [
    { name: "Equity", value: 145000, color: "#3b82f6" },
    { name: "Mutual Funds", value: 85000, color: "#8b5cf6" },
    { name: "Cash", value: 65000, color: "#10b981" },
    { name: "Others", value: 25000, color: "#f59e0b" },
]

const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

export default function PortfolioBreakdownWidget() {
    return (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                    <PieChart className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Portfolio Breakdown
                </h3>
            </div>

            {/* Donut Chart */}
            <div className="flex-1 min-h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                        <Pie
                            data={portfolioData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {portfolioData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                    </RechartsPie>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-2 mb-4">
                {portfolioData.map((item) => {
                    const percentage = ((item.value / totalValue) * 100).toFixed(1)
                    return (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.name}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {percentage}%
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ₹{item.value.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    )
                })}
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
