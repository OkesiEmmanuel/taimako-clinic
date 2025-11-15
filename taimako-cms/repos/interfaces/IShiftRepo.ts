import { StaffShift } from "@/domain/entities/StaffLeave"
import { ShiftSwapRequest } from "@/domain/entities/StaffShifts"

export interface IShiftRepo {
  listByStaff(staff_id: string): Promise<StaffShift[]>
  listAll(): Promise<StaffShift[]>
  assign(shift: Partial<StaffShift>): Promise<StaffShift>
  updateStatus(id: string, status: string): Promise<StaffShift>
  delete(id: string): Promise<void>

  // swap requests
  listSwapRequests(): Promise<ShiftSwapRequest[]>
  createSwapRequest(payload: Partial<ShiftSwapRequest>): Promise<ShiftSwapRequest>
  updateSwapRequest(id: string, status: 'Approved' | 'Rejected', adminComment?: string): Promise<ShiftSwapRequest>
}
