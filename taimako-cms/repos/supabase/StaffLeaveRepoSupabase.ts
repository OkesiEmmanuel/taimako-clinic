
import { StaffLeave } from '@/domain/entities/StaffLeave'
import { supabase } from '@/lib/supabaseClient'
import { IStaffLeaveRepo } from '../interfaces/IStaffLeaveRepo'

export class StaffLeaveRepoSupabase implements IStaffLeaveRepo {
  private static instance: StaffLeaveRepoSupabase

  private constructor() {}

  public static getInstance(): StaffLeaveRepoSupabase {
    if (!StaffLeaveRepoSupabase.instance) {
      StaffLeaveRepoSupabase.instance = new StaffLeaveRepoSupabase()
    }
    return StaffLeaveRepoSupabase.instance
  }

  async listAll(): Promise<StaffLeave[]> {
    const { data, error } = await supabase
      .from('staff_leaves')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as StaffLeave[]
  }

  async listByStaff(staff_id: string): Promise<StaffLeave[]> {
    const { data, error } = await supabase
      .from('staff_leaves')
      .select('*')
      .eq('staff_id', staff_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as StaffLeave[]
  }

  async create(payload: Partial<StaffLeave>): Promise<StaffLeave> {
    const { data, error } = await supabase
      .from('staff_leaves')
      .insert({ ...payload })
      .select()
      .single()
    if (error) throw error
    return data as StaffLeave
  }

  async updateStatus(id: string, status: 'Approved' | 'Rejected', approver?: string): Promise<StaffLeave> {
    const updatePayload: Partial<StaffLeave> = {
      status,
      approved_by: approver ?? "",
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('staff_leaves')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as StaffLeave
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('staff_leaves').delete().eq('id', id)
    if (error) throw error
  }
}
