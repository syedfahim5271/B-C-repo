import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'bc-admin'

async function verify(token: string, secret: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(COOKIE))
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return token === expected
  } catch { return false }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const token  = request.cookies.get(COOKIE)?.value
  const secret = process.env.ADMIN_SECRET ?? ''

  if (!token || !(await verify(token, secret))) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }
