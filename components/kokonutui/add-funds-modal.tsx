"use client"

import { X, Sparkles, Loader2, ChevronDown, Plus, Building2 } from "lucide-react"
import { useState, useEffect } from "react"
import { fundsService } from "@/lib/services/funds.service"
import type { BrokerAccount } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AddFundsModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const BROKER_OPTIONS = [
    { value: "zerodha", label: "Zerodha", icon: "🟢" },
    { value: "groww", label: "Groww", icon: "🟣" },
    { value: "upstox", label: "Upstox", icon: "🔵" },
    { value: "angelone", label: "Angel One", icon: "🔴" },
    { value: "icici_direct", label: "ICICI Direct", icon: "🟠" },
    { value: "hdfc_securities", label: "HDFC Securities", icon: "🔷" },
    { value: "kotak_securities", label: "Kotak Securities", icon: "🟤" },
    { value: "motilal_oswal", label: "Motilal Oswal", icon: "🟡" },
    { value: "paytm_money", label: "Paytm Money", icon: "🩵" },
    { value: "dhan", label: "Dhan", icon: "⚫" },
    { value: "other", label: "Other Broker", icon: "🏦" },
]

export default function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
    const { toast } = useToast()
    const [amount, setAmount] = useState("")
    const [selectedBroker, setSelectedBroker] = useState<string>("")
    const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([])
    const [loadingBrokers, setLoadingBrokers] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Inline broker creation state
    const [showAddBroker, setShowAddBroker] = useState(false)
    const [newBrokerName, setNewBrokerName] = useState("")
    const [newBrokerClientId, setNewBrokerClientId] = useState("")
    const [creatingBroker, setCreatingBroker] = useState(false)

    const loadBrokerAccounts = () => {
        setLoadingBrokers(true)
        fundsService.listBrokerAccounts()
            .then((accounts) => {
                setBrokerAccounts(accounts)
                if (accounts.length === 1) {
                    setSelectedBroker(accounts[0].id)
                }
                // If no accounts exist, show the add broker step
                if (accounts.length === 0) {
                    setShowAddBroker(true)
                }
            })
            .catch(() => setBrokerAccounts([]))
            .finally(() => setLoadingBrokers(false))
    }

    useEffect(() => {
        if (isOpen) {
            loadBrokerAccounts()
        }
    }, [isOpen])

    if (!isOpen) return null

    const quickAmounts = [1000, 5000, 10000, 25000]

    const handleCreateBroker = async () => {
        if (!newBrokerName) return
        setCreatingBroker(true)
        setError(null)
        try {
            const newAccount = await fundsService.createBrokerAccount({
                broker: newBrokerName,
                broker_client_id: newBrokerClientId || undefined,
            })
            setBrokerAccounts((prev) => [...prev, newAccount])
            setSelectedBroker(newAccount.id)
            setShowAddBroker(false)
            setNewBrokerName("")
            setNewBrokerClientId("")
        } catch (e: any) {
            setError(e.message || "Failed to add broker account")
        } finally {
            setCreatingBroker(false)
        }
    }

    const handleAddFunds = async () => {
        if (!selectedBroker || !amount || parseFloat(amount) <= 0) return

        setSubmitting(true)
        setError(null)
        try {
            await fundsService.addFunds({
                broker_account_id: selectedBroker,
                transaction_type: "add",
                amount: parseFloat(amount),
            })
            toast({
                title: 'Deposit successful',
                description: 'Funds will be available for withdrawal after 2 business days.',
            })
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                onSuccess?.()
                handleClose()
            }, 2000)
        } catch (e: any) {
            setError(e.message || "Failed to add funds")
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setError(null)
        setAmount("")
        setSelectedBroker("")
        setShowAddBroker(false)
        setNewBrokerName("")
        setNewBrokerClientId("")
        onClose()
    }

    const selectedAccount = brokerAccounts.find(a => a.id === selectedBroker)
    const getBrokerLabel = (broker: string) => {
        const opt = BROKER_OPTIONS.find(o => o.value === broker)
        return opt ? `${opt.icon} ${opt.label}` : broker.toUpperCase()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border-subtle rounded-xl w-full max-w-md p-6 relative">
                {/* Success Animation */}
                {showSuccess && (
                    <div className="absolute inset-0 bg-surface/90 backdrop-blur rounded-xl flex flex-col items-center justify-center z-10">
                        <Sparkles className="w-16 h-16 text-profit mb-4 animate-pulse" />
                        <p className="text-2xl font-bold font-display tracking-tight text-profit">
                            Funds Added!
                        </p>
                        <p className="text-sm font-body text-neutral-primary mt-2">
                            ₹{parseFloat(amount).toLocaleString('en-IN')} deposited to {selectedAccount ? getBrokerLabel(selectedAccount.broker) : 'account'}
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold font-display text-foreground">
                        Add Funds
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-neutral hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loadingBrokers ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 animate-spin text-neutral" />
                        <span className="ml-2 text-sm text-neutral">Loading...</span>
                    </div>
                ) : showAddBroker ? (
                    /* ──── Step: Add Broker Account ──── */
                    <div>
                        <div className="mb-4 p-3 bg-accent-blue/5 border border-accent-blue/20 rounded-lg">
                            <p className="text-sm font-body text-foreground">
                                {brokerAccounts.length === 0
                                    ? "Let's connect your brokerage account first to start tracking funds."
                                    : "Add another brokerage account."}
                            </p>
                        </div>

                        {/* Broker Selection Grid */}
                        <div className="mb-4">
                            <label className="text-[11px] uppercase tracking-widest font-display text-neutral mb-2 block">
                                Select Your Broker
                            </label>
                            <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-1">
                                {BROKER_OPTIONS.map((broker) => (
                                    <button
                                        key={broker.value}
                                        onClick={() => setNewBrokerName(broker.value)}
                                        className={`p-3 rounded-lg border transition-all text-center ${
                                            newBrokerName === broker.value
                                                ? 'border-accent-blue bg-accent-blue/10 ring-1 ring-accent-blue/30'
                                                : 'border-border-subtle bg-background hover:border-accent-blue/30'
                                        }`}
                                    >
                                        <span className="text-xl block mb-1">{broker.icon}</span>
                                        <span className="text-[11px] font-display font-bold text-foreground block leading-tight">
                                            {broker.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Client ID (Optional) */}
                        {newBrokerName && (
                            <div className="mb-5">
                                <label className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1 block">
                                    Client ID <span className="text-neutral/50">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newBrokerClientId}
                                    onChange={(e) => setNewBrokerClientId(e.target.value)}
                                    placeholder="e.g. AB1234"
                                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-neutral focus:outline-none focus:border-accent-blue/50 transition-colors"
                                />
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-loss-primary/10 border border-loss-primary/30 rounded-lg text-sm text-loss-primary font-body">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {brokerAccounts.length > 0 && (
                                <button
                                    onClick={() => { setShowAddBroker(false); setError(null) }}
                                    className="flex-1 px-4 py-3 bg-background border border-border-subtle text-foreground rounded-lg font-body font-medium hover:bg-surface-hover transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleCreateBroker}
                                disabled={!newBrokerName || creatingBroker}
                                className="flex-1 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-surface-hover disabled:text-neutral disabled:border disabled:border-border-subtle disabled:cursor-not-allowed text-white rounded-lg font-body font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {creatingBroker ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                                ) : (
                                    <><Plus className="w-4 h-4" /> Connect Broker</>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ──── Step: Enter Amount ──── */
                    <div>
                        {/* Broker Selector */}
                        <div className="mb-4">
                            <label className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1 block">
                                Broker Account
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={selectedBroker}
                                        onChange={(e) => setSelectedBroker(e.target.value)}
                                        className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-accent-blue/50 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="">Select account</option>
                                        {brokerAccounts.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {getBrokerLabel(acc.broker)}{acc.broker_client_id ? ` — ${acc.broker_client_id}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral pointer-events-none" />
                                </div>
                                <button
                                    onClick={() => { setShowAddBroker(true); setError(null) }}
                                    className="px-3 py-3 bg-background border border-border-subtle hover:bg-surface-hover rounded-lg transition-colors"
                                    title="Add another broker"
                                >
                                    <Plus className="w-4 h-4 text-neutral" />
                                </button>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="text-[11px] uppercase tracking-widest font-display text-neutral mb-1 block">
                                Deposit Amount (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-lg">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="10,000"
                                    className="w-full bg-background border border-border-subtle rounded-lg pl-8 pr-4 py-3 text-sm font-body text-foreground placeholder:text-neutral focus:outline-none focus:border-accent-blue/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {quickAmounts.map((qa) => (
                                <button
                                    key={qa}
                                    onClick={() => setAmount(qa.toString())}
                                    className="px-3 py-2 bg-background border border-border-subtle hover:bg-surface-hover rounded-lg text-sm font-medium text-foreground transition-colors"
                                >
                                    ₹{(qa / 1000).toFixed(0)}K
                                </button>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-loss-primary/10 border border-loss-primary/30 rounded-lg text-sm text-loss-primary font-body">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 bg-background border border-border-subtle text-foreground rounded-lg font-body font-medium hover:bg-surface-hover transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddFunds}
                                disabled={!amount || parseFloat(amount) <= 0 || !selectedBroker || submitting}
                                className="flex-1 px-4 py-3 bg-profit hover:bg-profit/90 disabled:bg-surface-hover disabled:text-neutral disabled:border disabled:border-border-subtle disabled:cursor-not-allowed text-white rounded-lg font-body font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : (
                                    'Confirm Deposit'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
