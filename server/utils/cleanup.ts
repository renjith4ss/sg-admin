import { sessionStore } from '../services/session'

export default defineNitroPlugin((nitroApp) => {
  startCleanup()
})

function startCleanup() {
  // Run cleanup every hour using Node's native setInterval
  if (process.server) {
    const interval = 60 * 60 * 1000 // 1 hour
    setInterval(async () => {
      await sessionStore.cleanup()
    }, interval)
  }
} 