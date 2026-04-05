import { fetchApi } from "../api"

export interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  change_percent: number
}

export const marketService = {
  async getIndices(): Promise<MarketIndex[]> {
    return fetchApi<MarketIndex[]>("/market/indices")
  },
}
