import { StaffShift } from "@/domain/entities/StaffLeave"
import { ShiftSwapRequest } from "@/domain/entities/StaffShifts"
import { ShiftRepoSupabase } from "@/repos/supabase/StaffShiftRepoSupabase"

export class ShiftService {
  private repo = ShiftRepoSupabase.getInstance()

  async listByStaff(staffId: string) { return this.repo.listByStaff(staffId) }
  async listAll() { return this.repo.listAll() }
  async assign(shift: Partial<StaffShift>) { return this.repo.assign(shift) }
  async updateStatus(id: string, status: string) { return this.repo.updateStatus(id, status) }
  async remove(id: string) { return this.repo.delete(id) }

  // swap
  async listSwapRequests() { return this.repo.listSwapRequests() }
  async requestSwap(payload: Partial<ShiftSwapRequest>) {
    if (!payload.shift_id || !payload.requester_id) throw new Error('Missing fields')
    return this.repo.createSwapRequest(payload)
  }
  async processSwap(id: string, status: 'Approved' | 'Rejected', adminComment?: string) {
    return this.repo.updateSwapRequest(id, status, adminComment)
  }
}
