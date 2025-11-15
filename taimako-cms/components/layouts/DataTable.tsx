'use client'

import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'

interface Column {
  key: string
  label: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column[]
  rowsPerPage?: number
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export default function DataTable<T extends { id?: string }>({
  data,
  columns,
  rowsPerPage = 10,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  const sortedData = useMemo(() => {
    if (!sortColumn) return data
    return [...data].sort((a: any, b: any) => {
      const valA = a[sortColumn] ?? ''
      const valB = b[sortColumn] ?? ''
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortAsc])

  const paginated = useMemo(() => {
    const start = page * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handleSort = (col: string) => {
    if (sortColumn === col) setSortAsc(!sortAsc)
    else {
      setSortColumn(col)
      setSortAsc(true)
    }
  }

  const exportCSV = () => {
    const csv =
      columns.map((c) => c.label).join(',') +
      '\n' +
      data
        .map((row) =>
          columns.map((c) => `"${(row as any)[c.key] ?? ''}"`).join(',')
        )
        .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    toast.success('CSV exported!')
  }

  const printTable = () => {
    const html =
      '<table border="1" cellpadding="5" cellspacing="0">' +
      '<thead><tr>' +
      columns.map((c) => `<th>${c.label}</th>`).join('') +
      '</tr></thead>' +
      '<tbody>' +
      data
        .map(
          (row) =>
            '<tr>' +
            columns.map((c) => `<td>${(row as any)[c.key] ?? ''}</td>`).join('') +
            '</tr>'
        )
        .join('') +
      '</tbody></table>'

    const win = window.open('', '', 'width=900,height=700')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.print()
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <div className="flex justify-end gap-2 mb-2 flex-wrap">
        <button
          onClick={printTable}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Print
        </button>
        <button
          onClick={exportCSV}
          className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
        >
          Export CSV
        </button>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="cursor-pointer bg-gray-100 text-gray-700 font-semibold p-2 border"
              >
                {col.label}
                {sortColumn === col.key ? (sortAsc ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="bg-gray-100 text-gray-700 font-semibold p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="p-2 border text-gray-700">
                  {(row as any)[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="p-2 border flex gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
        <div>
          Page {page + 1} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
