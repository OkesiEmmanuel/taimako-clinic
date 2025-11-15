'use client'

import { useEffect, useState, useMemo } from 'react'
import OfflineStatus from '@/components/ui/OfflineStatus'
import StaffForm from './new/page'
import { Staff, StaffService } from '@/services/StaffService'
import StaffTable from './components/StaffTable'

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [selected, setSelected] = useState<Staff | null>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [service, setService] = useState<StaffService | null>(null)

  // Initialize service and load staff
  useEffect(() => {
    const srv = new StaffService((updated) => setStaffList(updated))
    setService(srv)
    srv.loadStaff()
    const unsub = srv.subscribeRealtime?.() // optional if you implement real-time
    const interval = setInterval(() => srv.syncQueue(), 60_000)
    window.addEventListener('online', () => srv.syncQueue())

    return () => {
      unsub?.()
      clearInterval(interval)
    }
  }, [])

  // Filtered staff based on search and role
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchRole = filterRole === 'All' || s.role === filterRole
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q)
      return matchRole && matchSearch
    })
  }, [staffList, search, filterRole])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'address', label: 'Address' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Clinic Staff</h1>
        <OfflineStatus />
      </div>

      {/* Search & Role Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="border border-gray-300 text-gray-700 bg-white rounded px-3 py-1"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 text-gray-700 bg-white rounded px-3 py-1"
        >
          <option value="All">All Roles</option>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Staff Form */}
      {service && (
        <StaffForm
          selected={selected ?? undefined}
          onSubmit={(data: Staff) => {
            service.saveStaff(data)
            setSelected(null)
          }}
        />
      )}

      {/* Staff Table */}

       {service && (
               <StaffTable
                 staff={staffList}
                 service={service}
                 onEdit={(p) => setSelected(p)}
                 defaultRowsPerPage={10} // optional, default is 10
               />
             )}
    
    </div>
  )
}
