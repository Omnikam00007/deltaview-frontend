"use client"

import { Treemap, ResponsiveContainer, Tooltip } from "recharts"

const portfolioHoldings = [
    // Positive returns
    { name: "RELIANCE", value: 64500, change: 5.3, sector: "Energy", color: "var(--profit-primary, #118E66)" },
    { name: "HDFCBANK", value: 67200, change: 10.5, sector: "Banking", color: "var(--profit-secondary, #2EA07B)" },
    { name: "TCS", value: 51750, change: 7.8, sector: "IT", color: "var(--profit-tertiary, #4CB493)" },
    { name: "ICICIBANK", value: 52500, change: 14.1, sector: "Banking", color: "var(--profit-primary, #118E66)" },

    // Negative returns
    { name: "INFY", value: 41400, change: -2.8, sector: "IT", color: "var(--loss-primary, #FF3D00)" },

    // Mutual Funds
    { name: "HDFC MF", value: 125000, change: 4.7, sector: "Mutual Fund", color: "var(--accent-blue, #2275FF)" },
    { name: "SBI MF", value: 98000, change: 3.2, sector: "Mutual Fund", color: "var(--accent-blue, #2275FF)" },
    { name: "ICICI MF", value: 67000, change: 2.8, sector: "Mutual Fund", color: "var(--accent-blue, #2275FF)" },

    // Gold
    { name: "GOLD ETF", value: 85000, change: 1.2, sector: "Gold", color: "var(--neutral-primary, #6B7280)" },
    { name: "SGB", value: 72000, change: 0.8, sector: "Gold", color: "var(--neutral, #9CA3AF)" },
]

const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, value, change } = props

    if (width < 60 || height < 40) return null

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: props.color,
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
            />
            <text
                x={x + width / 2}
                y={y + height / 2 - 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={width > 100 ? 14 : 11}
                fontWeight="600"
            >
                {name}
            </text>
            <text
                x={x + width / 2}
                y={y + height / 2 + 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={width > 100 ? 12 : 10}
                opacity={0.9}
            >
                ₹{(value / 1000).toFixed(0)}K
            </text>
            {width > 80 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 24}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                    fontWeight="500"
                >
                    {change > 0 ? '+' : ''}{change}%
                </text>
            )}
        </g>
    )
}

export default function PortfolioTreemapAnalytics() {
    return (
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-[11px] uppercase tracking-widest font-display text-neutral">
                    Portfolio Heatmap
                </h3>
            </div>

            {/* Treemap */}
            <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={portfolioHoldings}
                        dataKey="value"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent />}
                    >
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="bg-surface/95 backdrop-blur border border-border-subtle p-3 rounded-xl shadow-lg font-body flex flex-col gap-1">
                                            <p className="font-bold text-foreground font-sans tracking-tight leading-none">{data.name}</p>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral font-mono">{data.sector}</p>
                                            <p className="text-xs text-neutral mt-2">Value: <span className="font-mono text-foreground font-bold">₹{data.value.toLocaleString('en-IN')}</span></p>
                                            <p className={`text-xs font-medium font-mono mt-1 ${data.change >= 0 ? 'text-profit' : 'text-loss-primary'
                                                }`}>
                                                Change: {data.change >= 0 ? '+' : ''}{data.change}%
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-auto pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-profit" />
                            <span className="text-neutral-primary font-body">Positive Returns</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-loss-primary" />
                            <span className="text-neutral-primary font-body">Negative Returns</span>
                        </div>
                    </div>
                    <span className="text-neutral font-body">
                        Size = Value | Color = Performance
                    </span>
                </div>
            </div>
        </div>
    )
}
