import { fetchApi } from "../api"

export const authService = {
  async register(data: Record<string, any>) {
    return fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async login(data: Record<string, any>) {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async verifyEmail(data: { email: string; otp: string }) {
    return fetchApi("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async resendVerifyEmail(email: string) {
    return fetchApi("/auth/resend-verify-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  async logout() {
    try {
      await fetchApi("/auth/logout", {
        method: "POST",
        requireAuth: true,
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.clearTokens()
    }
  },

  async getCurrentUser() {
    return fetchApi("/auth/me", {
      requireAuth: true,
    })
  },

  setToken(tokenResponse: { access_token: string; refresh_token: string }) {
    if (typeof window !== "undefined") {
      // Use sessionStorage so tokens are wiped when the browser/tab is closed
      sessionStorage.setItem("deltaview_access_token", tokenResponse.access_token)
      sessionStorage.setItem("deltaview_refresh_token", tokenResponse.refresh_token)
      // Sync to cookies for Next.js middleware — no max-age so they become session cookies
      document.cookie = `deltaview_access_token=${tokenResponse.access_token}; path=/; SameSite=Lax`
      document.cookie = `deltaview_refresh_token=${tokenResponse.refresh_token}; path=/; SameSite=Lax`
    }
  },

  clearTokens() {
    if (typeof window !== "undefined") {
      // Clear sessionStorage
      sessionStorage.removeItem("deltaview_access_token")
      sessionStorage.removeItem("deltaview_refresh_token")
      // Also clear legacy localStorage keys if they existed from before
      localStorage.removeItem("deltaview_access_token")
      localStorage.removeItem("deltaview_refresh_token")
      // Expire cookies immediately
      document.cookie = "deltaview_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "deltaview_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  isAuthenticated() {
    if (typeof window !== "undefined") {
      return !!(sessionStorage.getItem("deltaview_access_token") || localStorage.getItem("deltaview_access_token"))
    }
    return false
  },

  async forgotPassword(email: string) {
    return fetchApi("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  async resetPassword(token: string, new_password: string) {
    return fetchApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password }),
    })
  },
}
