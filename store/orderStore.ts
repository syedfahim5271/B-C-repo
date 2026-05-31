'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './cartStore'

export interface StoredOrder {
  orderNumber: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  delivery: {
    name: string
    phone: string
    area: string
    address: string
    note?: string
  }
  placedAt: string
}

interface OrderStore {
  orders: StoredOrder[]
  addOrder: (order: StoredOrder) => void
  clearOrders: () => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'bc-orders' }
  )
)
