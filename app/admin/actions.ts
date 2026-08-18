'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth'

// ── Auth ────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Wrong password. Try again.' }
  }
  const token = await createSessionToken()
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

// ── Orders ──────────────────────────────────────────────────

export async function getOrdersCount(): Promise<number> {
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

export async function updateOrderStatus(id: string, status: string) {
  await supabase.from('orders').update({ status }).eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/admin/orders')
}

// ── Menu ────────────────────────────────────────────────────

const IMAGE_BUCKET = 'product-images'

// Upload a product image to Supabase Storage and return its public URL.
async function uploadProductImage(file: File): Promise<string> {
  // Ensure the bucket exists (no-op error if it already does).
  await supabase.storage.createBucket(IMAGE_BUCKET, { public: true }).catch(() => {})

  const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type || 'image/jpeg', upsert: false })
  if (error) throw new Error(`Image upload failed: ${error.message}`)

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

// Convert a Google Drive *share* link into a direct-view link. Drive's
// /file/d/<ID>/view URLs serve an HTML page, not the image itself.
function normalizeImageUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`
  const idMatch = trimmed.match(/[?&]id=([^&]+)/)
  if (trimmed.includes('drive.google.com') && idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
  }
  return trimmed
}

export async function upsertProduct(formData: FormData) {
  const id = (formData.get('id') as string) || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')

  // Resolve the image: uploaded file takes priority, then a pasted URL,
  // otherwise keep whatever was already there (or fall back to the default).
  const file = formData.get('image_file')
  let imageUrl = ''
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadProductImage(file)
  } else {
    imageUrl = normalizeImageUrl((formData.get('image_url') as string) || '')
  }
  if (!imageUrl) imageUrl = '/food-hero.png'

  await supabase.from('products').upsert({
    id,
    name:         formData.get('name'),
    description:  formData.get('description'),
    price:        Number(formData.get('price')),
    image_url:    imageUrl,
    badge:        formData.get('badge') || null,
    is_available: formData.get('is_available') === 'true',
    sort_order:   Number(formData.get('sort_order')) || 0,
  })
  revalidatePath('/admin/menu')
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/')
}

export async function toggleProductAvailability(id: string, is_available: boolean) {
  await supabase.from('products').update({ is_available }).eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/')
}

// ── Areas ───────────────────────────────────────────────────

export async function upsertArea(formData: FormData) {
  const id = (formData.get('id') as string) || (formData.get('label') as string).toLowerCase().replace(/\s+/g, '-')
  await supabase.from('areas').upsert({
    id,
    label:      formData.get('label'),
    emoji:      formData.get('emoji') || '📍',
    is_active:  true,
    sort_order: Number(formData.get('sort_order')) || 0,
  })
  revalidatePath('/admin/areas')
  revalidatePath('/')
}

export async function deleteArea(id: string) {
  await supabase.from('areas').delete().eq('id', id)
  revalidatePath('/admin/areas')
  revalidatePath('/')
}

export async function toggleArea(id: string, is_active: boolean) {
  await supabase.from('areas').update({ is_active }).eq('id', id)
  revalidatePath('/admin/areas')
  revalidatePath('/')
}

// ── Banner ──────────────────────────────────────────────────

export async function updateBanner(formData: FormData) {
  await supabase.from('banner').upsert({
    id:         1,
    badge_text: formData.get('badge_text'),
    title:      formData.get('title'),
    subtitle:   formData.get('subtitle'),
    promo_hint: formData.get('promo_hint'),
    is_active:  formData.get('is_active') === 'true',
  })
  revalidatePath('/admin/banner')
  revalidatePath('/')
}

// ── Promo Codes ─────────────────────────────────────────────

export async function createPromo(formData: FormData) {
  // Blank / 0 / junk in the "uses per customer" field all mean unlimited.
  const rawLimit = Number(formData.get('per_user_limit'))
  const perUserLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : null

  await supabase.from('promo_codes').insert({
    code:     (formData.get('code') as string).toUpperCase().trim(),
    type:     formData.get('type'),
    discount: Number(formData.get('discount')),
    label:    formData.get('label'),
    is_active: true,
    per_user_limit: perUserLimit,
  })
  revalidatePath('/admin/promos')
}

export async function togglePromo(id: string, is_active: boolean) {
  await supabase.from('promo_codes').update({ is_active }).eq('id', id)
  revalidatePath('/admin/promos')
}

export async function deletePromo(id: string) {
  await supabase.from('promo_codes').delete().eq('id', id)
  revalidatePath('/admin/promos')
}
