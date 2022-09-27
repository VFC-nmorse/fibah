import { createContext, useEffect, useState } from 'react'
import React from 'react'
import { useAuthStateChange, useClient } from 'react-supabase'
import { Session, User } from '@supabase/supabase-js'

const initialState: {session: Session | null, user: User | null} = { session: null, user: null }
export const AuthContext = createContext(initialState)

export function AuthProvider({ children }: {children:any}) {
  const client = useClient()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const session = client.auth.session()
    setState({ session, user: session?.user ?? null })
  }, [])

  useAuthStateChange((event, session) => {
    console.log(`Supabase auth event: ${event}`, session)
    setState({ session, user: session?.user ?? null })
  })

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}