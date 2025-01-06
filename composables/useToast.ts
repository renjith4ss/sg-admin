import type { NuxtApp } from '@nuxt/schema'

interface ToastOptions {
  title: string
  description: string
  duration?: number
  type?: 'info' | 'success' | 'warning' | 'error'
}

interface ToastInstance {
  info: (options: Omit<ToastOptions, 'type'>) => void
  success: (options: Omit<ToastOptions, 'type'>) => void
  warning: (options: Omit<ToastOptions, 'type'>) => void
  error: (options: Omit<ToastOptions, 'type'>) => void
}

declare module '#app' {
  interface NuxtApp {
    $toast: ToastInstance
  }
}

export const useToast = () => {
  const nuxtApp = useNuxtApp()
  
  const toast = (options: ToastOptions) => {
    const toastFn = nuxtApp.$toast[options.type || 'info']
    if (toastFn) {
      toastFn({
        title: options.title,
        description: options.description,
        duration: options.duration || 5000
      })
    }
  }

  return {
    show: toast,
    info: (options: Omit<ToastOptions, 'type'>) => toast({ ...options, type: 'info' }),
    success: (options: Omit<ToastOptions, 'type'>) => toast({ ...options, type: 'success' }),
    warning: (options: Omit<ToastOptions, 'type'>) => toast({ ...options, type: 'warning' }),
    error: (options: Omit<ToastOptions, 'type'>) => toast({ ...options, type: 'error' })
  }
} 