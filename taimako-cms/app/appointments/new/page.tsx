
'use client'

import { useState } from 'react'

export default function NewAppointmentPage() {
  const [patientId, setPatientId] = useState('patient-1')
  const [staffId, setStaffId] = useState('staff-1')
  const [startAt, setStartAt] = useState('2025-11-10T09:00')
  const [endAt, setEndAt] = useState('2025-11-10T09:30')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function book(e:any) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          staffId,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          type: 'onsite',
          requiresPrepayment: false,
          amountDue: 0
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Error')
      setMessage('Appointment created: ' + data.id)
    } catch (err: any) {
      setMessage(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={book} className="p-6 bg-white rounded shadow max-w-xl m-6">
      <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
      <label className="block mb-2">Patient ID
        <input value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full border p-2 rounded mt-1" />
      </label>
      <label className="block mb-2">Staff ID
        <input value={staffId} onChange={e => setStaffId(e.target.value)} className="w-full border p-2 rounded mt-1" />
      </label>
      <label className="block mb-2">Start
        <input value={startAt} onChange={e => setStartAt(e.target.value)} type="datetime-local" className="w-full border p-2 rounded mt-1" />
      </label>
      <label className="block mb-4">End
        <input value={endAt} onChange={e => setEndAt(e.target.value)} type="datetime-local" className="w-full border p-2 rounded mt-1" />
      </label>
      <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Booking...' : 'Book'}</button>
      {message && <p className="mt-3">{message}</p>}
    </form>
  )
}
