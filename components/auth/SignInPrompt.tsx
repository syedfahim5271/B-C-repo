'use client'

import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'
import { useAuthUi } from '@/store/authUiStore'

interface Props {
  title?: string
  subtitle?: string
  emoji?: string
  cta?: string
}

/**
 * Signed-out placeholder with a button that opens the Google login modal.
 * After a successful login it refreshes the route so the server component
 * re-renders in the authenticated state.
 */
export default function SignInPrompt({
  title = 'Please sign in',
  subtitle = 'Log in with Google to continue.',
  emoji = '🔒',
  cta = 'Sign in with Google',
}: Props) {
  const router = useRouter()
  const { openLogin } = useAuthUi()

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <span className="text-5xl mb-4">{emoji}</span>
      <h2 className="font-display font-bold text-xl text-brand-cream mb-2">{title}</h2>
      <p className="text-brand-cream/50 mb-6 max-w-xs">{subtitle}</p>
      <button
        onClick={() => openLogin(() => router.refresh())}
        data-testid="signin-prompt-button"
        className="flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold px-6 py-3 rounded-full hover:bg-brand-gold transition-colors"
      >
        <LogIn size={18} /> {cta}
      </button>
    </div>
  )
}
