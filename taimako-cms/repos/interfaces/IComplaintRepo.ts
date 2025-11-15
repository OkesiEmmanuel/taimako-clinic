import { Complaint } from '@/domain/entities/Complaint'

export interface IComplaintRepo {
  listAll(): Promise<Complaint[]>
  listByStaff(staff_id: string): Promise<Complaint[]>
  create(payload: Partial<Complaint>): Promise<Complaint>
  resolve(id: string, resolverId: string): Promise<Complaint>
  reject(id: string, resolverId: string): Promise<Complaint>
  delete(id: string): Promise<void>
}
