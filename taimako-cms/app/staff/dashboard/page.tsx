'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Staff, StaffService } from '@/services/StaffService'
import StaffForm from '../page'

export default function StaffDashboard() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  
  // Initialize service
  const staffService = new StaffService((list) => setStaffList(list))

  useEffect(() => {
    staffService.loadStaff()
  }, [])

  /** Called when form submits */
  const handleSaveStaff = async (data: Staff, password?: string) => {
    try {
      await staffService.saveStaff(data, password)
      setSelectedStaff(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save staff')
    }
  }

  /** Called when user clicks edit */
  const handleEdit = (staff: Staff) => setSelectedStaff(staff)

  /** Called when user deletes staff */
  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this staff?')) return
    await staffService.deleteStaff(id)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-700">Staff Management</h1>

     

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Staff List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.role}</td>
                <td className="p-2 border">{s.department}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
