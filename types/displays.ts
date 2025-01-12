export interface Display {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  location?: string
  created: string
  updated: string
} 