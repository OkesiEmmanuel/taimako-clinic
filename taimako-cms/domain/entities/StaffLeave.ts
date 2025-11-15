export interface StaffLeave {
  id: string
  staff_id: string
  staff_name?: string
  start_date: string // YYYY-MM-DD
  end_date: string   // YYYY-MM-DD
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approved_by?: string
  created_at?: string
  updated_at?: string
}


export interface StaffComplaint {
  id: string
  staff_id: string
  title: string
  description: string
  status: 'open' | 'resolved' | 'dismissed'
  response?: string
  created_at: string
}

export interface StaffReport {
  id?: string
  staff_id: string
  title: string
  content: string
  handover_to?: string
  acknowledged?: boolean
  created_at?: string
  updated_at?: string
}


export interface StaffShift {
  id: string
  staff_id: string
  date: string
  shift_type: 'morning' | 'afternoon' | 'night'
  start_time: string
  end_time: string
  status: string
  created_at: string
}
