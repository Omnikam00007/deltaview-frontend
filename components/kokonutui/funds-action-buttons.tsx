"use client"

import { Plus, ArrowDownToLine } from "lucide-react"

interface FundsActionButtonsProps {
    onAddFunds: () => void
    onWithdrawFunds: () => void
}

export default function FundsActionButtons({ onAddFunds, onWithdrawFunds }: FundsActionButtonsProps) {
    return (
        <div className="flex gap-3">
            <button
                onClick={onAddFunds}
                className="px-6 py-2.5 rounded-lg bg-profit text-white font-body font-medium text-sm hover:bg-profit/90 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Funds
            </button>
            <button
                onClick={onWithdrawFunds}
                className="px-6 py-2.5 rounded-lg bg-surface border border-border-subtle text-foreground font-body font-medium text-sm hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
            >
                <ArrowDownToLine className="w-4 h-4" />
                Withdraw Funds
            </button>
        </div>
    )
}
