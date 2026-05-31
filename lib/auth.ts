const COOKIE = 'bc-admin'

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET!
  return hmac(secret, COOKIE)
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const expected = await createSessionToken()
    return token === expected
  } catch {
    return false
  }
}

export { COOKIE as SESSION_COOKIE }
