'use client'

import { useState } from 'react'
import { StaffReport } from '@/domain/entities/StaffReport'
import { StaffReportService } from '@/services/StaffReportService'
import { toast } from 'react-toastify'
import { enqueueOp } from '@/lib/offlineSync'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  onCreated?: (report: StaffReport) => void
}

export default function ReportForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [handoverTo, setHandoverTo] = useState('')
  const [saving, setSaving] = useState(false)

  const service = StaffReportService.getInstance() // singleton

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!title || !content) return toast.error('Title & content required')
  setSaving(true)

  try {
    const { data: sessionData } = await supabase.auth.getUser()
    const user = sessionData?.user
    if (!user) throw new Error('Not logged in')

    const payload = {
      staff_id: user.id,
      title: title.trim(),
      content: content.trim(),
      handover_to: handoverTo || undefined, // ensure it's undefined, not null
    }

    const isOffline = !navigator.onLine || !supabase
    let saved: StaffReport
    if (isOffline) {
      // locally, we can add extra fields for display
      saved = {
        id: `tmp-${Date.now()}`,
        staff_id: user.id,
        title: title.trim(),
        content: content.trim(),
        handover_to: handoverTo || undefined,
        acknowledged: false,
        created_at: new Date().toISOString(),
      }
      enqueueOp({ op: 'insert', record: saved })
      toast.info('Saved locally (offline)')
    } else {
      saved = await service.create(payload) as StaffReport
      toast.success('Report submitted')
    }

    onCreated?.(saved)
    setTitle('')
    setContent('')
    setHandoverTo('')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.message || 'Failed to submit')
  } finally {
    setSaving(false)
  }
}


  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Report title"
        className="border rounded px-2 py-1 w-full"
        required
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Report content"
        className="border rounded px-2 py-1 w-full"
        required
      />
      <input
        type="text"
        value={handoverTo}
        onChange={e => setHandoverTo(e.target.value)}
        placeholder="Handover to (optional)"
        className="border rounded px-2 py-1 w-full"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {saving ? 'Saving...' : 'Submit Report'}
      </button>
    </form>
  )
}
