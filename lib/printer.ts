/* eslint-disable @typescript-eslint/no-explicit-any */
// Bluetooth thermal-printer support via the Web Bluetooth API.
//
// Works in Chrome/Edge on Android and desktop over HTTPS. It is NOT supported
// in Safari / iOS (iPhone & iPad) — see `isBluetoothPrintingSupported`.
//
// Most low-cost 58mm BLE receipt printers expose a writable GATT characteristic
// that accepts raw ESC/POS bytes. We connect, find the first writable
// characteristic, and stream the receipt to it in small chunks.

import type { DBOrder } from '@/lib/supabase'

// Web Bluetooth is not in the TS DOM lib, so navigator.bluetooth is typed loosely.
declare global {
  interface Navigator {
    bluetooth?: any
  }
}

// Known service UUIDs used by common ESC/POS BLE printers. They must be listed
// as optionalServices so we're allowed to read them after connecting.
const PRINTER_SERVICE_UUIDS = [
  0x18f0, // very common ESC/POS service (char 0x2af1)
  0xff00,
  0xffe0, // HM-10 style UART bridge
  0xfff0,
  0xfee7,
  '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Microchip transparent UART
]

const RECEIPT_WIDTH = 32 // characters for a 58mm printer

export function isBluetoothPrintingSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Receipt building (ESC/POS) ──────────────────────────────

function row(left: string, right: string): string {
  const l = left.length + right.length > RECEIPT_WIDTH ? left.slice(0, RECEIPT_WIDTH - right.length - 1) : left
  const gap = Math.max(1, RECEIPT_WIDTH - l.length - right.length)
  return l + ' '.repeat(gap) + right
}

function buildReceipt(order: DBOrder, areaLabel: string): Uint8Array {
  const ESC = 0x1b
  const GS = 0x1d
  const LF = 0x0a
  const bytes: number[] = []
  const enc = new TextEncoder()

  const raw = (...b: number[]) => bytes.push(...b)
  const text = (s: string) => enc.encode(s).forEach((b) => bytes.push(b))
  const line = (s = '') => { text(s); raw(LF) }
  const rule = () => line('-'.repeat(RECEIPT_WIDTH))

  const dateStr = new Date(order.placed_at).toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  raw(ESC, 0x40)        // initialize
  raw(ESC, 0x61, 0x01)  // center align
  raw(ESC, 0x21, 0x30)  // double width + height
  line('Biryani & Chill')
  raw(ESC, 0x21, 0x00)  // normal text
  line('Hot biryani. Zero drama.')
  line('Hotline: 01810098964')
  raw(ESC, 0x61, 0x00)  // left align
  rule()

  line('Order: ' + order.order_number)
  line('Date : ' + dateStr)
  if (order.promo_code) line('Promo: ' + order.promo_code)
  rule()

  line('Customer:')
  line(' ' + order.delivery.name)
  line(' ' + order.delivery.phone)
  line(' ' + areaLabel)
  line(' ' + order.delivery.address)
  if (order.delivery.note) line(' Note: ' + order.delivery.note)
  rule()

  raw(ESC, 0x45, 0x01)  // bold on
  line('Items')
  raw(ESC, 0x45, 0x00)  // bold off
  order.items.forEach((it) => {
    line(row(`${it.quantity} x ${it.name}`, `Tk ${it.price * it.quantity}`))
  })
  rule()

  line(row('Subtotal', `Tk ${order.subtotal}`))
  line(row('Delivery', `Tk ${order.delivery_charge}`))
  if (order.discount > 0) line(row('Discount', `-Tk ${order.discount}`))
  raw(ESC, 0x21, 0x08)  // emphasized
  line(row('TOTAL', `Tk ${order.total}`))
  raw(ESC, 0x21, 0x00)
  rule()

  raw(ESC, 0x61, 0x01)  // center
  line('Thank you for your order!')
  line('See you again soon.')
  raw(LF, LF, LF, LF)   // feed
  raw(GS, 0x56, 0x00)   // full cut (ignored if unsupported)

  return Uint8Array.from(bytes)
}

// ── Bluetooth connect + write ───────────────────────────────

async function findWritableCharacteristic(): Promise<any> {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: PRINTER_SERVICE_UUIDS,
  })
  const server = await device.gatt.connect()
  const services = await server.getPrimaryServices()
  for (const service of services) {
    const chars = await service.getCharacteristics()
    for (const c of chars) {
      if (c.properties.write || c.properties.writeWithoutResponse) return c
    }
  }
  try { device.gatt.disconnect() } catch { /* noop */ }
  throw new Error('No printable characteristic found on this device.')
}

async function writeInChunks(characteristic: any, data: Uint8Array) {
  const CHUNK = 20 // safe for the default BLE MTU
  const preferNoResponse = characteristic.properties.writeWithoutResponse
  for (let i = 0; i < data.length; i += CHUNK) {
    const slice = data.slice(i, i + CHUNK)
    if (preferNoResponse && characteristic.writeValueWithoutResponse) {
      await characteristic.writeValueWithoutResponse(slice)
    } else {
      await characteristic.writeValue(slice)
    }
    await sleep(15) // let the printer buffer drain
  }
}

/**
 * Opens the OS Bluetooth chooser, connects to the selected thermal printer,
 * and prints the order receipt. Resolves when bytes are sent; rejects on
 * failure. A user cancelling the chooser throws an Abort/NotFound error —
 * callers should treat that as a silent cancel.
 */
export async function printOrderReceipt(order: DBOrder, areaLabel: string): Promise<void> {
  if (!isBluetoothPrintingSupported()) {
    throw new Error('Bluetooth printing needs Chrome on Android (or desktop Chrome/Edge) over HTTPS. It is not supported on iPhone/iPad.')
  }
  const characteristic = await findWritableCharacteristic()
  const receipt = buildReceipt(order, areaLabel)
  await writeInChunks(characteristic, receipt)
}

export function isUserCancellation(err: unknown): boolean {
  const name = (err as { name?: string })?.name
  return name === 'NotFoundError' || name === 'AbortError'
}
