import { StaffReport } from '@/domain/entities/StaffReport'
import { StaffReportRepoSupabase } from '@/repos/supabase/StaffReportRepoSupabase'

/** DTO for creating a report */
export interface CreateStaffReportDTO {
  staff_id: string
  title: string
  content: string
  handover_to?: string
}

export class StaffReportService {
  private static instance: StaffReportService
  private repo = StaffReportRepoSupabase.getInstance()

  private constructor() {}

  /** Singleton accessor */
  public static getInstance(): StaffReportService {
    if (!StaffReportService.instance) {
      StaffReportService.instance = new StaffReportService()
    }
    return StaffReportService.instance
  }

  async listByStaff(staffId: string) {
    if (!staffId) throw new Error("Missing staffId")
    return this.repo.listByStaff(staffId)
  }

  async listAll() {
    return this.repo.listAll()
  }

  async create(payload: CreateStaffReportDTO) {
    if (!payload.staff_id || !payload.title || !payload.content) {
      throw new Error('Missing fields')
    }

    const cleanPayload = {
      staff_id: payload.staff_id,
      title: payload.title.trim(),
      content: payload.content.trim(),
      handover_to: payload.handover_to || null,
    }

    return this.repo.create(cleanPayload as any)
  }

  async acknowledge(id: string) {
    if (!id) throw new Error("Missing id")
    return this.repo.acknowledge(id)
  }

  async remove(id: string) {
    if (!id) throw new Error("Missing id")
    return this.repo.delete(id)
  }
}
