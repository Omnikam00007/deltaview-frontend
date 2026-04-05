"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import { authService } from "@/lib/services/auth.service"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Please enter your email address.")
            return
        }

        setIsLoading(true)
        try {
            await authService.forgotPassword(email)
            setSent(true)
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
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

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F12] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Ambient glow blobs */}
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

                {/* Logo */}
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
                    className="bg-white dark:bg-[#0F0F12] rounded-2xl border border-gray-200 dark:border-[#1F1F23] shadow-xl p-8 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {!sent ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-7">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        Reset your password
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Enter your email and we'll send you a reset link.
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

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                id="reset-email"
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-[#2B2B30] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        id="reset-submit"
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Sending link...
                                            </>
                                        ) : (
                                            <>
                                                Send reset link
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            /* Success State */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center py-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                    className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 mx-auto mb-4"
                                >
                                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                                </motion.div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    We sent a reset link to
                                </p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">
                                    {email}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                                    Didn't receive it?{" "}
                                    <button
                                        onClick={() => setSent(false)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Try again
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Back to login */}
                <motion.div variants={itemVariants} className="flex justify-center mt-6">
                    <Link
                        href="/auth/login"
                        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}
