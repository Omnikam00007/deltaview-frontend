export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface FetchOptions extends RequestInit {
    requireAuth?: boolean
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { requireAuth = false, headers, ...customOptions } = options

    const reqHeaders = new Headers(headers)
    reqHeaders.set("Content-Type", "application/json")

    if (requireAuth) {
        const token = typeof window !== "undefined" ? localStorage.getItem("deltaview_access_token") : null
        if (token) {
            reqHeaders.set("Authorization", `Bearer ${token}`)
        }
    }

    const config: RequestInit = {
        ...customOptions,
        headers: reqHeaders,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Attempt to parse JSON response
    let data
    try {
        data = await response.json()
    } catch (e) {
        data = null
    }

    if (!response.ok) {
        const errorMessage = data?.detail || data?.message || "An unexpected error occurred"
        throw new Error(errorMessage)
    }

    return data as T
}
