'use client'

import { StaffShift } from "@/domain/entities/StaffShifts"


interface Props {
  shifts: StaffShift[]
  onDelete?: (id: string) => void
  onRequestSwap?: (shiftId: string) => void
}

export default function ShiftTable({ shifts, onDelete, onRequestSwap }: Props) {
  if (!shifts.length) return <p className="text-gray-500">No shifts.</p>
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700"><tr>
          <th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Status</th><th className="p-3">Action</th>
        </tr></thead>
        <tbody>
          {shifts.map(s => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{s.date}</td>
              <td className="p-3">{s.shift_type}</td>
              <td className="p-3">{s.start_time}</td>
              <td className="p-3">{s.end_time}</td>
              <td className="p-3">{s.status}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={()=>onRequestSwap?.(s.id)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Request Swap</button>
                  <button onClick={()=>onDelete?.(s.id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
