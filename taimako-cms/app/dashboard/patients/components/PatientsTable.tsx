'use client'

import { Patient, PatientService } from '@/services'
import { useMemo } from 'react'


interface PatientTableProps {
  patients: Patient[]
  service: PatientService
  onEdit: (patient: Patient) => void
  search?: string
  filterGender?: string
}

export default function PatientTable({
  patients,
  service,
  onEdit,
  search = '',
  filterGender = 'All',
}: PatientTableProps) {
  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchGender = filterGender === 'All' || p.gender === filterGender
      const q = search.toLowerCase().trim()
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q)
      return matchGender && matchSearch
    })
  }, [patients, search, filterGender])

  if (!patients.length) return <p>No patients found.</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">DOB</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.gender}</td>
              <td className="p-2 border">{p.age}</td>
              <td className="p-2 border">{p.phone}</td>
              <td className="p-2 border">{p.dob}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => service.deletePatient(p.id)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => service.printPatient(p)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => service.printAll(filtered)}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Print All
        </button>
        <button
          onClick={() => service.exportCSV(filtered)}
          className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
        >
          Export CSV
        </button>
      </div>
    </div>
  )
}
