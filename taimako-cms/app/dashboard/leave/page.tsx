'use client'

import { useEffect, useState } from 'react'
import LeaveForm from './components/LeaveForm'
import LeaveTable from './components/LeaveTable'
import { StaffLeaveService } from '@/services/StaffLeaveService'
import { StaffLeave } from '@/domain/entities/StaffLeave'
import { toast } from 'react-toastify'
import OfflineStatus from '@/components/ui/OfflineStatus'
import { supabase } from '@/lib/supabaseClient'

export default function StaffLeavesPage() {
  const [leaves, setLeaves] = useState<StaffLeave[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const service = new StaffLeaveService()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        // get current supabase session user
        const sessionRes = await supabase.auth.getUser()
        const user = sessionRes.data.user
        if (!user) {
          setLeaves([])
          return
        }

        // check if user is admin via users table role
        const profile = await supabase.from('users').select('role').eq('id', user.id).single()
        if (profile.error) {
          console.warn('Failed to fetch role, assuming staff')
        } else {
          setIsAdmin(profile.data?.role === 'admin')
        }

        // load leaves. admin -> all, staff -> own
        const data = isAdmin ? await service.listAll() : await service.listByStaff(user.id)
        setLeaves(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load leave requests')
      } finally {
        setLoading(false)
      }
    }

    init()
    // do not add isAdmin to deps intentionally here to avoid double calls
    // you can add a manual refresh button or router.refresh after actions
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const sessionRes = await supabase.auth.getUser()
      const user = sessionRes.data.user
      if (!user) return
      const data = isAdmin ? await service.listAll() : await service.listByStaff(user.id)
      setLeaves(data)
    } catch (err) {
      toast.error('Failed to refresh leaves')
    } finally {
      setLoading(false)
    }
  }

  const handleCreated = (l: StaffLeave) => {
    setLeaves((prev) => [l, ...prev])
  }

  const handleApprove = async (id?: string) => {
    if (!id) return
    try {
      const session = await supabase.auth.getUser()
      const user = session.data.user
      if (!user) throw new Error('Not authenticated')
      await service.approveLeave(id, user.id)
      setLeaves((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p)))
      toast.success('Leave approved')
    } catch (err) {
      console.error(err)
      toast.error('Failed to approve')
    }
  }

  const handleReject = async (id?: string) => {
    if (!id) return
    try {
      const session = await supabase.auth.getUser()
      const user = session.data.user
      if (!user) throw new Error('Not authenticated')
      await service.rejectLeave(id, user.id)
      setLeaves((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p)))
      toast.success('Leave rejected')
    } catch (err) {
      console.error(err)
      toast.error('Failed to reject')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await service.removeLeave(id)
      setLeaves((prev) => prev.filter((p) => p.id !== id))
      toast.success('Deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Staff Leave Management</h1>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="px-3 py-1 border rounded">Refresh</button>
          <OfflineStatus />
        </div>
      </div>

      {/* Leave form only for staff (admins might want to create on behalf of someone else) */}
      <LeaveForm onCreated={handleCreated} />

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LeaveTable
          leaves={leaves}
          showActions={isAdmin}
          onApprove={(id) => handleApprove(id)}
          onReject={(id) => handleReject(id)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </div>
  )
}
