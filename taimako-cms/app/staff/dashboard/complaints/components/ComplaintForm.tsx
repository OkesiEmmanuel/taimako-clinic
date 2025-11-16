'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { Complaint } from '@/domain/entities/Complaint'
import { ComplaintService } from '@/services/ComplaintService'
import { useRouter } from 'next/navigation'

export default function ComplaintForm({ onCreated }: { onCreated?: (c: Complaint) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const service = new ComplaintService()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userRes = await (await import('@/lib/supabaseClient')).supabase.auth.getUser()
      const user = userRes.data.user
      if (!user) {
        toast.error('You must be logged in')
        return
      }

      const payload = {
        staff_id: user.id,
        staff_name: user.user_metadata?.name || user.email || 'Unknown',
        title,
        description,
      }
      const created = await service.create(payload)
      toast.success('Complaint submitted')
      setTitle('')
      setDescription('')
      onCreated?.(created)
      try { router.refresh() } catch {}
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <div>
        <label className="text-sm text-gray-600">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  )
}
