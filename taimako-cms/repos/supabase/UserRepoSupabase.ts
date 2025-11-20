import { User, Role } from '@/domain/entities/User';
import { supabase } from '@/lib/supabaseClient';
import { IUserRepo } from '../interfaces/IUserRepo';

export class UserRepoSupabase implements IUserRepo {
  private static instance: UserRepoSupabase;

  private constructor() {}

  public static getInstance() {
    if (!UserRepoSupabase.instance) UserRepoSupabase.instance = new UserRepoSupabase();
    return UserRepoSupabase.instance;
  }

  async findById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as User | null;
  }

  async create(user: Partial<User>): Promise<User> {
    if (!user.role) throw new Error('Role is required');
    const validRoles: Role[] = ['admin', 'reception', 'doctor', 'nurse', 'accountant', 'patient'];
    if (!validRoles.includes(user.role)) throw new Error('Invalid role');

    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  }

  async listStaff(): Promise<User[]> {
    const staffRoles: Role[] = ['doctor', 'nurse', 'reception', 'accountant'];
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .in('role', staffRoles);
    if (error) throw error;
    return data as User[];
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const validRoles: Role[] = ['admin', 'reception', 'doctor', 'nurse', 'accountant', 'patient'];
    if (!validRoles.includes(role)) throw new Error('Invalid role');

    const { data, error } = await supabase
      .from('staff')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
