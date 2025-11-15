import { Complaint } from '@/domain/entities/Complaint'
import { ComplaintRepoSupabase } from '@/repos/supabase/ComplaintRepoSupabase'

export class ComplaintService {
  private repo = ComplaintRepoSupabase.getInstance()

  async listAll(): Promise<Complaint[]> {
    return this.repo.listAll()
  }

  async listByStaff(staffId: string): Promise<Complaint[]> {
    return this.repo.listByStaff(staffId)
  }

  async create(payload: Partial<Complaint>): Promise<Complaint> {
    if (!payload.staff_id || !payload.title || !payload.description) {
      throw new Error('Missing required fields')
    }
    return this.repo.create({
      ...payload,
      status: 'Open'
    })
  }

  async resolve(id: string, resolverId: string): Promise<Complaint> {
    return this.repo.resolve(id, resolverId)
  }

  async reject(id: string, resolverId: string): Promise<Complaint> {
    return this.repo.reject(id, resolverId)
  }

  async remove(id: string): Promise<void> {
    return this.repo.delete(id)
  }
}
