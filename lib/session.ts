import { getServerSession } from 'next-auth'
import { authOptions } from './authOptions'

/** Server-side session accessor for server components, actions, and route handlers. */
export function getSession() {
  return getServerSession(authOptions)
}
