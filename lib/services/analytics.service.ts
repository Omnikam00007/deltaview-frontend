import { fetchApi } from "../api"
import type { DailyPnl, PortfolioSnapshot, RealizedPnl, TaxSummary } from "../types"

export const analyticsService = {
  // Dashboard Summary
  async getDashboardSummary(): Promise<any> {
    return fetchApi<any>("/analytics/dashboard/", { requireAuth: true })
  },
  // Daily P&L
  async listDailyPnl(params?: {
    start_date?: string
    end_date?: string
    segment?: string
  }): Promise<DailyPnl[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<DailyPnl[]>(`/analytics/daily-pnl/${query}`, { requireAuth: true })
  },

  // Portfolio Snapshots
  async listPortfolioSnapshots(params?: {
    start_date?: string
    end_date?: string
  }): Promise<PortfolioSnapshot[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<PortfolioSnapshot[]>(`/analytics/snapshots/${query}`, { requireAuth: true })
  },

  // Realized P&L
  async listRealizedPnl(params?: {
    instrument_id?: string
    tax_category?: string
    financial_year?: string
    start_date?: string
    end_date?: string
  }): Promise<RealizedPnl[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<RealizedPnl[]>(`/analytics/realized-pnl/${query}`, { requireAuth: true })
  },

  // Tax Summary
  async getTaxSummary(financial_year?: string): Promise<TaxSummary> {
    const qs = financial_year ? `?financial_year=${financial_year}` : ""
    return fetchApi<TaxSummary>(`/analytics/tax-summary/${qs}`, { requireAuth: true })
  },
}
