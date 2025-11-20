
import { supabase } from '@/lib/supabaseClient'
import { IStaffReportRepo } from '../interfaces/IStaffReportRepo'
import { StaffReport } from '@/domain/entities/StaffReport'

export class StaffReportRepoSupabase implements IStaffReportRepo {
  private static instance: StaffReportRepoSupabase
  private constructor() {}
  public static getInstance() {
    if (!StaffReportRepoSupabase.instance) StaffReportRepoSupabase.instance = new StaffReportRepoSupabase()
    return StaffReportRepoSupabase.instance
  }

  async listByStaff(staff_id: string) {
    const { data, error } = await supabase.from('staff_reports').select('*').eq('staff_id', staff_id).order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as StaffReport[]
  }

  async listAll() {
    const { data, error } = await supabase.from('staff_reports').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as StaffReport[]
  }

  async create(payload: StaffReport) {
    const { data, error } = await supabase.from('staff_reports').insert(payload).select().single()
    if (error) throw error
    return data as StaffReport
  }

  async acknowledge(id: string) {
    const { data, error } = await supabase.from('staff_reports').update({ acknowledged: true, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data as StaffReport
  }

  async delete(id: string) {
    const { error } = await supabase.from('staff_reports').delete().eq('id', id)
    if (error) throw error
  }
}
