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

export async function upsertProduct(formData: FormData) {
  const id = (formData.get('id') as string) || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')
  await supabase.from('products').upsert({
    id,
    name:         formData.get('name'),
    description:  formData.get('description'),
    price:        Number(formData.get('price')),
    image_url:    formData.get('image_url') || '/food-hero.png',
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
  await supabase.from('promo_codes').insert({
    code:     (formData.get('code') as string).toUpperCase().trim(),
    type:     formData.get('type'),
    discount: Number(formData.get('discount')),
    label:    formData.get('label'),
    is_active: true,
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
