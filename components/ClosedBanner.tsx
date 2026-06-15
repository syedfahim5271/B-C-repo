'use client'

import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'

const OPEN_HOUR = 11  // 11:00 AM Dhaka
const CLOSE_HOUR = 23 // 11:00 PM Dhaka
const DHAKA_OFFSET = 6 // Bangladesh is a fixed UTC+6 (no daylight saving)

// Current hour in Dhaka, derived from UTC so it's correct for every visitor
// regardless of their own timezone.
function dhakaHour(date: Date): number {
  return (date.getUTCHours() + DHAKA_OFFSET) % 24
}

function isClosed(date: Date): boolean {
  const h = dhakaHour(date)
  return h < OPEN_HOUR || h >= CLOSE_HOUR
}

/**
 * Full-width banner shown above the navbar only when the kitchen is closed
 * (before 11 AM or after 11 PM Dhaka time — same for everyone, anywhere).
 *
 * Re-evaluates at the next top-of-hour boundary so it appears/disappears on
 * its own — e.g. it vanishes the moment 11 AM Dhaka hits, no page refresh
 * needed. Dhaka's whole-hour offset means its boundaries align with UTC ones.
 */
export default function ClosedBanner() {
  const [mounted, setMounted] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setMounted(true)
    let timer: ReturnType<typeof setTimeout>

    const evaluate = () => {
      const now = new Date()
      setClosed(isClosed(now))

      // Schedule the next check at the upcoming top of the hour (covers both
      // the 11 AM open and the 11 PM close transitions). Using UTC minutes
      // keeps this aligned with Dhaka's whole-hour boundaries.
      const nextHour = new Date(now)
      nextHour.setUTCMinutes(60, 0, 0)
      timer = setTimeout(evaluate, nextHour.getTime() - now.getTime())
    }

    evaluate()
    return () => clearTimeout(timer)
  }, [])

  // Avoid SSR/hydration mismatch — only render after the client knows the time.
  if (!mounted || !closed) return null

  return (
    <div
      style={{ backgroundColor: '#FCEBEB', color: '#791F1F' }}
      className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-center text-sm font-medium leading-snug"
      role="status"
    >
      <Moon size={18} className="flex-shrink-0" />
      <span>
        Our chefs are asleep! We wake up at 11&nbsp;AM — browse the menu and come back hungry.
      </span>
    </div>
  )
}
