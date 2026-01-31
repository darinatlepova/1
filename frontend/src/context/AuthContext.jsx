import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'task_tracker_token'
const USER_KEY = 'task_tracker_user'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const setToken = useCallback((newToken, newUser) => {
    setTokenState(newToken)
    setUser(newUser ?? null)
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
      if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }, [])

  const login = useCallback((newToken, newUser) => {
    setToken(newToken, newUser)
  }, [setToken])

  const logout = useCallback(() => {
    setToken(null)
  }, [setToken])

  const isAuthenticated = !!user


  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    setToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
