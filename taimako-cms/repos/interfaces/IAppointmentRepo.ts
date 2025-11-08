
import { Appointment } from '../../domain/entities/Appointment'

export interface IAppointmentRepo {
  create(appointment: Partial<Appointment>): Promise<Appointment>
  findById(id: string): Promise<Appointment | null>
  listForStaff(staffId: string, from?: string, to?: string): Promise<Appointment[]>
  listForPatient(patientId: string): Promise<Appointment[]>
  update(appointment: Appointment): Promise<Appointment>
}
