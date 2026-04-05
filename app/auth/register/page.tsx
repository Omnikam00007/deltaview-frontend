"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Eye, EyeOff, TrendingUp, Lock, Mail, User, ArrowRight, AlertCircle,
    CheckCircle2, Check
} from "lucide-react"
import { authService } from "@/lib/services/auth.service"

const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number", test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const setField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
            setError("Please fill in all fields.")
            return
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        if (!passwordRules.every((r) => r.test(form.password))) {
            setError("Password does not meet the requirements.")
            return
        }

        setIsLoading(true)
        try {
            const data = await authService.register({
                full_name: form.fullName, // Adjust to backend expected key
                email: form.email,
                password: form.password,
            })
            // Optionally, we could set the token right away using:
            // authService.setToken(data as any)
            // but the current flow is to show the success message which directs to verify-email.
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.")
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account created!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                        We sent a confirmation link to <span className="font-medium text-gray-700 dark:text-gray-300">{form.email}</span>.
                        Verify your email to start tracking your portfolio.
                    </p>
                    <Link
                        href="/auth/verify-email"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                    >
                        Verify Email <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        )
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

                {/* Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-[#0F0F12] rounded-2xl border border-gray-200 dark:border-[#1F1F23] shadow-xl p-8"
                >

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Create your account
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Start tracking your portfolio in minutes
                        </p>
                    </div>

                    {/* Error Banner */}
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

                        {/* Full Name */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="full-name"
                                    type="text"
                                    autoComplete="name"
                                    value={form.fullName}
                                    onChange={(e) => setField("fullName", e.target.value)}
                                    placeholder="Rahul Sharma"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-[#2B2B30] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-[#2B2B30] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={(e) => setField("password", e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-2.5 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-[#2B2B30] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Password strength rules */}
                            <AnimatePresence>
                                {form.password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="space-y-1 overflow-hidden"
                                    >
                                        {passwordRules.map((rule) => {
                                            const passed = rule.test(form.password)
                                            return (
                                                <div key={rule.label} className={`flex items-center gap-2 text-xs transition-colors duration-300 ${passed ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                                                    <motion.div
                                                        initial={false}
                                                        animate={{ scale: passed ? 1.2 : 1, opacity: passed ? 1 : 0.4 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </motion.div>
                                                    {rule.label}
                                                </div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="confirm-password"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setField("confirmPassword", e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 dark:bg-[#1A1A1F] border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${form.confirmPassword && form.confirmPassword !== form.password
                                        ? "border-red-400 dark:border-red-600 focus:ring-red-500/40"
                                        : form.confirmPassword && form.confirmPassword === form.password
                                            ? "border-green-400 dark:border-green-600 focus:ring-green-500/40"
                                            : "border-gray-200 dark:border-[#2B2B30] focus:ring-blue-500/60 focus:border-blue-500"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {form.confirmPassword && form.confirmPassword !== form.password && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-xs text-red-500 dark:text-red-400"
                                    >
                                        Passwords do not match
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Terms */}
                        <motion.p variants={itemVariants} className="text-xs text-gray-500 dark:text-gray-400">
                            By creating an account you agree to our{" "}
                            <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
                        </motion.p>

                        {/* Submit */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Sign in link */}
                <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Sign in →
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    )
}
