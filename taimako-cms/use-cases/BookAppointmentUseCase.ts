
import { IAppointmentRepo } from '../repos/interfaces/IAppointmentRepo'
import { IUserRepo } from '../repos/interfaces/IUserRepo'
import { Appointment } from '../domain/entities/Appointment'
import { v4 as uuidv4 } from 'uuid'

export class BookAppointmentUseCase {
  constructor(private appointmentRepo: IAppointmentRepo, private userRepo: IUserRepo) {}

  async execute(input: {
    patientId: string
    staffId: string
    startAt: string
    endAt: string
    type: Appointment['type']
    requiresPrepayment: boolean
    amountDue: number
  }) {
    const patient = await this.userRepo.findById(input.patientId)
    if (!patient) throw new Error('Patient not found')

    const staff = await this.userRepo.findById(input.staffId)
    if (!staff) throw new Error('Staff not found')

    const existing = await this.appointmentRepo.listForStaff(input.staffId, input.startAt, input.endAt)
    const overlap = existing.find(a => !(a.endAt <= input.startAt || a.startAt >= input.endAt))
    if (overlap) throw new Error('Doctor already has an appointment in this slot')

    const appointment: Partial<Appointment> = {
      id: uuidv4(),
      patientId: input.patientId,
      staffId: input.staffId,
      startAt: input.startAt,
      endAt: input.endAt,
      status: 'pending',
      type: input.type,
      requiresPrepayment: input.requiresPrepayment,
      amountDue: input.amountDue
    }

    const created = await this.appointmentRepo.create(appointment)
    return created
  }
}
