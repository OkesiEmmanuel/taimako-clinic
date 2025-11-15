
import { Complaint } from '@/domain/entities/Complaint'
import { supabase } from '@/lib/supabaseClient'
import { IComplaintRepo } from '../interfaces/IComplaintRepo'

export class ComplaintRepoSupabase implements IComplaintRepo {
  private static instance: ComplaintRepoSupabase

  private constructor() {}

  public static getInstance(): ComplaintRepoSupabase {
    if (!ComplaintRepoSupabase.instance) {
      ComplaintRepoSupabase.instance = new ComplaintRepoSupabase()
    }
    return ComplaintRepoSupabase.instance
  }

  async listAll(): Promise<Complaint[]> {
    const { data, error } = await supabase
      .from('staff_complaints')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as Complaint[]
  }

  async listByStaff(staff_id: string): Promise<Complaint[]> {
    const { data, error } = await supabase
      .from('staff_complaints')
      .select('*')
      .eq('staff_id', staff_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as Complaint[]
  }

  async create(payload: Partial<Complaint>): Promise<Complaint> {
    const { data, error } = await supabase
      .from('staff_complaints')
      .insert({ ...payload })
      .select()
      .single()
    if (error) throw error
    return data as Complaint
  }

  async resolve(id: string, resolverId: string): Promise<Complaint> {
    const { data, error } = await supabase
      .from('staff_complaints')
      .update({ status: 'Resolved', resolved_by: resolverId, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Complaint
  }

  async reject(id: string, resolverId: string): Promise<Complaint> {
    const { data, error } = await supabase
      .from('staff_complaints')
      .update({ status: 'Rejected', resolved_by: resolverId, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Complaint
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('staff_complaints').delete().eq('id', id)
    if (error) throw error
  }
}
