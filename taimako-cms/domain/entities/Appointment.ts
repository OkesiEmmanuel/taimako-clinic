
export type AppointmentStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  patientId: string
  staffId: string
  startAt: string // ISO
  endAt: string // ISO
  status: AppointmentStatus
  type: 'onsite' | 'tele' | 'video'
  requiresPrepayment: boolean
  amountDue: number
}
