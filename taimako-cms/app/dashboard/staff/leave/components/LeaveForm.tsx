'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { StaffLeave } from '@/domain/entities/StaffLeave'

import { useRouter } from 'next/navigation'
import { StaffLeaveService } from '@/services/StaffLeaveService'

export default function LeaveForm({ onCreated }: { onCreated?: (leave: StaffLeave) => void }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const service = new StaffLeaveService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // get current session user
      const userRes = await (await import('@/lib/supabaseClient')).supabase.auth.getUser()
      const user = userRes.data.user
      if (!user) {
        toast.error('You must be logged in to apply for leave.')
        return
      }

      const payload = {
        staff_id: user.id,
        staff_name: user.user_metadata?.name || user.email || 'Unknown',
        start_date: startDate,
        end_date: endDate,
        reason,
      }
      const created = await service.applyLeave(payload)
      toast.success('Leave applied')
      setStartDate('')
      setEndDate('')
      setReason('')
      onCreated?.(created)
      // optional: refresh page or router refresh if using next/navigation
      try { router.refresh() } catch {}
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to apply leave')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Start Date</label>
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">End Date</label>
          <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Reason</label>
        <textarea required value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="flex gap-2">
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Applying...' : 'Apply Leave'}
        </button>
      </div>
    </form>
  )
}
