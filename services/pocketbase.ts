import PocketBase from 'pocketbase'

export class PocketBaseService {
  private pb: PocketBase
  private refreshInterval: NodeJS.Timeout | null = null

  constructor(url: string) {
    this.pb = new PocketBase(url)
  }

  setupRefreshInterval() {
    // Clear existing interval if any
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }

    // Refresh token every 10 minutes if authenticated
    this.refreshInterval = setInterval(async () => {
      if (this.isAuthenticated) {
        try {
          await this.refreshToken()
        } catch (error) {
          console.error('Token refresh failed:', error)
          this.logout()
        }
      }
    }, 10 * 60 * 1000)
  }

  async adminLogin(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const data = await response.json()
      this.pb.authStore.save(data.token, data.user)
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      this.pb.authStore.clear()
    }

  }

  private async refreshToken() {
    const response = await fetch('/api/auth/refresh', {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const { token } = await response.json()
    this.pb.authStore.save(token, this.pb.authStore.record)
  }

  get authStore() {
    return this.pb.authStore
  }

  get isAuthenticated() {
    return this.pb.authStore.isValid
  }

  get currentUser() {
    return this.pb.authStore.record
  }
}

// Create a composable to get PocketBase instance
export const usePocketBase = () => {
  const config = useRuntimeConfig()
  const instance = ref<PocketBaseService>()

  onNuxtReady(() => {
    if (!instance.value) {
      instance.value = new PocketBaseService(config.public.pocketbaseUrl)
    }
    
    instance.value.setupRefreshInterval()
  })

  return instance.value
} 