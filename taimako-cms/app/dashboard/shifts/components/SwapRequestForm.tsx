'use client'
import { useState } from 'react'
import { ShiftService } from '@/services/ShiftService'
import { toast } from 'react-toastify'

export default function SwapRequestForm({ shiftId, onCreated }: { shiftId: string, onCreated?: (r:any)=>void }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const service = new ShiftService()

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const userRes = await supabase.auth.getUser()
      const user = userRes.data.user
      if (!user) { toast.error('Login required'); return }
      const payload = { shift_id: shiftId, requester_id: user.id, requester_name: user.user_metadata?.name || user.email, reason }
      const created = await service.requestSwap(payload)
      toast.success('Swap request created')
      onCreated?.(created)
      setReason('')
    } catch (err:any) { console.error(err); toast.error(err?.message || 'Failed') } finally { setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Reason for swap" className="w-full border rounded p-2" />
      <div><button disabled={submitting} className="px-3 py-1 bg-blue-600 text-white rounded">{submitting ? 'Sending...' : 'Request Swap'}</button></div>
    </form>
  )
}
