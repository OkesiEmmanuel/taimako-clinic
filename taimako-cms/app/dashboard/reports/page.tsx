'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'
import OfflineStatus from '@/components/ui/OfflineStatus'

import { StaffReport } from '@/domain/entities/StaffReport'
import { StaffReportService } from '@/services/StaffReportService'
import ReportForm from './components/ReportForm'
import ReportTable from './components/ReportTable'

export default function StaffReportsPage() {
  const [reports, setReports] = useState<StaffReport[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const service = useMemo(() => StaffReportService.getInstance(), [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const { data: sessionData } = await supabase.auth.getUser()
      const user = sessionData?.user
      if (!user) return setReports([])

      // Check if admin
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (!profileError) {
        setIsAdmin(profile?.role === 'admin')
      }

      const data = isAdmin
        ? await service.listAll()
        : await service.listByStaff(user.id)

      // Ensure all reports conform to StaffReport
      const sanitized = (data || []).map(r => ({
        id: r.id || `tmp-${Date.now()}`,
        staff_id: r.staff_id,
        staff_name:  profile?.full_name || 'Unknown',
        title: r.title,
        content: r.content,
        handover_to: r.handover_to ?? undefined,
        acknowledged: r.acknowledged ?? false,
        created_at: r.created_at ?? new Date().toISOString(),
        updated_at: r.updated_at ?? new Date().toISOString(),
      }))

      setReports(sanitized)
    } catch (err) {
      console.error(err)
      toast.error('Failed loading reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [service, isAdmin])

  const refresh = async () => {
    await loadReports()
  }

  const handleCreated = (r: StaffReport) => {
    setReports(prev => [
      {
        ...r,
        staff_name: r.staff_name || 'Unknown',
        handover_to: r.handover_to ?? undefined,
        acknowledged: r.acknowledged ?? false,
        created_at: r.created_at ?? new Date().toISOString(),
        updated_at: r.updated_at ?? new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const handleAck = async (id?: string) => {
    if (!id) return
    try {
      const updated = await service.acknowledge(id)
      setReports(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                acknowledged: updated.acknowledged ?? true,
                staff_name: p.staff_name,
                handover_to: updated.handover_to ?? undefined,
                updated_at: updated.updated_at ?? new Date().toISOString(),
              }
            : p
        )
      )
      toast.success('Acknowledged')
    } catch {
      toast.error('Failed')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await service.remove(id)
      setReports(prev => prev.filter(p => p.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Daily Reports</h1>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="px-3 py-1 border rounded">
            Refresh
          </button>
          <OfflineStatus />
        </div>
      </div>

      <ReportForm onCreated={handleCreated} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReportTable
          reports={reports}
          showActions={isAdmin}
          onAck={handleAck}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
