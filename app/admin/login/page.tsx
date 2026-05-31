import Image from 'next/image'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth'

async function doLogin(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  if (password !== process.env.ADMIN_PASSWORD) redirect('/admin/login?error=1')
  const token = await createSessionToken()
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
  redirect('/admin')
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Biryani & Chill" width={72} height={72} className="rounded-full mb-4" />
          <h1 className="font-display font-bold text-2xl text-brand-yellow">Admin Panel</h1>
          <p className="text-brand-cream/40 text-sm mt-1">Biryani &amp; Chill</p>
        </div>

        <form action={doLogin} className="space-y-4">
          <div>
            <label className="block text-brand-cream/60 text-sm font-medium mb-2">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter admin password"
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors"
            />
          </div>

          {searchParams.error && (
            <p className="text-brand-red text-sm">{searchParams.error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-yellow text-brand-dark font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors"
          >
            Sign In →
          </button>
        </form>
      </div>
    </div>
  )
}
