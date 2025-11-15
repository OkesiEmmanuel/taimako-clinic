export interface StaffShift {
  id: string
  staff_id: string
  staff_name?: string
  date: string // YYYY-MM-DD
  shift_type: 'morning' | 'afternoon' | 'night'
  start_time?: string
  end_time?: string
  status?: string
  created_at?: string
  updated_at?: string
}


export interface ShiftSwapRequest {
  id: string
  shift_id: string
  requester_id: string
  requester_name?: string
  requested_with?: string | null
  reason?: string
  status: 'Pending' | 'Approved' | 'Rejected'
  admin_comment?: string | null
  created_at?: string
  updated_at?: string
}
