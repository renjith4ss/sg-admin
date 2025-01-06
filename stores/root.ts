import { defineStore } from 'pinia'

interface RootState {
  isInitialized: boolean
  isLoading: boolean
  currentOrganizationId: string | null
  globalError: string | null
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  lastSync: Record<string, number>
  searchHistory: string[]
  recentlyViewed: {
    displays: string[]
    organizations: string[]
  }
}

const MAX_SEARCH_HISTORY = 10
const MAX_RECENTLY_VIEWED = 5

export const useRootStore = defineStore('root', {
  state: (): RootState => ({
    isInitialized: false,
    isLoading: false,
    currentOrganizationId: null,
    globalError: null,
    theme: 'light',
    sidebarCollapsed: false,
    lastSync: {},
    searchHistory: [],
    recentlyViewed: {
      displays: [],
      organizations: []
    }
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    hasError: (state) => !!state.globalError,
    hasOrganization: (state) => !!state.currentOrganizationId,
    needsSync: (state) => (collection: string, maxAge: number = 5 * 60 * 1000) => {
      const lastSync = state.lastSync[collection]
      if (!lastSync) return true
      return Date.now() - lastSync > maxAge
    }
  },

  actions: {
    initialize() {
      // Load persisted state
      const theme = localStorage.getItem('theme') as 'light' | 'dark'
      if (theme) {
        this.theme = theme
      }

      const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
      this.sidebarCollapsed = sidebarCollapsed

      const orgId = localStorage.getItem('currentOrganizationId')
      if (orgId) {
        this.currentOrganizationId = orgId
      }

      // Load search history
      const searchHistory = localStorage.getItem('searchHistory')
      if (searchHistory) {
        this.searchHistory = JSON.parse(searchHistory)
      }

      // Load recently viewed
      const recentlyViewed = localStorage.getItem('recentlyViewed')
      if (recentlyViewed) {
        this.recentlyViewed = JSON.parse(recentlyViewed)
      }

      this.isInitialized = true
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      localStorage.setItem('theme', theme)
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme === 'dark')
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
    },

    setCurrentOrganization(orgId: string | null) {
      this.currentOrganizationId = orgId
      if (orgId) {
        localStorage.setItem('currentOrganizationId', orgId)
        this.addRecentlyViewed('organizations', orgId)
      } else {
        localStorage.removeItem('currentOrganizationId')
      }
    },

    setError(error: string | null) {
      this.globalError = error
    },

    startLoading() {
      this.isLoading = true
    },

    stopLoading() {
      this.isLoading = false
    },

    updateLastSync(collection: string) {
      this.lastSync[collection] = Date.now()
    },

    addSearchTerm(term: string) {
      if (!term || this.searchHistory.includes(term)) return
      
      this.searchHistory.unshift(term)
      if (this.searchHistory.length > MAX_SEARCH_HISTORY) {
        this.searchHistory.pop()
      }
      
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
    },

    clearSearchHistory() {
      this.searchHistory = []
      localStorage.removeItem('searchHistory')
    },

    addRecentlyViewed(type: 'displays' | 'organizations', id: string) {
      const list = this.recentlyViewed[type]
      
      // Remove if exists (to move to front)
      const index = list.indexOf(id)
      if (index > -1) {
        list.splice(index, 1)
      }
      
      // Add to front
      list.unshift(id)
      
      // Maintain max size
      if (list.length > MAX_RECENTLY_VIEWED) {
        list.pop()
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed))
    },

    clearRecentlyViewed(type?: 'displays' | 'organizations') {
      if (type) {
        this.recentlyViewed[type] = []
      } else {
        this.recentlyViewed = {
          displays: [],
          organizations: []
        }
      }
      localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed))
    }
  }
}) 