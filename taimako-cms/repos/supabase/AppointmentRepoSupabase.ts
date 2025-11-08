
import { IAppointmentRepo } from '../interfaces/IAppointmentRepo'
import { supabase } from '../../lib/supabaseClient'
import { Appointment } from '../../domain/entities/Appointment'

export class AppointmentRepoSupabase implements IAppointmentRepo {
  async create(appointment: Partial<Appointment>) {
    const { data, error } = await supabase.from('appointments').insert(appointment).select().single()
    if (error) throw error
    return data as Appointment
  }
  async findById(id: string) {
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw error
    return data as Appointment | null
  }
  async listForStaff(staffId: string, from?: string, to?: string) {
    let q: any = supabase.from('appointments').select('*').eq('staffId', staffId)
    if (from) q = q.gte('startAt', from)
    if (to) q = q.lte('startAt', to)
    const { data, error } = await q
    if (error) throw error
    return data as Appointment[]
  }
  async listForPatient(patientId: string) {
    const { data, error } = await supabase.from('appointments').select('*').eq('patientId', patientId)
    if (error) throw error
    return data as Appointment[]
  }
  async update(appointment: Appointment) {
    const { data, error } = await supabase.from('appointments').update(appointment).eq('id', appointment.id).select().single()
    if (error) throw error
    return data as Appointment
  }
}
