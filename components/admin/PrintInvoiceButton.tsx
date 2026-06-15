'use client'

import { useState } from 'react'
import { Printer, Loader2 } from 'lucide-react'
import type { DBOrder } from '@/lib/supabase'
import { printOrderReceipt, isUserCancellation, isBluetoothPrintingSupported } from '@/lib/printer'

export default function PrintInvoiceButton({ order, areaLabel }: { order: DBOrder; areaLabel: string }) {
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState('')

  const handlePrint = async () => {
    setError('')
    if (!isBluetoothPrintingSupported()) {
      setError('Bluetooth printing needs Chrome on Android or desktop (not supported on iPhone/iPad).')
      return
    }
    setPrinting(true)
    try {
      await printOrderReceipt(order, areaLabel)
    } catch (err) {
      if (!isUserCancellation(err)) {
        setError(err instanceof Error ? err.message : 'Printing failed. Make sure the printer is on and paired.')
      }
    } finally {
      setPrinting(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={handlePrint}
        disabled={printing}
        className="w-full flex items-center justify-center gap-2 bg-white/10 text-brand-cream font-semibold py-2.5 px-4 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-60 text-sm"
      >
        {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
        {printing ? 'Connecting to printer…' : 'Print Invoice'}
      </button>
      {error && <p className="text-brand-red text-xs text-center">{error}</p>}
    </div>
  )
}
