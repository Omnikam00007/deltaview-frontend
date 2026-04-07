// Shared TypeScript types matching backend response schemas

// --------------- Auth ---------------
export interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface UserResponse {
  id: string
  email: string
  full_name: string | null
}

// --------------- Instruments ---------------
export interface Instrument {
  id: string
  symbol: string
  isin: string | null
  name: string | null
  exchange: string | null
  segment: string | null
  sector: string | null
  lot_size: number
}

// --------------- Broker Account (brief) ---------------
export interface BrokerAccountBrief {
  id: string
  broker: string
  broker_client_id: string | null
}

// --------------- Holdings ---------------
export interface Holding {
  id: string
  user_id: string
  broker_account_id: string
  instrument_id: string
  quantity: number
  avg_cost: number
  ltp: number | null
  current_value: number | null
  invested_value: number | null
  pnl: number | null
  pnl_percent: number | null
  day_change: number | null
  day_change_percent: number | null
  as_of_date: string
  created_at: string
  updated_at: string
  instrument?: Instrument
  broker_account?: BrokerAccountBrief
}

export interface PortfolioSummary {
  total_invested: number
  current_value: number
  total_pnl: number
  total_pnl_percent: number
  holding_count: number
}

export interface HoldingTag {
  id: string
  user_id: string
  instrument_id: string
  tag_name: string
  created_at: string
}

// --------------- Trades ---------------
export interface Trade {
  id: string
  user_id: string
  broker_account_id: string
  instrument_id: string
  trade_type: "BUY" | "SELL"
  quantity: number
  price: number
  trade_value: number
  trade_date: string
  settlement_date: string | null
  order_id: string | null
  segment: string
  charges: Record<string, number> | any
  raw_data: Record<string, any> | any | null
  created_at: string
  updated_at?: string
  instrument?: Instrument
  broker_account?: BrokerAccountBrief
}

// --------------- Funds Balance ---------------
export interface FundsBalance {
  id: string
  user_id: string
  broker_account_id: string
  available_margin: number
  withdrawable_balance: number
  unsettled_credits: number
  pledged_margin: number
  used_margin: number
  total_margin: number
  as_of: string
  created_at: string
}

// --------------- Ledger Entries ---------------
export interface LedgerEntry {
  id: string
  user_id: string
  broker_account_id: string
  entry_date: string
  narration: string | null
  original_narration: string | null
  entry_type: "credit" | "debit"
  amount: number
  closing_balance: number | null
  category: string | null
  help_text: string | null
  transaction_ref: string | null
  raw_data?: any
  created_at: string
}

// --------------- Daily P&L ---------------
export interface DailyPnl {
  id: string
  user_id: string
  trade_date: string
  realized_pnl: number
  unrealized_pnl: number
  total_pnl: number
  trade_count: number
  segment: string
  created_at: string
}

// --------------- Portfolio Snapshots ---------------
export interface PortfolioSnapshot {
  id: string
  user_id: string
  snapshot_date: string
  total_value: number
  total_invested: number | null
  total_realized_pnl: number | null
  total_unrealized_pnl: number | null
  total_pnl: number | null
  cash_balance: number | null
  created_at: string
}

// --------------- Realized P&L ---------------
export interface RealizedPnl {
  id: string
  user_id: string
  instrument_id: string
  instrument?: Instrument
  buy_date: string
  sell_date: string
  buy_price: number
  sell_price: number
  quantity: number
  gross_pnl: number
  charges_total: number
  net_pnl: number
  holding_days: number
  tax_category: "STCG" | "LTCG"
  financial_year: string
}

// --------------- Tax Summary ---------------
export interface TaxCategoryBreakdown {
  gains: number
  tax_rate: number
  exemption_limit: number
  taxable_amount: number
  tax: number
}

export interface TaxSummary {
  financial_year: string
  stcg: TaxCategoryBreakdown
  ltcg: TaxCategoryBreakdown
  total_gains: number
  total_tax_liability: number
}

// --------------- Fund Transaction Create ---------------
export interface FundTransactionCreate {
  broker_account_id: string
  bank_account_id?: string
  transaction_type: "add" | "withdraw"
  amount: number
  payment_method?: string
  speed?: string
}

export interface FundTransaction {
  id: string
  user_id: string
  broker_account_id: string
  bank_account_id: string | null
  transaction_type: string
  amount: number
  payment_method: string | null
  speed: string | null
  status: string
  transaction_ref: string | null
  initiated_at: string
  completed_at: string | null
  failure_reason: string | null
}

// --------------- Broker Account ---------------
export interface BrokerAccount {
  id: string
  user_id: string
  broker: string
  broker_client_id: string | null
  is_active: boolean
  last_synced_at: string | null
  sync_status: string
  created_at: string
  updated_at: string
}
