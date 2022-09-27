import React from 'react'
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
  
    const handleLogin = async (e: any) => {
      e.preventDefault()
  
      try {
        setLoading(true)
        const { error } = await supabase.auth.api.sendMagicLinkEmail(email)//sb.auth.signInWithOtp({ email })
        if (error) throw error
        // alert('Check your email for the login link!')
      } catch (error) {
        if (error) {
        const e = error as {message:string, error_description:string};
          alert(e?.error_description ?? e?.message ?? "error with no messsage")
        }
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div className="row flex-center flex">
        <div className="col-6 form-widget" aria-live="polite">
          <h1 className="header">Supabase + React</h1>
          <p className="description">
            Sign in via magic link with your email below
          </p>
          {loading ? (
            'Sending magic link...'
          ) : (
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="button block" aria-live="polite">
                Send magic link
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }