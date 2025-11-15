export interface StaffReport {
  id: string
  staff_id: string
  staff_name?: string
  title: string
  content: string
  handover_to?: string | null
  acknowledged: boolean
  created_at?: string
  updated_at?: string
}
