
import { User } from '../../domain/entities/User'

export interface IUserRepo {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: Partial<User>): Promise<User>
  listStaff(): Promise<User[]>
}
