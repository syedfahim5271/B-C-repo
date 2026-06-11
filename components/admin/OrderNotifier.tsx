'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrdersCount } from '@/app/admin/actions'

const POLL_INTERVAL = 8000 // ms

/**
 * Polls the order count and plays a chime + shows a banner when a new order
 * arrives. Rendered once in the admin layout so it runs on every admin page.
 *
 * Browsers block audio until the user interacts with the page, so we auto-unlock
 * the AudioContext on the first click/keypress anywhere in the admin. A bell
 * button also lets the admin manually arm + test the sound.
 */
export default function OrderNotifier() {
  const router = useRouter()
  const lastCount = useRef<number | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const [ready, setReady] = useState(false)
  const [newOrder, setNewOrder] = useState(false)

  function ensureCtx(): AudioContext | null {
    if (!audioCtx.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return null
      audioCtx.current = new Ctx()
    }
    return audioCtx.current
  }

  function playChime() {
    const ctx = ensureCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    // Two-note "ding-dong" played twice for attention
    const notes = [
      { freq: 880,  start: 0.0,  dur: 0.18 },
      { freq: 1320, start: 0.16, dur: 0.32 },
      { freq: 880,  start: 0.58, dur: 0.18 },
      { freq: 1320, start: 0.74, dur: 0.36 },
    ]
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.4, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur)
    })
  }

  // Auto-unlock audio on the first user interaction anywhere in the admin.
  useEffect(() => {
    function unlock() {
      const ctx = ensureCtx()
      if (ctx) ctx.resume().then(() => setReady(true)).catch(() => {})
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  // Manual arm + test.
  function enableAndTest() {
    const ctx = ensureCtx()
    if (ctx) ctx.resume().then(() => { setReady(true); playChime() }).catch(() => {})
  }

  // Poll for new orders.
  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const count = await getOrdersCount()
        if (cancelled) return
        if (lastCount.current !== null && count > lastCount.current) {
          playChime()
          setNewOrder(true)
          setTimeout(() => setNewOrder(false), 6000)
          router.refresh()
        }
        lastCount.current = count
      } catch {
        // ignore transient errors
      }
    }
    poll()
    const id = setInterval(poll, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <>
      {newOrder && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold px-5 py-3 rounded-xl shadow-2xl animate-bounce">
          🔔 New order received!
        </div>
      )}
      <button
        onClick={enableAndTest}
        title={ready ? 'Sound is on — click to test' : 'Click to enable order sound'}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-colors ${
          ready
            ? 'bg-white/10 text-brand-cream/70 hover:bg-white/20'
            : 'bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90'
        }`}
      >
        {ready ? '🔔 Sound on' : '🔕 Enable order sound'}
      </button>
    </>
  )
}
