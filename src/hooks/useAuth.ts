import { useEffect, useState } from 'react'
import { blink } from '../lib/blink'
import { BlinkUser } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Login with the current URL as redirect destination
  // This ensures the user returns to the correct domain (Vercel, Blink, etc.)
  const login = () => {
    const redirectUrl = window.location.origin + window.location.pathname
    blink.auth.login(redirectUrl)
  }
  
  const logout = () => blink.auth.signOut()

  return { user, loading, login, logout, isAuthenticated: !!user }
}
