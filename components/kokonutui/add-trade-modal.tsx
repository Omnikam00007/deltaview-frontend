"use client"

import { X, Loader2, Search, ArrowRightLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { fundsService } from "@/lib/services/funds.service"
import { instrumentsService } from "@/lib/services/instruments.service"
import { tradesService } from "@/lib/services/trades.service"
import type { BrokerAccount } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AddTradeModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function AddTradeModal({ isOpen, onClose, onSuccess }: AddTradeModalProps) {
    const { toast } = useToast()
    const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([])
    const [loadingBrokers, setLoadingBrokers] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form inputs
    const [selectedBroker, setSelectedBroker] = useState<string>("")
    const [symbol, setSymbol] = useState("")
    const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [tradeDate, setTradeDate] = useState(new Date().toISOString().split("T")[0])

    const loadBrokerAccounts = () => {
        setLoadingBrokers(true)
        fundsService.listBrokerAccounts()
            .then((accounts) => {
                setBrokerAccounts(accounts)
                if (accounts.length > 0) {
                    setSelectedBroker(accounts[0].id)
                }
            })
            .catch(() => setBrokerAccounts([]))
            .finally(() => setLoadingBrokers(false))
    }

    useEffect(() => {
        if (isOpen) {
            loadBrokerAccounts()
            setSymbol("")
            setQuantity("")
            setPrice("")
            setError(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleAddTrade = async () => {
        if (!selectedBroker || !symbol || !quantity || !price || !tradeDate) {
            setError("All fields are required")
            return
        }

        const qtyNum = parseFloat(quantity)
        const priceNum = parseFloat(price)

        if (qtyNum <= 0 || priceNum <= 0) {
            setError("Quantity and Price must be positive")
            return
        }

        setSubmitting(true)
        setError(null)
        try {
            // 1. Resolve Symbol to Instrument ID using the backend yfinance sync
            const instrument = await instrumentsService.getBySymbol(symbol)
            if (!instrument || !instrument.id) {
                throw new Error(`Could not resolve symbol ${symbol}`)
            }

            // 2. Submit Trade
            await tradesService.create({
                broker_account_id: selectedBroker,
                instrument_id: instrument.id,
                trade_type: tradeType,
                quantity: qtyNum,
                price: priceNum,
                trade_value: qtyNum * priceNum,
                trade_date: tradeDate,
            })

            toast({
                title: "Trade Recorded",
                description: `Successfully recorded ${tradeType} for ${symbol.toUpperCase()}.`,
                variant: "default",
            })
            showAndClose()
        } catch (e: any) {
            setError(e.message || "Failed to record trade. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const showAndClose = () => {
        setTimeout(() => {
            onClose()
            if (onSuccess) onSuccess()
        }, 500)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface/50">
                    <div className="flex items-center gap-2 text-foreground font-display font-bold">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        Record Trade
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-neutral hover:text-foreground hover:bg-surface-hover rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-loss-primary/10 border border-loss-primary/20 rounded-xl text-sm text-loss-primary">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">1. Select Broker</label>
                            <div className="relative">
                                {loadingBrokers ? (
                                    <div className="w-full h-11 border border-border-subtle rounded-xl flex items-center justify-center bg-background/50">
                                        <Loader2 className="w-4 h-4 animate-spin text-neutral" />
                                    </div>
                                ) : (
                                    <select
                                        value={selectedBroker}
                                        onChange={(e) => setSelectedBroker(e.target.value)}
                                        className="w-full h-11 pl-4 pr-10 bg-background border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none bg-no-repeat"
                                        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
                                    >
                                        <option value="" disabled>Select a broker...</option>
                                        {brokerAccounts.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.broker} {b.broker_client_id ? `(${b.broker_client_id})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">2. Trade Type</label>
                                <div className="flex border border-border-subtle rounded-xl overflow-hidden p-[2px] bg-background">
                                    <button
                                        onClick={() => setTradeType("BUY")}
                                        className={`flex-1 py-2 text-sm font-bold tracking-tight rounded-lg transition-colors ${tradeType === "BUY" ? "bg-profit text-white shadow-sm" : "text-neutral hover:bg-surface-hover"}`}
                                    >
                                        BUY
                                    </button>
                                    <button
                                        onClick={() => setTradeType("SELL")}
                                        className={`flex-1 py-2 text-sm font-bold tracking-tight rounded-lg transition-colors ${tradeType === "SELL" ? "bg-loss-primary text-white shadow-sm" : "text-neutral hover:bg-surface-hover"}`}
                                    >
                                        SELL
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">Date</label>
                                <input
                                    type="date"
                                    value={tradeDate}
                                    onChange={(e) => setTradeDate(e.target.value)}
                                    className="w-full h-[42px] px-3 bg-background border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">3. Instrument Symbol</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-neutral" />
                                </div>
                                <input
                                    type="text"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                    placeholder="e.g. RELIANCE, TCS, INFY"
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-neutral/50 font-mono"
                                />
                            </div>
                            <p className="text-[10px] text-neutral flex justify-between">
                                <span>Will auto-resolve missing tickers securely via yfinance.</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">Total Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-neutral/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">Price per unit</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-medium text-neutral">₹</div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        step="0.05"
                                        className="w-full pl-8 pr-4 py-3 bg-background border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-neutral/50 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="p-6 pt-0 mt-2">
                    <button
                        onClick={handleAddTrade}
                        disabled={submitting || !selectedBroker || !symbol || !quantity || !price}
                        className={`w-full py-3.5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                            submitting || !selectedBroker || !symbol || !quantity || !price
                                ? 'bg-neutral/20 text-neutral cursor-not-allowed'
                                : tradeType === "BUY"
                                    ? 'bg-profit text-white hover:bg-profit/90 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                    : 'bg-loss-primary text-white hover:bg-loss-primary/90 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        }`}
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Confirm {tradeType}</>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-neutral mt-4 italic">
                        By logging this trade, your portfolio holdings and Realized P&L are automatically updated according to FIFO reporting guidelines.
                    </p>
                </div>
            </div>
        </div>
    )
}
