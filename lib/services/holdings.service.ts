import { fetchApi } from "../api"
import type { Holding, ConsolidatedHolding, PortfolioSummary, HoldingTag } from "../types"

export const holdingsService = {
  async list(params?: { broker_account_id?: string; segment?: string }): Promise<Holding[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<Holding[]>(`/holdings/${query}`, { requireAuth: true })
  },

  async listConsolidated(): Promise<ConsolidatedHolding[]> {
    return fetchApi<ConsolidatedHolding[]>("/holdings/?consolidated=true", { requireAuth: true })
  },

  async syncHoldings(holdings: any[]): Promise<void> {
    return fetchApi("/holdings/sync", {
      method: "POST",
      body: JSON.stringify({ holdings }),
      requireAuth: true,
    })
  },

  async refreshPrices(): Promise<void> {
    return fetchApi("/holdings/refresh-prices", { method: "POST", requireAuth: true })
  },

  async getSummary(): Promise<PortfolioSummary> {
    return fetchApi<PortfolioSummary>("/holdings/summary", { requireAuth: true })
  },

  async get(id: string): Promise<Holding> {
    return fetchApi<Holding>(`/holdings/${id}`, { requireAuth: true })
  },

  async create(data: Record<string, any>): Promise<Holding> {
    return fetchApi<Holding>("/holdings/", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },

  async update(id: string, data: Record<string, any>): Promise<Holding> {
    return fetchApi<Holding>(`/holdings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },

  async remove(id: string): Promise<void> {
    return fetchApi(`/holdings/${id}`, { method: "DELETE", requireAuth: true })
  },

  // Tags
  async listTags(instrumentId?: string): Promise<HoldingTag[]> {
    const params = instrumentId ? `?instrument_id=${instrumentId}` : ""
    return fetchApi<HoldingTag[]>(`/holdings/tags/${params}`, { requireAuth: true })
  },

  async addTag(instrumentId: string, tagName: string): Promise<HoldingTag> {
    return fetchApi<HoldingTag>("/holdings/tags", {
      method: "POST",
      body: JSON.stringify({ instrument_id: instrumentId, tag_name: tagName }),
      requireAuth: true,
    })
  },

  async removeTag(tagId: string): Promise<void> {
    return fetchApi(`/holdings/tags/${tagId}`, { method: "DELETE", requireAuth: true })
  },
}
