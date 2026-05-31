'use client'

import { useCartStore } from '@/store/cartStore'
import { AREAS } from '@/data/products'

export default function AreaSelector() {
  const { selectedArea, setArea } = useCartStore()

  const handleSelect = (id: string) => {
    setArea(selectedArea === id ? '' : id)
  }

  return (
    <section aria-label="Select delivery area" className="px-4 py-4">
      <p className="text-xs text-brand-cream/50 font-medium uppercase tracking-widest mb-3">
        Deliver to
      </p>
      <div
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
        data-testid="area-selector"
      >
        {AREAS.map((area) => {
          const isSelected = selectedArea === area.id
          return (
            <button
              key={area.id}
              onClick={() => handleSelect(area.id)}
              data-testid={`area-chip-${area.id}`}
              aria-pressed={isSelected}
              className={`
                min-tap flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                text-sm font-semibold border transition-all duration-200
                ${
                  isSelected
                    ? 'bg-brand-yellow text-brand-dark border-brand-yellow shadow-lg shadow-brand-yellow/20'
                    : 'bg-white/5 text-brand-cream/80 border-white/10 hover:border-brand-yellow/50 hover:text-brand-cream'
                }
              `}
            >
              <span>{area.emoji}</span>
              <span>{area.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
