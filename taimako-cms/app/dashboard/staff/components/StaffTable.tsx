'use client'

import { Staff, StaffService } from '@/services/StaffService'
import { useMemo, useState } from 'react'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

interface StaffTableProps {
  staff: Staff[]
  service: StaffService
  onEdit: (staff: Staff) => void
  defaultRowsPerPage?: number
}

export default function StaffTable({
  staff,
  service,
  onEdit,
  defaultRowsPerPage = 10,
}: StaffTableProps) {
  const [sortBy, setSortBy] = useState<keyof Staff | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterGender, setFilterGender] = useState<'All' | 'Male' | 'Female' | 'Other'>('All')
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [jumpPage, setJumpPage] = useState('')

  const filtered = useMemo(() => {
    return staff
      .filter((p) => {
        const matchGender = filterGender === 'All' || p.gender === filterGender
        const q = search.toLowerCase().trim()
        return (
          matchGender &&
          (!q || p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (!sortBy) return 0
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return 0
      })
  }, [staff, sortBy, sortDir, search, filterGender])

  const totalPages = Math.ceil(filtered.length / rowsPerPage)
  const pageData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSort = (column: keyof Staff) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
  }

  const renderSortIcon = (column: keyof Staff) => {
    if (!sortBy || sortBy !== column) return <FaSort className="inline-block ml-1 text-gray-400" />
    return sortDir === 'asc' ? (
      <FaSortUp className="inline-block ml-1 text-gray-600" />
    ) : (
      <FaSortDown className="inline-block ml-1 text-gray-600" />
    )
  }

  if (!staff.length)
    return (
      <div className="p-4 bg-white rounded shadow border">
        <p className="text-gray-500">No patients found.</p>
      </div>
    )

  return (
    <div className="overflow-x-auto bg-gray-50 rounded shadow border">
      {/* Search & Filter */}
      <div className="flex flex-wrap gap-2 p-4 items-center">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="border border-gray-300 px-3 py-1 rounded flex-1 min-w-[150px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value as any)}
          className="border border-gray-300 px-3 py-1 rounded"
        >
          <option value="All">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="border border-gray-300 px-3 py-1 rounded"
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} rows
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Go to page"
          className="border border-gray-300 px-3 py-1 rounded w-24"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const pageNum = Math.max(1, Math.min(totalPages, Number(jumpPage)))
              setCurrentPage(pageNum)
            }
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {['name', 'gender', 'age', 'phone', 'dob'].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col as keyof Staff)}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none hover:text-gray-900"
                >
                  <span className="flex items-center">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {renderSortIcon(col as keyof Staff)}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pageData.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-4 py-3 text-gray-800">{s.name}</td>
                <td className="px-4 py-3 text-gray-800">{s.gender}</td>
                <td className="px-4 py-3 text-gray-800">{s.age}</td>
                <td className="px-4 py-3 text-gray-800">{s.phone}</td>
                <td className="px-4 py-3 text-gray-800">{s.role}</td>
                <td className="px-4 py-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => service.deleteStaff(s.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                  {/* <button
                    onClick={() => service.printStaff(s)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    Print
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Footer */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 p-3 border-t bg-gray-50 flex-wrap">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* <button
            onClick={() => service.printAll(filtered)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Print All
          </button>
          <button
            onClick={() => service.exportCSV(filtered)}
            className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
          >
            Export CSV
          </button> */}
        </div>
      </div>
    </div>
  )
}
