'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import ComplaintForm from '../complaints/components/ComplaintForm'
import ComplaintTable from '../complaints/components/ComplaintTable'
import LeaveForm from '../leave/components/LeaveForm'
import LeaveTable from '../leave/components/LeaveTable'
import { StaffLeave } from '@/domain/entities/StaffLeave'
import { StaffLeaveService } from '@/services/StaffLeaveService'
import { Staff } from '@/services/StaffService'
import ReportForm from '../reports/components/ReportForm'
import ReportTable from '../reports/components/ReportTable'

interface DashboardProps {
  staff: Staff
}

export default function StaffDashboard({ staff }: DashboardProps) {
  const [leaves, setLeaves] = useState<StaffLeave[]>([])
  const [complaints, setComplaints] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [leaveService, setLeaveService] = useState<StaffLeaveService | null>(null)

  const [activeTab, setActiveTab] = useState<'leaves' | 'complaints' | 'reports'>('leaves')

  useEffect(() => {
    const srv = new StaffLeaveService()
    setLeaveService(srv)
    srv.listAll()

    // Load complaints
    const loadComplaints = async () => {
      const { data, error } = await supabase
        .from('staff_complaints')
        .select('*')
        .eq('staff_id', staff.id)
        .order('created_at', { ascending: false })
      if (error) toast.error('Failed to load complaints')
      else setComplaints(data)
    }

    // Load daily reports
    const loadReports = async () => {
      const { data, error } = await supabase
        .from('staff_reports')
        .select('*')
        .eq('staff_id', staff.id)
        .order('date', { ascending: false })
      if (error) toast.error('Failed to load reports')
      else setReports(data)
    }

    loadComplaints()
    loadReports()
  }, [staff.id])

  // Charts data
  const leaveStatusData = [
    { name: 'Approved', value: leaves.filter((l) => l.status === 'Approved').length },
    { name: 'Pending', value: leaves.filter((l) => l.status === 'Pending').length },
    { name: 'Rejected', value: leaves.filter((l) => l.status === 'Rejected').length },
  ]

  const complaintStatusData = [
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'Resolved').length },
    { name: 'Pending', value: complaints.filter((c) => c.status === 'Pending').length },
    { name: 'Rejected', value: complaints.filter((c) => c.status === 'Rejected').length },
  ]

  const COLORS = ['#28a745', '#ffc107', '#dc3545']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-700">Welcome, {staff.name}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['leaves', 'complaints', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab
                ? 'bg-white border border-b-0 border-gray-300'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      <div className="bg-white p-4 rounded shadow">
        {activeTab === 'leaves' && leaveService && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <LeaveForm onCreated={(l) => leaveService.applyLeave(l)} />
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leaveStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {leaveStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <LeaveTable leaves={leaves} />
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <ComplaintForm  onCreated={(c) => setComplaints([c, ...complaints])} />
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={complaintStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {complaintStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ComplaintTable complaints={complaints} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <ReportForm onCreated={(r) => setReports([r, ...reports])} />

            <ReportTable reports={reports} />
          </div>
        )}
      </div>
    </div>
  )
}
