import { fetchApi } from "../api"
import type { Instrument } from "../types"

export const instrumentsService = {
  async search(query: string, params?: { exchange?: string; segment?: string }): Promise<Instrument[]> {
    const qs = new URLSearchParams({ search: query })
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    return fetchApi<Instrument[]>(`/instruments?${qs.toString()}`, { requireAuth: true })
  },

  async list(params?: { search?: string; exchange?: string; segment?: string; sector?: string }): Promise<Instrument[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<Instrument[]>(`/instruments${query}`, { requireAuth: true })
  },

  async getBySymbol(symbol: string): Promise<Instrument> {
    return fetchApi<Instrument>(`/instruments/by-symbol/${encodeURIComponent(symbol)}`, { requireAuth: true })
  },

  async get(id: string): Promise<Instrument> {
    return fetchApi<Instrument>(`/instruments/${id}`, { requireAuth: true })
  },

  async create(instrument: Partial<Instrument>): Promise<Instrument> {
    return fetchApi<Instrument>("/instruments", {
      method: "POST",
      body: JSON.stringify(instrument),
      requireAuth: true,
    })
  },
}
