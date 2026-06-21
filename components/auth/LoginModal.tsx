'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { X } from 'lucide-react'
import { useAuthUi } from '@/store/authUiStore'

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

/* Minimal GSI typings (we only use a couple of methods). */
interface GsiId {
  initialize: (cfg: Record<string, unknown>) => void
  renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void
  prompt: () => void
  cancel: () => void
}
declare global {
  interface Window {
    google?: { accounts: { id: GsiId } }
    onGsiLoad?: () => void
  }
}

export default function LoginModal() {
  const { loginOpen, closeLogin, runPendingAction } = useAuthUi()
  const buttonRef = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  // Exchange the Google credential for a NextAuth session (no redirect).
  const handleCredential = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) return
      setSigningIn(true)
      setError('')
      const res = await signIn('google-onetap', { credential: response.credential, redirect: false })
      setSigningIn(false)
      if (res?.ok) {
        closeLogin()
        runPendingAction()
      } else {
        setError('Sign-in failed. Please try again.')
      }
    },
    [closeLogin, runPendingAction],
  )

  // Load the Google Identity Services script once.
  useEffect(() => {
    if (!loginOpen || !CLIENT_ID) return
    if (window.google?.accounts?.id) { setScriptReady(true); return }
    const existing = document.getElementById('gsi-script')
    if (existing) return
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.id = 'gsi-script'
    s.onload = () => setScriptReady(true)
    document.body.appendChild(s)
  }, [loginOpen])

  // Initialise + render the Google button and One Tap prompt when open.
  useEffect(() => {
    if (!loginOpen || !scriptReady || !CLIENT_ID || !window.google?.accounts?.id) return
    const id = window.google.accounts.id
    id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
      use_fedcm_for_prompt: true,
    })
    if (buttonRef.current) {
      buttonRef.current.innerHTML = ''
      id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280,
      })
    }
    id.prompt()
    return () => id.cancel()
  }, [loginOpen, scriptReady, handleCredential])

  if (!loginOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLogin} />
      <div className="relative w-full max-w-sm bg-brand-darker border border-white/10 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={closeLogin}
          aria-label="Close"
          className="absolute top-4 right-4 text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <p className="text-4xl mb-3">🍚</p>
          <h2 className="font-display font-bold text-xl text-brand-cream">Sign in to continue</h2>
          <p className="text-brand-cream/50 text-sm mt-1.5 mb-6">
            Log in with Google to check out faster and track your rewards.
          </p>
        </div>

        {!CLIENT_ID ? (
          <p className="text-brand-red text-sm text-center">
            Google login isn&apos;t configured yet. Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div ref={buttonRef} className="min-h-[44px]" />
            {signingIn && <p className="text-brand-cream/50 text-sm">Signing you in…</p>}
            {error && <p className="text-brand-red text-sm">{error}</p>}
          </div>
        )}

        <p className="text-brand-cream/30 text-xs text-center mt-6">
          No spam. We only use this to save your delivery details &amp; rewards.
        </p>
      </div>
    </div>
  )
}
