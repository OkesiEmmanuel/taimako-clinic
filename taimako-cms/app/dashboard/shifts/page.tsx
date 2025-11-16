'use client'

import { useEffect, useMemo, useState } from 'react'
import ShiftForm from './components/ShiftForm'
import ShiftTable from './components/ShiftTable'
import ShiftChart from './components/ShiftChart'
import SwapRequestForm from './components/SwapRequestForm'

import { ShiftService } from '@/services/ShiftService'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'

import OfflineStatus from '@/components/ui/OfflineStatus'
import { ShiftSwapRequest, StaffShift } from '@/domain/entities/StaffShifts'


export default function ShiftsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [shifts, setShifts] = useState<StaffShift[]>([])
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([])
  const [loading, setLoading] = useState(true)

  const service = useMemo(() => new ShiftService(), [])

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        const { data } = await supabase.auth.getUser()
        const user = data?.user

        if (!user) {
          setUserId(null)
          setShifts([])
          setSwapRequests([])
          return
        }

        setUserId(user.id)

        const staffShifts = await service.listByStaff(user.id)
        setShifts(staffShifts || [])

        const swaps = await service.listSwapRequests()
        setSwapRequests(swaps || [])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load shifts')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [service])

  const handleSaved = (shift: StaffShift) => {
    setShifts(prev => [shift, ...prev])
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      await service.remove(id)
      setShifts(prev => prev.filter(s => s.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleRequestCreated = (req: ShiftSwapRequest) => {
    setSwapRequests(prev => [req, ...prev])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Shift Management</h1>
        <OfflineStatus />
      </div>

      {/* Shift Form */}
      {userId && (
        <ShiftForm staffId={userId} onSaved={handleSaved} />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <ShiftChart shifts={shifts} />

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Swap Requests</h3>

          {swapRequests.length > 0 ? (
            swapRequests.map(r => (
              <div key={r.id} className="border p-2 mb-2 rounded">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{r.requester_name}</p>
                    <p className="text-sm text-gray-600">{r.reason}</p>
                  </div>
                  <div className="text-sm">{r.status}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No swap requests.</p>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ShiftTable
          shifts={shifts}
          onDelete={id => handleDelete(id)}
          onRequestSwap={shiftId => console.log('Swap request for shift: ', shiftId)}
        />
      )}

      {shifts[0] && (
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-medium mb-2">Quick swap request for first shift</h4>
          <SwapRequestForm
            shiftId={shifts[0].id}
            onCreated={handleRequestCreated}
          />
        </div>
      )}
    </div>
  )
}
