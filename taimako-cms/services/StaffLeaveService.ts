import { StaffLeave } from '@/domain/entities/StaffLeave'
import { StaffLeaveRepoSupabase } from '@/repos/supabase/StaffLeaveRepoSupabase'

export class StaffLeaveService {
  private repo = StaffLeaveRepoSupabase.getInstance()

  async listAll() {
    return this.repo.listAll()
  }

  async listByStaff(staffId: string) {
    return this.repo.listByStaff(staffId)
  }

  async applyLeave(payload: Partial<StaffLeave>) {
    // basic validation can be added here
    if (!payload.staff_id || !payload.start_date || !payload.end_date || !payload.reason) {
      throw new Error('Missing required fields')
    }
    return this.repo.create({
      ...payload,
      status: 'Pending'
    })
  }

  async approveLeave(id: string, approverId: string) {
    return this.repo.updateStatus(id, 'Approved', approverId)
  }

  async rejectLeave(id: string, approverId: string) {
    return this.repo.updateStatus(id, 'Rejected', approverId)
  }

  async removeLeave(id: string) {
    return this.repo.delete(id)
  }
}
