// src/lib/di.ts
import { UserRepoSupabase } from '../repos/supabase/UserRepoSupabase'
import { AppointmentRepoSupabase } from '../repos/supabase/AppointmentRepoSupabase'
import { BookAppointmentUseCase } from '../use-cases/BookAppointmentUseCase'

export const makeBookAppointmentUseCase = () => {
  const userRepo = new UserRepoSupabase()
  const appointmentRepo = new AppointmentRepoSupabase()
  return new BookAppointmentUseCase(appointmentRepo, userRepo)
}
