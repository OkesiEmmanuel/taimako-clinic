
import { NextRequest } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

// Note: Next.js App Router API routes are simplified here for the scaffold.
// In production you must verify Paystack webhook signature and secure this endpoint.
export async function POST(req: NextRequest) {
  const body = await req.json()
  // Example payload: { event: 'charge.success', data: { reference: '...' } }
  const event = body.event
  if (event === 'charge.success') {
    const reference = body.data.reference
    // call Paystack verify server-side (omitted) and mark payment as paid
    // For demo: insert into payments table
    await supabase.from('payments').upsert({
      id: reference,
      provider_ref: reference,
      amount: body.data.amount / 100,
      status: 'paid',
      paid_at: new Date().toISOString()
    })
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
