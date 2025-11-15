'use client'
import { useEffect, useState,  } from 'react'
import { StaffLeaveService } from '@/services/StaffLeaveService'
import { ComplaintService } from '@/services/ComplaintService'
import { ShiftService } from '@/services/ShiftService'
import { StaffLeave } from '@/domain/entities/StaffLeave'
import { Complaint } from '@/domain/entities/Complaint'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { toast } from 'react-toastify'
import OfflineStatus from '@/components/ui/OfflineStatus'
import { supabase } from '@/lib/supabaseClient'
import { ShiftSwapRequest } from '@/domain/entities/StaffShifts'

export default function AdminDashboardPage(){
  const leaveService = new StaffLeaveService()
  const complaintService = new ComplaintService()
  const shiftService = new ShiftService()

  const [leaves, setLeaves] = useState<StaffLeave[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const loadAll = async () => {
      setLoading(true)
      try {
        const [l,c,s] = await Promise.all([leaveService.listAll(), complaintService.listAll(), shiftService.listSwapRequests()])
        setLeaves(l); setComplaints(c); setSwaps(s)
      } catch(err){ console.error(err); toast.error('Failed load admin data') } finally { setLoading(false) }
    }
    loadAll()
  },[])

  const handleLeave = async (id:string, action:'Approved'|'Rejected') => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if(!user) throw new Error('Not auth')
      if(action === 'Approved') await leaveService.approveLeave(id, user.id)
      else await leaveService.rejectLeave(id, user.id)
      setLeaves(prev => prev.map(p => p.id === id ? {...p, status: action} : p))
      toast.success(`Leave ${action.toLowerCase()}`)
    } catch(err){ console.error(err); toast.error('Failed') }
  }

  const handleComplaint = async (id:string, action:'Resolved'|'Rejected') => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if(!user) throw new Error('Not auth')
      if(action === 'Resolved') await complaintService.resolve(id, user.id)
      else await complaintService.reject(id, user.id)
      setComplaints(prev => prev.map(p => p.id === id ? {...p, status: action} : p))
      toast.success(`Complaint ${action.toLowerCase()}`)
    } catch(err){ console.error(err); toast.error('Failed') }
  }

  const handleSwap = async (id:string, action:'Approved'|'Rejected') => {
    try {
      const res = await shiftService.processSwap(id, action)
      setSwaps(prev => prev.map(s => s.id === id ? {...s, status: action} : s))
      toast.success(`Swap ${action.toLowerCase()}`)
    } catch(err){ console.error(err); toast.error('Failed') }
  }

  // charts data
  const leaveStatus = [
    {name:'Approved', value: leaves.filter(l=>l.status==='Approved').length},
    {name:'Pending', value: leaves.filter(l=>l.status==='Pending').length},
    {name:'Rejected', value: leaves.filter(l=>l.status==='Rejected').length},
  ]
  const complaintStatus = [
    {name:'Resolved', value: complaints.filter(c=>c.status==='Resolved').length},
    {name:'Open', value: complaints.filter(c=>c.status==='Open').length},
  ]
  const COLORS = ['#10b981','#f59e0b','#ef4444']

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-3"><OfflineStatus /></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Leaves</h3>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={leaveStatus} dataKey="value" nameKey="name" outerRadius={60} label>{leaveStatus.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Complaints</h3>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={complaintStatus} dataKey="value" nameKey="name" outerRadius={60} label>{complaintStatus.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Pending swap requests</h3>
          <p className="text-lg font-bold">{swaps.filter(s=>s.status==='Pending').length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-semibold mb-2">Pending Leaves</h4>
          {leaves.filter(l=>l.status==='Pending').map(l => (
            <div key={l.id} className="border p-2 mb-2 rounded">
              <div className="flex justify-between">
                <div><p className="font-medium">{l.staff_name}</p><p className="text-sm">{l.start_date} → {l.end_date}</p></div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>handleLeave(l.id!, 'Approved')} className="px-2 py-1 bg-green-100 text-green-800 rounded">Approve</button>
                  <button onClick={()=>handleLeave(l.id!, 'Rejected')} className="px-2 py-1 bg-red-100 text-red-800 rounded">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          <h4 className="font-semibold mb-2">Pending Complaints</h4>
          {complaints.filter(c=>c.status==='Open').map(c => (
            <div key={c.id} className="border p-2 mb-2 rounded">
              <div className="flex justify-between">
                <div><p className="font-medium">{c.staff_name}</p><p className="text-sm">{c.title}</p></div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>handleComplaint(c.id, 'Resolved')} className="px-2 py-1 bg-green-100 text-green-800 rounded">Resolve</button>
                  <button onClick={()=>handleComplaint(c.id, 'Rejected')} className="px-2 py-1 bg-red-100 text-red-800 rounded">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          <h4 className="font-semibold mb-2">Swap Requests</h4>
          {swaps.filter(s=>s.status==='Pending').map(s => (
            <div key={s.id} className="border p-2 mb-2 rounded">
              <div className="flex justify-between">
                <div><p className="font-medium">{s.requester_name}</p><p className="text-sm">{s.reason}</p></div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>handleSwap(s.id, 'Approved')} className="px-2 py-1 bg-green-100 text-green-800 rounded">Approve</button>
                  <button onClick={()=>handleSwap(s.id, 'Rejected')} className="px-2 py-1 bg-red-100 text-red-800 rounded">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
