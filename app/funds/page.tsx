"use client"

import { useState, useCallback } from "react"
import FundsFinancialSummary from "@/components/kokonutui/funds-financial-summary"
import FundsActionButtons from "@/components/kokonutui/funds-action-buttons"
import FundsLedgerTable from "@/components/kokonutui/funds-ledger-table"
import AddFundsModal from "@/components/kokonutui/add-funds-modal"
import WithdrawFundsModal from "@/components/kokonutui/withdraw-funds-modal"

export default function FundsPage() {
    const [showAddFunds, setShowAddFunds] = useState(false)
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleTransactionSuccess = useCallback(() => {
        // Changing key forces re-mount of child components to re-fetch data
        setRefreshKey((k) => k + 1)
    }, [])

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12]">
            <div className="max-w-[1600px] mx-auto p-6">
                <div className="flex flex-col gap-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold font-display text-foreground">
                            Funds & Ledger
                        </h1>
                        <p className="text-sm font-body text-neutral-primary mt-1">
                            The Checkbook - Track every rupee with bank passbook-style clarity
                        </p>
                    </div>

                {/* Financial Summary */}
                <FundsFinancialSummary key={`summary-${refreshKey}`} />

                {/* Action Buttons */}
                <FundsActionButtons
                    onAddFunds={() => setShowAddFunds(true)}
                    onWithdrawFunds={() => setShowWithdraw(true)}
                />

                {/* Ledger Table */}
                <FundsLedgerTable key={`ledger-${refreshKey}`} />

                {/* Modals */}
                <AddFundsModal
                    isOpen={showAddFunds}
                    onClose={() => setShowAddFunds(false)}
                    onSuccess={handleTransactionSuccess}
                />
                <WithdrawFundsModal
                    isOpen={showWithdraw}
                    onClose={() => setShowWithdraw(false)}
                    onSuccess={handleTransactionSuccess}
                />
                </div>
            </div>
        </div>
    )
}
