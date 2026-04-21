"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { authService } from "@/lib/services/auth.service"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // Assumed email from query params
    const email = searchParams.get("email") || ""

    const [value, setValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [resendStatus, setResendStatus] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setResendStatus("")

        if (value.length !== 6) {
            setError("Please enter the complete 6-digit code.")
            return
        }

        if (!email) {
            setError("Missing email address. Please start the registration process again.")
            return
        }

        setIsLoading(true)
        try {
            const data: any = await authService.verifyEmail({ email, otp: value })
            authService.setToken(data)
            setSuccess(true)
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Invalid or expired verification code.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setError("")
        setResendStatus("")
        if (!email) {
            setError("Missing email address.")
            return
        }
        try {
            await authService.resendVerifyEmail(email)
            setResendStatus("A new verification code has been sent.")
        } catch (err: any) {
            setError(err.message || "Failed to resend code.")
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0F0F12] flex items-center justify-center p-4 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]"
                />
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="z-10 text-center max-w-sm"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 mx-auto mb-4"
                    >
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email verified!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                        Your email address has been successfully verified. You can now access all features.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12] flex items-center justify-center p-4 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]"
            />

            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <span className="text-3xl font-bold tracking-tighter text-blue-500">∆</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-display">
                        DeltaView
                    </span>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-[#0F0F12] rounded-2xl border border-gray-200 dark:border-[#1F1F23] shadow-xl p-8"
                >
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Check your email
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            We've sent a verification code to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>. Make sure to check your spam box.
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center space-y-4">
                            <InputOTP
                                maxLength={6}
                                value={value}
                                onChange={(value) => setValue(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                    <InputOTPSlot index={1} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                    <InputOTPSlot index={2} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                    <InputOTPSlot index={4} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                    <InputOTPSlot index={5} className="w-12 h-14 text-lg border-gray-200 dark:border-[#2B2B30] dark:bg-[#1A1A1F] focus-within:ring-blue-500/60" />
                                </InputOTPGroup>
                            </InputOTP>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading || value.length < 6}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify email
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {resendStatus && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden text-center"
                            >
                                <p className="text-sm text-green-600 dark:text-green-400">{resendStatus}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            Click to resend
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0F0F12]" />}>
            <VerifyEmailContent />
        </Suspense>
    )
}
