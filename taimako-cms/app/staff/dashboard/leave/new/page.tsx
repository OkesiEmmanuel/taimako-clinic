'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import InputField from '@/app/auth/components/InputField'
import ConfirmDialog from '@/components/ui/ConfirmDialog'


export default function LeaveForm({ onSubmitSuccess }: { onSubmitSuccess: (data: any) => void }) {
  const [form, setForm] = useState({ staffName: '', startDate: '', endDate: '', reason: '' })
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch('/dashboard/staff/leave/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      onSubmitSuccess(data)
      setForm({ staffName: '', startDate: '', endDate: '', reason: '' })
    }
    setShowConfirm(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <InputField label="Staff Name" name="staffName" value={form.staffName} onChange={handleChange} />
        <InputField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <InputField label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
      </div>
      <textarea
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason for leave"
        className="mt-4 w-full border rounded-md p-3"
      />
      <div className="mt-6">
        {/* <Button label="Submit Request" onClick={() => setShowConfirm(true)} /> */}
      </div>
      {showConfirm && (
        <ConfirmDialog
                  title="Submit Leave Request"
                  message="Are you sure you want to submit this leave?"
                  onConfirm={handleSubmit}
                  onCancel={() => setShowConfirm(false)} open={false}        />
      )}
    </div>
  )
}
