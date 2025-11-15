'use client'

import { Complaint } from '@/domain/entities/Complaint'
import { useMemo } from 'react'


interface Props {
  complaints: Complaint[]
  showActions?: boolean
  onResolve?: (id: string) => void
  onReject?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ComplaintTable({ complaints, showActions = false, onResolve, onReject, onDelete }: Props) {
  const rows = useMemo(() => complaints || [], [complaints])

  if (!rows.length) return <p className="text-gray-500">No complaints.</p>

  return (
    <div className="overflow-x-auto bg-white shadow rounded border">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Staff</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            {showActions && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-800">{c.staff_name ?? c.staff_id}</td>
              <td className="p-3 text-sm text-gray-800">{c.title}</td>
              <td className="p-3 text-sm text-gray-800">{c.description}</td>
              <td className="p-3 text-sm">
                <span className={
                  `px-2 py-1 rounded text-xs font-medium ${
                    c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    c.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`
                }>{c.status}</span>
              </td>
              {showActions && (
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    {c.status === 'Open' && onResolve && (
                      <button onClick={() => onResolve(c.id)} className="px-3 py-1 bg-green-100 text-green-800 rounded">Resolve</button>
                    )}
                    {c.status === 'Open' && onReject && (
                      <button onClick={() => onReject(c.id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Reject</button>
                    )}
                    <button onClick={() => onDelete?.(c.id)} className="px-3 py-1 bg-gray-100 text-gray-800 rounded">Delete</button>
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
