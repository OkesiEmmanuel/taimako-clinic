export interface Complaint {
  id: string
  staff_id: string
  staff_name?: string
  title: string
  description: string
  status: 'Open' | 'Resolved' | 'Rejected'
  resolved_by?: string | null
  resolved_at?: string | null
  created_at?: string
  updated_at?: string
}
