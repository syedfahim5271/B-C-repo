'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthUi } from '@/store/authUiStore'
import { getActiveAreas } from '@/app/actions'
import LoginModal from './LoginModal'
import ProfileSetupModal from './ProfileSetupModal'
import type { DBArea } from '@/lib/supabase'

export default function AuthModals() {
  const { data: session, status } = useSession()
  const { openProfileSetup, profileSetupOpen } = useAuthUi()
  const [areas, setAreas] = useState<DBArea[]>([])
  const prompted = useRef(false)

  // First time a freshly-authenticated user has an incomplete profile, nudge
  // them to finish it. Only once per page load (they can Skip).
  useEffect(() => {
    if (status !== 'authenticated') return
    if (session?.user && session.user.profileComplete === false && !prompted.current) {
      prompted.current = true
      openProfileSetup()
    }
  }, [status, session, openProfileSetup])

  // Lazily load active areas the first time the setup modal is needed.
  useEffect(() => {
    if (profileSetupOpen && areas.length === 0) {
      getActiveAreas().then((a) => setAreas(a as DBArea[]))
    }
  }, [profileSetupOpen, areas.length])

  return (
    <>
      <LoginModal />
      <ProfileSetupModal areas={areas} />
    </>
  )
}
