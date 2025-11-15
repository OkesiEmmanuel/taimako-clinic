import { StaffReport } from "@/domain/entities/StaffLeave"


export interface IStaffReportRepo {
  listByStaff(staff_id: string): Promise<StaffReport[]>
  create(payload: Partial<StaffReport>): Promise<StaffReport>
  acknowledge(id: string, ackBy?: string): Promise<StaffReport>
  listAll(): Promise<StaffReport[]>
  delete(id: string): Promise<void>
}
