'use client'

import { Staff } from '@/services/StaffService'
import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'

interface StaffFormProps {
  selected?: Staff
  onSubmit: (data: Staff) => void
}

export default function StaffForm({ selected, onSubmit }: StaffFormProps) {
  const [staff, setStaff] = useState<Staff>({
    id: selected?.id,
    name: selected?.name || '',
    age: selected?.age || '',
    gender: selected?.gender || 'Male',
    email: selected?.email || '',
    phone: selected?.phone || '',
    role: selected?.role || 'Admin',
    department: selected?.department || '',
    address: selected?.address || '',
  })

  useEffect(() => {
    if (selected) setStaff(selected)
  }, [selected])

  const handleChange = (field: keyof Staff, value: string) => {
    setStaff((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staff.name || !staff.email || !staff.role) {
      toast.error('Name, Email, and Role are required.')
      return
    }
    onSubmit(staff)
    setStaff({
      id: undefined,
      name: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: '',
      role: 'Admin',
      department: '',
      address: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 bg-gray-50 border rounded-lg shadow-sm space-y-4  w-full"
    >
      <h2 className="text-lg font-semibold text-gray-700">
        {selected ? 'Edit Staff' : 'Add Staff'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 mb-1">Name *</label>
          <input
            type="text"
            value={staff.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Email *</label>
          <input
            type="email"
            value={staff.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Phone</label>
          <input
            type="text"
            value={staff.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Age</label>
          <input
            type="number"
            value={staff.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Gender</label>
          <select
            value={staff.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Role *</label>
          <input
            type="text"
            value={staff.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Department</label>
          <input
            type="text"
            value={staff.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-600 mb-1">Address</label>
          <textarea
            value={staff.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {selected ? 'Update' : 'Add'} Staff
        </button>
      </div>
    </form>
  )
}
