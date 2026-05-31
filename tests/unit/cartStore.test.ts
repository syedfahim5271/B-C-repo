import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/store/cartStore'

const item1 = { id: 'beef-tehari',   name: 'Beef Tehari',          price: 190, image: '/food-hero.png' }
const item2 = { id: 'chicken-biryani', name: 'Chicken Biryani',    price: 170, image: '/food-hero.png' }

beforeEach(() => {
  useCartStore.setState({ items: [], selectedArea: '', isDrawerOpen: false })
})

describe('addItem', () => {
  it('adds a new item with quantity 1', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1) })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('increments quantity when item already in cart', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1) })
    act(() => { result.current.addItem(item1) })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })
})

describe('removeItem', () => {
  it('removes item by id', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1) })
    act(() => { result.current.removeItem(item1.id) })
    expect(result.current.items).toHaveLength(0)
  })
})

describe('updateQuantity', () => {
  it('updates quantity', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1) })
    act(() => { result.current.updateQuantity(item1.id, 5) })
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('removes item when quantity ≤ 0', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1) })
    act(() => { result.current.updateQuantity(item1.id, 0) })
    expect(result.current.items).toHaveLength(0)
  })
})

describe('clearCart', () => {
  it('empties the cart', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1); result.current.addItem(item2) })
    act(() => { result.current.clearCart() })
    expect(result.current.items).toHaveLength(0)
  })
})

describe('totalItems', () => {
  it('sums all quantities', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1); result.current.addItem(item1) })
    act(() => { result.current.addItem(item2) })
    expect(result.current.totalItems()).toBe(3)
  })
})

describe('subtotal', () => {
  it('calculates price × quantity for all items', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.addItem(item1); result.current.addItem(item1) }) // 2 × 190 = 380
    act(() => { result.current.addItem(item2) })                                // 1 × 170 = 170
    expect(result.current.subtotal()).toBe(550)
  })
})

describe('area selector', () => {
  it('sets and clears the selected area', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => { result.current.setArea('gulshan') })
    expect(result.current.selectedArea).toBe('gulshan')
    act(() => { result.current.setArea('') })
    expect(result.current.selectedArea).toBe('')
  })
})
