"use client"

import { ArrowUpRight, ArrowDownRight, Wallet, Percent, LineChart, TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react"
import { LineChart as RechartsLineChart, Line, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { holdingsService } from "@/lib/services/holdings.service"
import { fundsService } from "@/lib/services/funds.service"
import type { PortfolioSummary, FundsBalance } from "@/lib/types"

export default function KPIRow() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [fundsBalances, setFundsBalances] = useState<FundsBalance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      holdingsService.getSummary().catch(() => null),
      fundsService.getBalances().catch(() => []),
    ]).then(([s, f]) => {
      setSummary(s)
      setFundsBalances(f)
    }).finally(() => setLoading(false))
  }, [])

  const totalValue = summary?.current_value ?? 0
  const totalPnLPercent = summary?.total_pnl_percent ?? 0
  const availableCash = fundsBalances.reduce((s, b) => s + b.available_margin, 0)
  const totalMargin = fundsBalances.reduce((s, b) => s + b.total_margin, 0)
  const usedMargin = fundsBalances.reduce((s, b) => s + b.used_margin, 0)
  const marginPercent = totalMargin > 0 ? Math.round((usedMargin / totalMargin) * 100) : 0

  const sparklineData = [
    { value: totalValue * 0.97 },
    { value: totalValue * 0.98 },
    { value: totalValue * 0.975 },
    { value: totalValue * 0.99 },
    { value: totalValue * 0.985 },
    { value: totalValue },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface border border-border-subtle p-4 h-32 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-neutral" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Value Card */}
      <div className="bg-surface border border-border-subtle flex flex-col justify-between p-4 hover:border-accent-blue/50 transition-colors shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[11px] font-bold text-neutral uppercase tracking-widest font-display">Total Value</div>
          <Wallet className="h-4 w-4 text-neutral/50" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground">₹{totalValue.toLocaleString('en-IN')}</div>
          <div className="flex items-center gap-2">
             <div className={`flex items-center text-xs font-semibold ${totalPnLPercent >= 0 ? 'text-profit' : 'text-loss-primary'}`}>
               {totalPnLPercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
               {totalPnLPercent.toFixed(2)}%
             </div>
          </div>
        </div>
        <div className="h-10 mt-4 w-full opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke={totalPnLPercent >= 0 ? 'var(--profit-primary)' : 'var(--loss-primary)'} strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's P&L Card */}
      <div className="bg-surface border border-border-subtle flex flex-col justify-between p-4 hover:border-profit/50 transition-colors shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[11px] font-bold text-neutral uppercase tracking-widest font-display">Today's P&L</div>
          <TrendingUp className="h-4 w-4 text-profit/50" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral">—</div>
          <div className="flex items-center gap-2 mt-auto">
             <div className="text-[10px] text-neutral font-medium">Live data coming soon</div>
          </div>
        </div>
      </div>

      {/* Available Cash Card */}
      <div className="bg-surface border border-border-subtle flex flex-col justify-between p-4 hover:border-accent-blue/50 transition-colors shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[11px] font-bold text-neutral uppercase tracking-widest font-display">Available Cash</div>
          <Activity className="h-4 w-4 text-neutral/50" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground">₹{availableCash.toLocaleString('en-IN')}</div>
          
          <div className="mt-4 flex flex-col gap-1.5">
             <div className="flex justify-between items-center text-[10px] font-semibold text-neutral">
               <span>MARGIN USAGE</span>
               <span className="text-foreground">{marginPercent}%</span>
             </div>
             <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
               <div className="h-full bg-accent-blue rounded-full" style={{ width: `${marginPercent}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* XIRR Card */}
      <div className="bg-surface border border-border-subtle flex flex-col justify-between p-4 hover:border-profit/50 transition-colors shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[11px] font-bold text-neutral uppercase tracking-widest font-display">XIRR (Lifetime)</div>
          <Percent className="h-4 w-4 text-neutral/50" />
        </div>
        <div className="flex flex-col gap-1 flex-1 justify-between">
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral">—</div>
          <div className="flex items-center gap-2 mt-auto">
             <div className="text-[10px] text-neutral font-medium">Computed with full trade history</div>
          </div>
        </div>
      </div>

    </div>
  )
}
