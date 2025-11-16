'use client'

import { StaffReport } from "@/domain/entities/StaffReport"

interface Props {
  reports: StaffReport[]
  onAck?: (id: string) => void
  showActions?: boolean
  onDelete?: (id: string) => void
}

export default function ReportTable({ reports, onAck, showActions = false, onDelete }: Props) {
  if (!reports || !reports.length) return <p className="text-gray-500">No reports.</p>

  return (
    <div className="bg-white shadow rounded overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Content</th>
            <th className="p-3 text-left">Status</th>
            {showActions && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reports.map(r => {
            const reportId = r.id || `tmp-${Date.now()}` // fallback for offline reports
            const createdAt = r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'
            return (
              <tr key={reportId} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{createdAt}</td>
                <td className="p-3 text-sm">{r.title}</td>
                <td className="p-3 text-sm">{r.content}</td>
                <td className="p-3 text-sm">
                  {r.acknowledged
                    ? <span className="px-2 py-1 rounded bg-green-100 text-green-800">Acknowledged</span>
                    : <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
                  }
                </td>
                {showActions && (
                  <td className="p-3 text-sm">
                    <div className="flex gap-2">
                      {!r.acknowledged && onAck && (
                        <button
                          onClick={() => onAck(reportId)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded"
                        >
                          Acknowledge
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(reportId)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
