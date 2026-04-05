"use client"

import { Activity, TrendingUp, TrendingDown, DollarSign, ExternalLink } from "lucide-react"
import Link from "next/link"

const recentActivities = [
    {
        id: 1,
        type: "buy",
        description: "Bought 50 shares of RELIANCE",
        timestamp: "2 hours ago",
        amount: 125000,
        icon: TrendingUp,
    },
    {
        id: 2,
        type: "dividend",
        description: "Dividend received from HDFC Bank",
        timestamp: "5 hours ago",
        amount: 2500,
        icon: DollarSign,
    },
    {
        id: 3,
        type: "sell",
        description: "Sold 30 shares of TCS",
        timestamp: "1 day ago",
        amount: 95000,
        icon: TrendingDown,
    },
]

export default function RecentActivityWidget() {
    const getActivityColor = (type: string) => {
        switch (type) {
            case "buy":
                return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
            case "sell":
                return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
            case "dividend":
                return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
            default:
                return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30"
        }
    }

    const getAmountColor = (type: string) => {
        switch (type) {
            case "buy":
            case "sell":
                return type === "buy"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
            case "dividend":
                return "text-green-600 dark:text-green-400"
            default:
                return "text-gray-900 dark:text-white"
        }
    }

    return (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
                    <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Recent Activity
                </h3>
            </div>

            {/* Activity List */}
            <div className="space-y-4 mb-6">
                {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {activity.timestamp}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-semibold ${getAmountColor(activity.type)}`}>
                                    {activity.type === "buy" ? "-" : "+"}₹{activity.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* View All Activity Link */}
            <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:gap-3 duration-300"
            >
                View All Activity
                <ExternalLink className="w-4 h-4" />
            </Link>
        </div>
    )
}
