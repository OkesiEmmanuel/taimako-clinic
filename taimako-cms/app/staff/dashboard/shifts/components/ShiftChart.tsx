'use client'

import { StaffShift } from '@/domain/entities/StaffShifts'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ShiftChart({ shifts }: { shifts: StaffShift[] }) {
  const data = useMemo(() => {
    const map:{[k:string]:number} = {}
    shifts.forEach(s => { map[s.shift_type] = (map[s.shift_type]||0)+1 })
    return Object.entries(map).map(([shift, count])=>({shift, count}))
  }, [shifts])

  if (!data.length) return <p className="text-gray-500">No shifts to chart.</p>

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Shift distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shift" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
