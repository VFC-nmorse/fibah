import { AuthContext } from './AuthContext'
import { useContext } from 'react'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw Error('useAuth must be used within AuthProvider')
  return context
}