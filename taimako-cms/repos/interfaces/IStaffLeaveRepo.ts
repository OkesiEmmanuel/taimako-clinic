import { StaffLeave } from '@/domain/entities/StaffLeave'

export interface IStaffLeaveRepo {
  listAll(): Promise<StaffLeave[]>
  listByStaff(staff_id: string): Promise<StaffLeave[]>
  create(payload: Partial<StaffLeave>): Promise<StaffLeave>
  updateStatus(id: string, status: 'Approved' | 'Rejected', approver?: string): Promise<StaffLeave>
  delete(id: string): Promise<void>
}
