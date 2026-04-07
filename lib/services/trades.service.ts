import { fetchApi } from "../api"
import type { Trade } from "../types"

interface TradeFilters {
  broker_account_id?: string
  instrument_id?: string
  trade_type?: string
  segment?: string
  start_date?: string
  end_date?: string
}

export const tradesService = {
  async list(filters?: TradeFilters): Promise<Trade[]> {
    const params = new URLSearchParams()
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value)
      }
    }
    const qs = params.toString() ? `?${params.toString()}` : ""
    return fetchApi<Trade[]>(`/trades${qs}`, { requireAuth: true })
  },

  async get(id: string): Promise<Trade> {
    return fetchApi<Trade>(`/trades/${id}`, { requireAuth: true })
  },

  async create(data: {
    broker_account_id: string
    instrument_id: string
    trade_type: "BUY" | "SELL"
    quantity: number
    price: number
    trade_value: number
    trade_date: string
    segment?: string
  }): Promise<Trade> {
    return fetchApi<Trade>("/trades", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },

  async remove(id: string): Promise<void> {
    return fetchApi(`/trades/${id}`, { method: "DELETE", requireAuth: true })
  },

  async update(id: string, version: number, data: any): Promise<Trade> {
    return fetchApi<Trade>(`/trades/${id}?version=${version}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },
}
