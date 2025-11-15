import { StaffShift } from '@/domain/entities/StaffLeave'
import { ShiftSwapRequest } from '@/domain/entities/StaffShifts'
import { supabase } from '@/lib/supabaseClient'
import { IShiftRepo } from '../interfaces/IShiftRepo'


export class ShiftRepoSupabase implements IShiftRepo {
  private static instance: ShiftRepoSupabase
  private constructor() {}
  public static getInstance() {
    if (!ShiftRepoSupabase.instance) ShiftRepoSupabase.instance = new ShiftRepoSupabase()
    return ShiftRepoSupabase.instance
  }

  async listByStaff(staff_id: string) {
    const { data, error } = await supabase.from('staff_shifts').select('*').eq('staff_id', staff_id).order('date', { ascending: true })
    if (error) throw error
    return data as StaffShift[]
  }

  async listAll() {
    const { data, error } = await supabase.from('staff_shifts').select('*').order('date', { ascending: true })
    if (error) throw error
    return data as StaffShift[]
  }

  async assign(shift: Partial<StaffShift>) {
    const { data, error } = await supabase.from('staff_shifts').insert(shift).select().single()
    if (error) throw error
    return data as StaffShift
  }

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase.from('staff_shifts').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return data as StaffShift
  }

  async delete(id: string) {
    const { error } = await supabase.from('staff_shifts').delete().eq('id', id)
    if (error) throw error
  }

  // Swap requests
  async listSwapRequests() {
    const { data, error } = await supabase.from('shift_swap_requests').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data as ShiftSwapRequest[]
  }

  async createSwapRequest(payload: Partial<ShiftSwapRequest>) {
    const { data, error } = await supabase.from('shift_swap_requests').insert(payload).select().single()
    if (error) throw error
    return data as ShiftSwapRequest
  }

  async updateSwapRequest(id: string, status: 'Approved' | 'Rejected', adminComment?: string) {
    const { data, error } = await supabase.from('shift_swap_requests').update({ status, admin_comment: adminComment, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data as ShiftSwapRequest
  }
}
