'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { DBProduct } from '@/lib/supabase'
import { upsertProduct, deleteProduct, toggleProductAvailability } from '@/app/admin/actions'

function ProductForm({
  product,
  onDone,
}: {
  product?: DBProduct
  onDone: () => void
}) {
  const [saving, setSaving] = useState(false)
  const isEdit = !!product

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    try {
      await upsertProduct(formData)
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form action={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      {isEdit && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Dish Name *</label>
        <input name="name" defaultValue={product?.name} placeholder="e.g. Mutton Biryani" required className="input-field" />
      </div>
      <div>
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Price (৳) *</label>
        <input name="price" type="number" defaultValue={product?.price} placeholder="e.g. 220" required className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Description *</label>
        <input name="description" defaultValue={product?.description} placeholder="e.g. Tender mutton with fragrant basmati rice" required className="input-field" />
      </div>

      {/* Image upload */}
      <div className="sm:col-span-2">
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Upload Image</label>
        <div className="flex items-center gap-3">
          {product?.image_url && (
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="56px" />
            </div>
          )}
          <input
            name="image_file"
            type="file"
            accept="image/*"
            className="flex-1 text-sm text-brand-cream/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-yellow file:text-brand-dark file:font-semibold file:cursor-pointer"
          />
        </div>
        <p className="text-brand-cream/30 text-xs mt-1.5">Choose a photo from your device. (Recommended over links.)</p>
      </div>

      {/* Optional URL fallback */}
      <div>
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">…or Image URL</label>
        <input name="image_url" defaultValue={product?.image_url} placeholder="https://… (leave blank for default)" className="input-field" />
      </div>
      <div>
        <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Badge (optional)</label>
        <input name="badge" defaultValue={product?.badge ?? ''} placeholder="e.g. 🔥 Popular" className="input-field" />
      </div>

      <input type="hidden" name="is_available" value={isEdit ? String(product.is_available) : 'true'} />
      <input type="hidden" name="sort_order" value={product?.sort_order ?? 0} />

      <div className="sm:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add to Menu'}
        </button>
        {isEdit && (
          <button type="button" onClick={onDone} className="px-5 py-3 rounded-xl bg-white/10 text-brand-cream font-semibold hover:bg-white/20 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default function MenuManager({ products }: { products: DBProduct[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <>
      {/* Existing items */}
      <div className="space-y-3">
        {products.map(p =>
          editingId === p.id ? (
            <div key={p.id} className="rounded-2xl p-4 border border-brand-yellow/40 bg-white/5">
              <p className="font-display font-bold text-brand-cream mb-4">Edit “{p.name}”</p>
              <ProductForm product={p} onDone={() => setEditingId(null)} />
            </div>
          ) : (
            <div
              key={p.id}
              className={`rounded-2xl p-4 border flex items-center gap-4 transition-all ${
                p.is_available ? 'bg-white/5 border-white/8' : 'bg-white/2 border-white/5 opacity-60'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="56px" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-brand-cream">{p.name}</p>
                  {p.badge && <span className="text-xs bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full">{p.badge}</span>}
                  {!p.is_available && <span className="text-xs bg-white/10 text-brand-cream/40 px-2 py-0.5 rounded-full">Sold Out</span>}
                </div>
                <p className="text-brand-cream/50 text-sm mt-0.5 truncate">{p.description}</p>
                <p className="text-brand-yellow font-bold mt-1">৳{p.price}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Toggle availability */}
                <form action={toggleProductAvailability.bind(null, p.id, !p.is_available)}>
                  <button type="submit" title={p.is_available ? 'Mark as sold out' : 'Mark as available'} className="group flex items-center gap-2">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${p.is_available ? 'bg-green-500' : 'bg-white/20'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className={`text-xs font-medium ${p.is_available ? 'text-green-400' : 'text-brand-cream/40'}`}>
                      {p.is_available ? 'Available' : 'Sold Out'}
                    </span>
                  </button>
                </form>

                {/* Edit */}
                <button
                  onClick={() => setEditingId(p.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/60 hover:bg-brand-yellow/20 hover:text-brand-yellow transition-colors font-medium"
                >
                  Edit
                </button>

                {/* Delete */}
                <form action={deleteProduct.bind(null, p.id)}>
                  <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/30 hover:bg-brand-red/20 hover:text-brand-red transition-colors font-medium">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add new item form */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-4">Add New Item</h2>
        <ProductForm onDone={() => {}} />
      </div>

      <style>{`.input-field{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:.75rem;padding:.75rem 1rem;color:#FFF8E7;width:100%;outline:none;font-size:.875rem}.input-field::placeholder{color:rgba(255,248,231,0.3)}.input-field:focus{border-color:rgba(255,184,0,0.6)}`}</style>
    </>
  )
}
