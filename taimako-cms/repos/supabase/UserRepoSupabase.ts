
import { IUserRepo } from '../interfaces/IUserRepo'
import { supabase } from '../../lib/supabaseClient'
import { User } from '../../domain/entities/User'

export class UserRepoSupabase implements IUserRepo {
  async findById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) throw error
    return data as User
  }
  async findByEmail(email: string) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (error && error.code !== 'PGRST116') throw error
    return data as User | null
  }
  async create(user: Partial<User>) {
    const payload = { ...user }
    const { data, error } = await supabase.from('users').insert(payload).select().single()
    if (error) throw error
    return data as User
  }
  async listStaff() {
    const { data, error } = await supabase.from('users').select('*').neq('role', 'patient')
    if (error) throw error
    return data as User[]
  }
}
