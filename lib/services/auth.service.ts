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
      localStorage.setItem("deltaview_access_token", tokenResponse.access_token)
      localStorage.setItem("deltaview_refresh_token", tokenResponse.refresh_token)
      // Sync to cookies for Next.js middleware
      document.cookie = `deltaview_access_token=${tokenResponse.access_token}; path=/; max-age=86400; SameSite=Lax`
      document.cookie = `deltaview_refresh_token=${tokenResponse.refresh_token}; path=/; max-age=604800; SameSite=Lax`
    }
  },

  clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("deltaview_access_token")
      localStorage.removeItem("deltaview_refresh_token")
      // Clear cookies for Next.js middleware
      document.cookie = "deltaview_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "deltaview_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  isAuthenticated() {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("deltaview_access_token")
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
