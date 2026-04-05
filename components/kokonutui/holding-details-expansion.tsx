"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Calendar, Tag } from "lucide-react"

interface BrokerBreakdown {
    broker: string
    qty: number
    avgCost: number
}

interface Holding {
    id: string
    symbol: string
    sector: string
    quantity: number
    avgCost: number
    ltp: number
    currentValue: number
    pnlPercent: number
    allocation: number
    brokers: string[]
    brokerBreakdown: BrokerBreakdown[]
    isin: string
}

// Sample 30-day price data
const priceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: 2400 + Math.random() * 200 + i * 5
}))

const corporateActions = [
    { type: "Dividend", date: "2024-03-15", amount: "₹12 per share", status: "upcoming" },
    { type: "Bonus", date: "2024-02-01", ratio: "1:1", status: "completed" }
]

export default function HoldingDetailsExpansion({ holding }: { holding: Holding }) {
    const getBrokerColor = (broker: string) => {
        const colors = {
            zerodha: "text-blue-600 dark:text-blue-400",
            groww: "text-green-600 dark:text-green-400",
            upstox: "text-purple-600 dark:text-purple-400"
        }
        return colors[broker as keyof typeof colors] || "text-gray-600"
    }

    return (
        <div className="p-6 space-y-6">
            {/* Broker Breakdown */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Broker Breakdown</h4>
                <div className="bg-white dark:bg-[#1F1F23] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-[#0F0F12]">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">Broker</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Avg. Cost</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Value</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {holding.brokerBreakdown.map((breakdown, index) => {
                                const value = breakdown.qty * holding.ltp
                                const pnl = value - (breakdown.qty * breakdown.avgCost)
                                const pnlPercent = ((pnl / (breakdown.qty * breakdown.avgCost)) * 100).toFixed(2)

                                return (
                                    <tr key={index}>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${getBrokerColor(breakdown.broker)}`}>
                                                {breakdown.broker.charAt(0).toUpperCase() + breakdown.broker.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{breakdown.qty}</td>
                                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                            ₹{breakdown.avgCost.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-medium">
                                            ₹{value.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN')} ({pnl >= 0 ? '+' : ''}{pnlPercent}%)
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 30-Day Price Chart */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">30-Day Price Trend</h4>
                    <div className="bg-white dark:bg-[#1F1F23] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={priceData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" hide />
                                    <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Insights & Corporate Actions */}
                <div className="space-y-4">
                    {/* Insights */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Insights</h4>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-amber-900 dark:text-amber-200">
                                        This stock makes up <strong>{holding.allocation}%</strong> of your portfolio
                                        {holding.allocation > 10 && ", which is higher than the recommended 10% limit."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Corporate Actions */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Corporate Actions</h4>
                        <div className="space-y-2">
                            {corporateActions.map((action, index) => (
                                <div key={index} className="bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{action.type}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${action.status === 'upcoming'
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {action.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.date}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                {'amount' in action ? action.amount : `Ratio: ${action.ratio}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                <Tag className="w-3 h-3" />
                                Long Term
                            </span>
                            <button className="px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                + Add Tag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
