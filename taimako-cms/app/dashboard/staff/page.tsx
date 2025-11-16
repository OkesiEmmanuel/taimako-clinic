'use client'

import { useEffect, useState } from 'react'
import { StaffService, Staff } from '@/services/StaffService'
import StaffForm from './components/StaffForm'

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [selected, setSelected] = useState<Staff | undefined>()

  const service = new StaffService((list) => setStaffList(list))

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const init = async () => {
      service.loadStaff()

      // subscribeRealtime returns a promise → wait for it
      const sub = await service.subscribeRealtime()
      unsubscribe = sub
    }

    init()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleSubmit = async (staff: Staff) => {
    if (selected) {
      await service.updateStaff(staff)
      setSelected(undefined)
    } else {
      await service.saveStaff(staff, 'defaultPassword123')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <StaffForm selected={selected} onSubmit={handleSubmit} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Staff List</h3>

        <div className="space-y-2">
          {staffList.map((s) => (
            <div
              key={s.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.role}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(s)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => service.deleteStaff(s.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
