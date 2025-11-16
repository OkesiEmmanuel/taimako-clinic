'use client'
import { useState } from 'react'
import { ShiftService } from '@/services/ShiftService'

import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { StaffShift } from '@/domain/entities/StaffShifts'

export default function ShiftForm({ staffId, onSaved }: { staffId?: string, onSaved?: (s: StaffShift) => void }) {
  const [date, setDate] = useState('')
  const [shiftType, setShiftType] = useState<'morning'|'afternoon'|'night'>('morning')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [saving, setSaving] = useState(false)
  const service = new ShiftService()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { staff_id: staffId, date, shift_type: shiftType, start_time: startTime, end_time: endTime }
      const saved = await service.assign(payload)
      toast.success('Shift assigned')
      onSaved?.(saved)
      setDate(''); setStartTime(''); setEndTime('')
      try { router.refresh() } catch {}
    } catch(err:any){ console.error(err); toast.error(err?.message || 'Failed') } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <input required type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded px-2 py-1" />
        <select value={shiftType} onChange={(e)=>setShiftType(e.target.value as any)} className="border rounded px-2 py-1">
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="night">Night</option>
        </select>
        <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} className="border rounded px-2 py-1" />
        <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} className="border rounded px-2 py-1" />
      </div>
      <div><button disabled={saving} className="bg-blue-600 text-white px-3 py-1 rounded">{saving ? 'Saving...' : 'Save Shift'}</button></div>
    </form>
  )
}
