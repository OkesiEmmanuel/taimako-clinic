'use client'

import { useEffect, useState } from 'react'
import ComplaintForm from './components/ComplaintForm'
import ComplaintTable from './components/ComplaintTable'
import { ComplaintService } from '@/services/ComplaintService'
import { Complaint } from '@/domain/entities/Complaint'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'
import OfflineStatus from '@/components/ui/OfflineStatus'

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const service = new ComplaintService()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const session = await supabase.auth.getUser()
        const user = session.data.user
        if (!user) {
          setComplaints([])
          return
        }

        // determine role
        const profile = await supabase.from('users').select('role').eq('id', user.id).single()
        if (!profile.error) setIsAdmin(profile.data?.role === 'admin')

        // load data (admin -> all, staff -> own)
        const data = isAdmin ? await service.listAll() : await service.listByStaff(user.id)
        setComplaints(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load complaints')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const session = await supabase.auth.getUser()
      const user = session.data.user
      if (!user) return
      const data = isAdmin ? await service.listAll() : await service.listByStaff(user.id)
      setComplaints(data)
    } catch (err) {
      toast.error('Failed to refresh complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleCreated = (c: Complaint) => {
    setComplaints((prev) => [c, ...prev])
  }

  const handleResolve = async (id?: string) => {
    if (!id) return
    try {
      const session = await supabase.auth.getUser()
      const user = session.data.user
      if (!user) throw new Error('Not authenticated')
      await service.resolve(id, user.id)
      setComplaints((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Resolved' } : p)))
      toast.success('Marked resolved')
    } catch (err) {
      console.error(err)
      toast.error('Failed to resolve')
    }
  }

  const handleReject = async (id?: string) => {
    if (!id) return
    try {
      const session = await supabase.auth.getUser()
      const user = session.data.user
      if (!user) throw new Error('Not authenticated')
      await service.reject(id, user.id)
      setComplaints((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p)))
      toast.success('Marked rejected')
    } catch (err) {
      console.error(err)
      toast.error('Failed to reject')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await service.remove(id)
      setComplaints((prev) => prev.filter((p) => p.id !== id))
      toast.success('Deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Staff Complaints</h1>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="px-3 py-1 border rounded">Refresh</button>
          <OfflineStatus />
        </div>
      </div>

      <ComplaintForm onCreated={handleCreated} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ComplaintTable
          complaints={complaints}
          showActions={isAdmin}
          onResolve={(id) => handleResolve(id)}
          onReject={(id) => handleReject(id)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </div>
  )
}
