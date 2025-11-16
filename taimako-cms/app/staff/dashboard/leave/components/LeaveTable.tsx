'use client'

import { useMemo } from 'react'
import { StaffLeave } from '@/domain/entities/StaffLeave'

interface Props {
  leaves: StaffLeave[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export default function LeaveTable({ leaves, onApprove, onReject, onDelete, showActions = false }: Props) {
  const rows = useMemo(() => leaves || [], [leaves])

  if (!rows.length) return <p className="text-gray-500">No leave requests.</p>

  return (
    <div className="overflow-x-auto bg-white shadow rounded border">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Staff</th>
            <th className="p-3 text-left">Period</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Status</th>
            {showActions && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-800">{l.staff_name ?? l.staff_id}</td>
              <td className="p-3 text-sm text-gray-800">{l.start_date} → {l.end_date}</td>
              <td className="p-3 text-sm text-gray-800">{l.reason}</td>
              <td className="p-3 text-sm">
                <span className={
                  `px-2 py-1 rounded text-xs font-medium ${
                    l.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    l.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`
                }>{l.status}</span>
              </td>
              {showActions && (
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    {l.status === 'Pending' && onApprove && (
                      <button onClick={() => onApprove(l.id)} className="px-3 py-1 bg-green-100 text-green-800 rounded">Approve</button>
                    )}
                    {l.status === 'Pending' && onReject && (
                      <button onClick={() => onReject(l.id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Reject</button>
                    )}
                    <button onClick={() => onDelete?.(l.id)} className="px-3 py-1 bg-gray-100 text-gray-800 rounded">Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
