"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth.service"

interface Profile01Props {
  name: string
  role: string
}

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

export default function Profile01({
  name = "User",
  role = "",
}: Partial<Profile01Props>) {
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    // Hard redirect — forces a full server roundtrip so middleware blocks re-entry
    window.location.href = "/auth/login"
  }

  const initials = getInitials(name)

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center">
                <span className="text-lg font-bold text-white tracking-wide">{initials}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">{name}</h2>
              {role && <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{role}</p>}
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-3" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2.5
                       hover:bg-red-50 dark:hover:bg-red-500/10
                       rounded-lg transition-colors duration-200 group"
          >
            <LogOut className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-red-500 transition-colors">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
