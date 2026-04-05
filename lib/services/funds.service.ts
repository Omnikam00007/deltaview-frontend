import { fetchApi } from "../api"
import type { FundsBalance, LedgerEntry, FundTransaction, FundTransactionCreate, BrokerAccount } from "../types"

export const fundsService = {
  // Funds Balance
  async getBalances(): Promise<FundsBalance[]> {
    return fetchApi<FundsBalance[]>("/funds-balance", { requireAuth: true })
  },

  async syncBalance(data: Record<string, any>): Promise<FundsBalance> {
    return fetchApi<FundsBalance>("/funds-balance", {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },

  // Ledger Entries
  async listLedgerEntries(params?: {
    broker_account_id?: string
    category?: string
    start_date?: string
    end_date?: string
  }): Promise<LedgerEntry[]> {
    const qs = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString() ? `?${qs.toString()}` : ""
    return fetchApi<LedgerEntry[]>(`/ledger-entries${query}`, { requireAuth: true })
  },

  async createLedgerEntry(data: Record<string, any>): Promise<LedgerEntry> {
    return fetchApi<LedgerEntry>("/ledger-entries", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },

  // Fund Transactions (add/withdraw) – single endpoint with transaction_type field
  async addFunds(data: FundTransactionCreate): Promise<FundTransaction> {
    return fetchApi<FundTransaction>("/fund-transactions/", {
      method: "POST",
      body: JSON.stringify({ ...data, transaction_type: "add" }),
      requireAuth: true,
    })
  },

  async withdrawFunds(data: FundTransactionCreate): Promise<FundTransaction> {
    return fetchApi<FundTransaction>("/fund-transactions/", {
      method: "POST",
      body: JSON.stringify({ ...data, transaction_type: "withdraw" }),
      requireAuth: true,
    })
  },

  async listTransactions(): Promise<FundTransaction[]> {
    return fetchApi<FundTransaction[]>("/fund-transactions/", { requireAuth: true })
  },

  // Broker Accounts
  async listBrokerAccounts(): Promise<BrokerAccount[]> {
    return fetchApi<BrokerAccount[]>("/broker-accounts/", { requireAuth: true })
  },

  async createBrokerAccount(data: { broker: string; broker_client_id?: string }): Promise<BrokerAccount> {
    return fetchApi<BrokerAccount>("/broker-accounts/", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    })
  },
}
